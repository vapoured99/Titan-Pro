export interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp: any;
  notes?: string;
  difficulty?: "easy" | "moderate" | "hard" | "failure";
  source?: string;
}

export interface ProgressionState {
  exerciseName: string;
  hasRecommendation: boolean;
  isSuppressed: boolean;
  showTag: boolean;
  recommendationWeight: number;
  recommendedWeight: number;
  reason: string;
}

/**
 * Calculates the progression state for a single exercise based on its logged set history
 * and optionally any currently entered active set weights.
 *
 * Progression Rules:
 * 1. baseline (W_3em_prev): The highest weight where the user has logged >= 3 sets of difficulty "easy" or "moderate".
 * 2. trigger (W_trigger): The highest weight (>= W_3em_prev) where the user has logged >= 10 reps on a set.
 *    If such a trigger weight exists, a weight increase recommendation is active.
 * 3. suppression: If the user "enters a higher weight" (either logged in history, or currently active in inputs),
 *    the recommendation tag/milestone is suppressed/removed, UNTIL they achieve 3 easy/moderate sets at a weight
 *    higher than the previous baseline W_3em_prev.
 */
function parseSafeDate(dStr: string): number {
  if (!dStr) return 0;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
    const t = new Date(dStr).getTime();
    if (!isNaN(t)) return t;
  }
  let t = new Date(dStr).getTime();
  if (!isNaN(t)) return t;
  const currentYear = new Date().getFullYear();
  t = new Date(`${dStr} ${currentYear}`).getTime();
  if (!isNaN(t)) return t;
  return 0;
}

export function getExerciseProgressionState(
  exName: string,
  allLoggedSets: SessionSet[],
  activeSetInputs?: Record<string, { weight: string; reps: string; logged: boolean; difficulty: string }>
): ProgressionState {
  const normName = exName.trim().toLowerCase();

  // 1. Get all logged sets for this exercise
  const exSets = allLoggedSets.filter(
    (s) => s && s.exerciseName && s.exerciseName.trim().toLowerCase() === normName
  );

  // 2. Group sets by date (session) to find session-level progression achievements.
  // A weight increase recommendation is triggered when the user achieves >= 3 easy/moderate sets
  // (and 0 hard sets) at weight W in their MOST RECENT session.
  const setsByDate: Record<string, SessionSet[]> = {};
  exSets.forEach((s) => {
    const dKey = s.date || "";
    if (!setsByDate[dKey]) setsByDate[dKey] = [];
    setsByDate[dKey].push(s);
  });

  const dates = Object.keys(setsByDate).filter(Boolean).sort((a, b) => {
    const timeA = parseSafeDate(a);
    const timeB = parseSafeDate(b);
    return timeB - timeA; // Latest first
  });

  let wTrigger = 0;

  if (dates.length > 0) {
    const latestDate = dates[0];
    const sessionSets = setsByDate[latestDate];

    // Group sets in this latest session by weight
    const setsByWeightForSession: Record<number, SessionSet[]> = {};
    sessionSets.forEach((s) => {
      const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
      if (!isNaN(w)) {
        if (!setsByWeightForSession[w]) setsByWeightForSession[w] = [];
        setsByWeightForSession[w].push(s);
      }
    });

    Object.entries(setsByWeightForSession).forEach(([wStr, sets]) => {
      const w = parseFloat(wStr);
      const easyModCount = sets.filter(s => s.difficulty === "easy" || s.difficulty === "moderate").length;
      const hardCount = sets.filter(s => s.difficulty === "hard").length;

      // Trigger condition: >= 3 easy/moderate sets, and 0 hard sets in this session.
      // Failure sets are neutral: they don't block progression, but they also don't count towards the 3 easy/moderate sets.
      if (easyModCount >= 3 && hardCount === 0) {
        if (w > wTrigger) {
          wTrigger = w;
        }
      }
    });
  }

  let setsOf10PlusAtTrigger = 0;
  if (wTrigger > 0) {
    const setsAtTriggerWeight = exSets.filter((s) => {
      const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
      return w === wTrigger;
    });
    setsOf10PlusAtTrigger = setsAtTriggerWeight.filter((s) => {
      const r = typeof s.reps === 'string' ? parseInt(s.reps, 10) : s.reps;
      return !isNaN(r) && r >= 10;
    }).length;
  }

  const hasRecommendation = wTrigger > 0;
  const recommendedWeight = hasRecommendation ? wTrigger + 2.5 : 0;

  // 3. Check for Suppression: has the user logged or entered a HIGHER weight than the recommendation trigger?
  let isSuppressed = false;
  let maxWeightLogged = 0;

  // Find max logged weight in history
  exSets.forEach((s) => {
    const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
    if (!isNaN(w) && w > maxWeightLogged) {
      maxWeightLogged = w;
    }
  });

  // Check currently entered active weights from inputs
  let maxWeightActive = 0;
  if (activeSetInputs) {
    Object.entries(activeSetInputs).forEach(([key, input]) => {
      if (key.toLowerCase().startsWith(`${normName}-`)) {
        const wVal = parseFloat(input.weight) || 0;
        if (wVal > maxWeightActive) {
          maxWeightActive = wVal;
        }
      }
    });
  }

  const maxWeightEnteredOrLogged = Math.max(maxWeightLogged, maxWeightActive);

  // If they have logged or entered a weight HIGHER than the recommendation trigger, suppress it!
  if (hasRecommendation && maxWeightEnteredOrLogged > wTrigger) {
    isSuppressed = true;
  }

  // Sort exSets by date and time (latest first) to check the last 3 sets
  const sortedSets = [...exSets].sort((a, b) => {
    const dateA = parseSafeDate(a.date);
    const dateB = parseSafeDate(b.date);
    if (dateA !== dateB) {
      return dateB - dateA; // Latest date first
    }
    const tsA = a.timestamp?.seconds || a.timestamp?._seconds || 0;
    const tsB = b.timestamp?.seconds || b.timestamp?._seconds || 0;
    if (tsA !== tsB) {
      return tsB - tsA; // Latest timestamp first
    }
    const idxA = allLoggedSets.indexOf(a);
    const idxB = allLoggedSets.indexOf(b);
    return idxB - idxA; // Higher index (newer) first
  });

  const last3Sets = sortedSets.slice(0, 3);
  let hasHardInLast3 = last3Sets.some((s) => s.difficulty === "hard");

  // Also check currently entered active weights/inputs for any "hard" rating for this exercise
  if (activeSetInputs) {
    Object.entries(activeSetInputs).forEach(([key, input]) => {
      if (key.toLowerCase().startsWith(`${normName}-`)) {
        if (input.difficulty === "hard") {
          hasHardInLast3 = true;
        }
      }
    });
  }

  const showTag = hasRecommendation && !isSuppressed && !hasHardInLast3;

  // Build a clean explanation/reason
  let reason = "";
  if (showTag) {
    if (setsOf10PlusAtTrigger >= 3) {
      reason = `Completed ${setsOf10PlusAtTrigger} sets of 10+ reps at ${wTrigger}kg. Progressive overload is strongly recommended to continue muscle adaptation.`;
    } else {
      reason = `Completed sets at ${wTrigger}kg with Easy/Moderate intensity. Increasing weight is suggested to maintain growth.`;
    }
  }

  return {
    exerciseName: exName,
    hasRecommendation,
    isSuppressed,
    showTag,
    recommendationWeight: wTrigger,
    recommendedWeight,
    reason,
  };
}

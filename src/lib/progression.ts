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

  // 2. Find W_3em_prev: highest weight where the user has logged >= 3 sets of difficulty "easy" or "moderate"
  const easyModSetsByWeight: Record<number, number> = {};
  exSets.forEach((s) => {
    if (s.difficulty === "easy" || s.difficulty === "moderate") {
      const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
      if (!isNaN(w)) {
        easyModSetsByWeight[w] = (easyModSetsByWeight[w] || 0) + 1;
      }
    }
  });

  let w3emPrev = 0;
  Object.entries(easyModSetsByWeight).forEach(([wStr, count]) => {
    const w = parseFloat(wStr);
    if (count >= 3 && w > w3emPrev) {
      w3emPrev = w;
    }
  });

  // 3. Find W_trigger: highest weight (>= w3emPrev) where they completed >= 10 reps
  let wTrigger = 0;
  let triggerReps = 0;
  let triggerDate = "";
  let setsOf10PlusAtTrigger = 0;

  exSets.forEach((s) => {
    const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
    const r = typeof s.reps === 'string' ? parseInt(s.reps, 10) : s.reps;
    if (isNaN(w) || isNaN(r)) return;

    if (r >= 10 && w >= w3emPrev) {
      if (w > wTrigger) {
        wTrigger = w;
        triggerReps = r;
        triggerDate = s.date || "";
      }
    }
  });

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

  // 4. Check for Suppression: has the user "entered a higher weight" in logged history or current session?
  let isSuppressed = false;
  let maxWeightEnteredOrLogged = 0;

  // Find max logged weight in history
  exSets.forEach((s) => {
    const w = typeof s.weight === 'string' ? parseFloat(s.weight) : s.weight;
    if (!isNaN(w) && w > maxWeightEnteredOrLogged) {
      maxWeightEnteredOrLogged = w;
    }
  });

  // Check currently entered active weights from inputs
  if (activeSetInputs) {
    Object.entries(activeSetInputs).forEach(([key, input]) => {
      if (key.toLowerCase().startsWith(`${normName}-`)) {
        const wVal = parseFloat(input.weight) || 0;
        if (wVal > maxWeightEnteredOrLogged) {
          maxWeightEnteredOrLogged = wVal;
        }
      }
    });
  }

  // If they have logged or entered a weight HIGHER than the recommendation trigger, suppress it!
  if (hasRecommendation && maxWeightEnteredOrLogged > wTrigger) {
    isSuppressed = true;
  }

  const showTag = hasRecommendation && !isSuppressed;

  // Build a clean explanation/reason without hardcoded weight addition values
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

export interface ProTips {
  tips: string[];
  avoid: string[];
}

const SPECIFIC_TIPS: Record<string, ProTips> = {
  "barbell back squat": {
    tips: [
      "Create hip torque: 'screw' your feet into the floor (right foot clockwise, left foot counter-clockwise) to activate your glutes and prevent knee cave-in.",
      "Maintain a braced core: take a deep breath into your lower abdomen before descending and hold it (Valsalva maneuver) to stabilize your spine.",
      "Descent depth: lower yourself until the crease of your hips is below the top of your kneecaps (parallel) to fully engage your quadriceps and glutes."
    ],
    avoid: [
      "Avoid letting your knees cave inward (valgus collapse) during the ascent, which puts severe, dangerous lateral torque on your ligament structure.",
      "Don't let your heels lift off the platform. Shifting your weight on to your toes overloads your kneecaps and shifts work away from your posterior chain."
    ]
  },
  "romanian deadlift": {
    tips: [
      "Imagine pushing your hips back to touch a wall behind you. Think of the movement as horizontal hip displacement rather than a vertical bend.",
      "Keep the bar/dumbbells touching your legs throughout the descent to keep the center of gravity aligned with your joints.",
      "Stop descending as soon as your hips stop moving backward. Going lower only forces your lower spine to bend, taking tension off your hamstrings."
    ],
    avoid: [
      "Do not round your lower spine; keep your back flat, neck neutral, and shoulder blades pulled down and locked in place.",
      "Don't transfer the weight entirely to your toes. Maintain equal pressure across the 'tripod' of your feet: heel, big toe, and outer foot."
    ]
  },
  "barbell deadlift": {
    tips: [
      "Stance and Setup: Stand with feet hip-width apart and grip the bar slightly wider than your legs. The barbell should line up over the mid-foot.",
      "Slack Pull and Lat Engagement: Pull the slack out of the barbell until you hear it click against the plates, and squeeze your armpits as if squeezing lemons to fully engage the lats and secure the spine.",
      "Drive from the Floor: Initiate the lift by driving your feet into the floor like a leg press, keeping the barbell tight against your shins throughout the ascent.",
      "Lockout: Stand tall by contracting your glutes and hamstrings. Do not over-arch or bend backward at the top."
    ],
    avoid: [
      "Avoid pulling with a rounded back (lumbar spinal flexion), which places catastrophic shear load on your vertebral disks.",
      "Do not jerk or yank the bar off the floor with slack in the line; always establish full tension and brace before lifting."
    ]
  },
  "barbell deadlifts": {
    tips: [
      "Stance and Setup: Stand with feet hip-width apart and grip the bar slightly wider than your legs. The barbell should line up over the mid-foot.",
      "Slack Pull and Lat Engagement: Pull the slack out of the barbell until you hear it click against the plates, and squeeze your armpits as if squeezing lemons to fully engage the lats and secure the spine.",
      "Drive from the Floor: Initiate the lift by driving your feet into the floor like a leg press, keeping the barbell tight against your shins throughout the ascent.",
      "Lockout: Stand tall by contracting your glutes and hamstrings. Do not over-arch or bend backward at the top."
    ],
    avoid: [
      "Avoid pulling with a rounded back (lumbar spinal flexion), which places catastrophic shear load on your vertebral disks.",
      "Do not jerk or yank the bar off the floor with slack in the line; always establish full tension and brace before lifting."
    ]
  },
  "barbell bench press": {
    tips: [
      "Retract and depress your scapula: squeeze your shoulder blades back and down tightly into the bench cushion before you even unrack the bar.",
      "Leg drive: plant your feet flat on the floor, pushing forward (not upward) to create a rigid, highly stable arch through your mid-section.",
      "Tuck your elbows at a 45-degree angle relative to your sides. Squeezing your elbows inward reduces rotator cuff fatigue and leverages chest engagement."
    ],
    avoid: [
      "Do not bounce the bar off your chest. Lower it under absolute control, pause for a split second, then drive it up using muscular contraction.",
      "Never flare your elbows outwards at a 90-degree angle, as this places exceptionally high friction and sheer force on your shoulder joints."
    ]
  },
  "dumbell bench press": {
    tips: [
      "Squeeze your shoulder blades together of the bench to build a sturdy foundational platform.",
      "Bring the weights slightly inward at the top to complete a strong chest squeeze, but stop just short of clashing them together to maintain tension.",
      "Keep your wrists stacked straight directly over your elbows throughout the movement for maximal force transmission."
    ],
    avoid: [
      "Don't let the dumbbells drift too far back toward your neck or too far forward toward your stomach, which places your shoulders in a weak position.",
      "Avoid clanging or slamming the weights together at the top, which removes tension from the target muscles and can be dangerous."
    ]
  },
  "lat pulldowns": {
    tips: [
      "Drive your elbows straight down into your back pockets. Think of your hands as hooks, and pull entirely using your back musculature.",
      "Lean back slightly (10-15 degrees) keeping your core braced and chest reared high to create an optimal vertical pulling channel.",
      "Control the eccentric phase: resist the weight on the way up for an active 3-second stretch of your latissimus dorsi."
    ],
    avoid: [
      "Do not pull the bar behind your neck. This is an anatomically compromised position that stresses shoulder socket capsules.",
      "Don't use body momentum to heave the bar down. Keep your thighs secured beneath the pads and avoid rocking your torso."
    ]
  },
  "pull ups": {
    tips: [
      "Drive your elbows down to lift your collarbone to the bar, keeping your shoulders depressed and chest proudly lifted towards the ceiling.",
      "Hold a hollow body position: squeeze your abs and glutes, pointing your toes slightly forward to engage your anterior core.",
      "Allow a full hang at the bottom without relaxing your shoulder blades; maintain active shoulder engagement before starting the next rep."
    ],
    avoid: [
      "Don't rely on leg kicking or swinging (kipping) unless doing specific gymnastic movements, as this minimizes the workload of your back muscles.",
      "Avoid shrugging your shoulders into your ears at the bottom or throughout the pull, as this overworks the upper traps and strain necks."
    ]
  },
  "military press": {
    tips: [
      "Brace your glutes and abs maximally. A solid overhead press depends entirely on a rock-solid, sway-free pillar underneath it.",
      "Position your elbows slightly forward under the bar (the scapular plane) to optimize biomechanics and protect your rotators.",
      "Push your head through the 'window' created by your arms at lockout, bringing your ears inline with your biceps."
    ],
    avoid: [
      "Avoid excessive arching of your lower back (leaning backward heavily). If you must lean to look up, the weight is too heavy.",
      "Do not bounce the barbell off your colorbones. Complete a full stop at chin level before driving it overhead."
    ]
  },
  "dumbbell lateral raise": {
    tips: [
      "Think about sweeping the dumbbells out toward the walls rather than picking them up, which isolates your middle deltoid heads.",
      "Lean forward slightly (about 10 degrees) at your waist to align the lateral deltoid with the line of pull.",
      "Lead the movement with your elbows, ensuring they are slightly higher than your hands throughout the raise."
    ],
    avoid: [
      "Do not shrug your shoulders up to your ears at the top, which shifts the entire load on to your dominant upper traps.",
      "Avoid swinging your torso or using hip thrusts to throw the dumbbells up. Lower the weight to focus on fine shoulder isolation."
    ]
  },
  "barbell bent over row": {
    tips: [
      "Set a solid hip hinge. Bent your knees slightly, push your glutes back, and keep your torso almost completely parallel to the floor.",
      "Pull the bar towards your belly button or lower ribs, driving your elbows up and back as if trying to pinch a coin between your shoulder blades.",
      "Maintain a flat to slightly arched lower spine, bracing your core with absolute tightness."
    ],
    avoid: [
      "Do not stand too upright. If your torso is at a 45-degree angle or higher, you are working your upper traps instead of your mid-back.",
      "Don't yank the bar with your hands first; lead the motion from your elbows to prevent forearm and bicep dominance."
    ]
  }
};

const CATEGORIES: Record<string, ProTips> = {
  "chest_press": {
    tips: [
      "Keep your shoulders pinned back and flat against the bench to protect your anterior rotator cuffs and maximize chest tension.",
      "Control the eccentric phase: spend 2-3 seconds lowering the weight, and stretch your outer chest fibers fully before pressing.",
      "Exhale as you press the weight up, maintaining a stable wrist line directly stacked over your forearms."
    ],
    avoid: [
      "Avoid flaring your elbows wide at a 90-degree angle; angle them around 45-60 degrees relative to your torso for safety.",
      "Don't bounce the bar or dumbbells. Leverage a controlled turn-around with muscular power."
    ]
  },
  "chest_fly": {
    tips: [
      "Maintain a fixed, slight bend (15 degrees) in your elbows. Your arms should act as single solid levers, pulsing at the shoulder.",
      "Imagine hugging a massive tree or barrel. Squeezing your biceps inward towards your midline is what contracts your breast muscles.",
      "Hold the stretch at the bottom of the movement for a brief second to recruit extra chest muscle fibers."
    ],
    avoid: [
      "Do not bend and straighten your elbows. If your elbows are flexing, you are pressing the weight instead of flying them.",
      "Don't overextend your arms past your torso level, which loads your delicate front shoulder tendons excessively."
    ]
  },
  "rows": {
    tips: [
      "Engage your back by driving your elbows backward. Imagine pulling with your elbows rather than your hand grip.",
      "Squeeze your shoulder blades together at the top of the contraction for a full 1-second pause to enhance muscle thickness.",
      "Keep your head in a neutral line looking slightly forward-down; avoid pulling your neck back or staring straight up."
    ],
    avoid: [
      "Avoid rounded shoulders and back curvature which drastically overshunts shear forces to your lumbar spine discs.",
      "Don't use aggressive torso swinging or leg bounce as momentum. Let your lat and rhomboid fibers do the work."
    ]
  },
  "pulldowns": {
    tips: [
      "Pull the bar down towards your collarbone or upper chest while drawing your shoulder blades downwards.",
      "Think about pulling your elbows straight down into your back pockets, which fully isolates the latissimus dorsi.",
      "Sustain control as the weight elevates, allowing a complete reach/scapular elevation at the peak for a deep stretch."
    ],
    avoid: [
      "Avoid jerking or dropping your chest collapsed inward at the bottom. Keep your chest tall and open.",
      "Do not pull the bar down with your hands close to your face; keep the bar clean of your forehead."
    ]
  },
  "squats_and_presses": {
    tips: [
      "Spread the floor with your feet to engage your outer glutes and ensure your kneecaps track parallel to your toes.",
      "Push through the midfoot and heel of your feet—never lift your heels off the plate or floor.",
      "Keep your core as tight as possible. Imagine getting braced to take a heavy punch in the stomach."
    ],
    avoid: [
      "Avoid letting your knees slide forward past your toes excessively if your heels are lifting; sit your hips down and back.",
      "Never lock your knees out completely straight at the top of the lift, especially on Leg Presses, to prevent catastrophic joint hyperextension."
    ]
  },
  "bicep_curls": {
    tips: [
      "Pin your elbows securely to the sides of your body; restrict any forward or backward elbow travel which activates your front delts.",
      "Slow down the lowering (eccentric) action: lower the weight over 2-3 seconds for maximal micro-damage to bicep fibers.",
      "Fully extend your elbows at the bottom of each repetition to reset and lengthen the muscle completely."
    ],
    avoid: [
      "Avoid swinging your lower back or shifting your weight back to heave the bar up. Use strict isolation.",
      "Don't squeeze the barbell or dumbbell grip with excessive forearm force, which can fatigue your wrists before your biceps."
    ]
  },
  "tricep_extensions": {
    tips: [
      "Frame your elbows static in space. They should serve strictly as hinges. Keep them locked beside your temples or ribs.",
      "Squeeze your triceps forcefully at full straight-arm extension, holding the contraction for a solid half-second.",
      "On cable rope extensions, flare the ropes outward at the bottom of the pull to target all heads of the muscle."
    ],
    avoid: [
      "Avoid letting your elbows flare outward to the sides, which engages the chest/shoulders and strains your elbow tendons.",
      "Do not lean your whole chest over the attachment to push the weight down with your body weight."
    ]
  },
  "shoulder_raises": {
    tips: [
      "Focus on driving your arms outward horizontally to the sides, rather than upward vertically.",
      "Keep a very slight forward lean in your torso for cleaner side-delt line-of-pull alignment.",
      "Maintain a soft elbow bend (about 10-20 degrees) to lessen pressure on the actual joint connection."
    ],
    avoid: [
      "Avoid shrugging your neck. If your neck is contracting heavily, reduce the weight to focus on deltoid isolation.",
      "Don't lift your hands higher than your elbows; keep elbows leading the sweep."
    ]
  },
  "deadlifts_posterior": {
    tips: [
      "Pack your lats aggressively: imagine squeezing lemons in your armpits before starting the pull to secure your upper spine.",
      "Leg-press the floor: slide your heels into the ground to initiate the break from the floor, using leg power first.",
      "Keep the bar trace close to your legs: dragging the bar up your shins ensures mechanics remain tightly centered over your feet."
    ],
    avoid: [
      "Do not lift with a rounded spine. Keep your back flat to prevent critical disc herniation risks.",
      "Avoid hyperextending your lower back at lockout. Simply stand upright and squeeze your glutes instead of leaning back."
    ]
  },
  "core_abs": {
    tips: [
      "Emphasize rib-to-pelvis compression: actively contract your abdominal wall to pull your chest down toward your hips.",
      "Exhale and scoop your stomach out: blow all the air out of your lungs at peak contraction to recruit deep transverse muscles.",
      "Execute repetitions slowly and mindfully, avoiding gravity or momentum on the eccentric release."
    ],
    avoid: [
      "Don't pull on your neck or head with your fingers. Your hands should only gently touch your temples.",
      "Do not arch your lower back away from the floor during leg raises; flatten your lumbar spine against the mat."
    ]
  },
  "cardio_hiit": {
    tips: [
      "Stand tall: avoid leaning or looking down, as a neutral high neck opens up your respiratory airway.",
      "Land softly on the middle of your foot (midfoot-strike) to spread impact forces through your knees and ankles naturally.",
      "Pace your breathing rate: coordinate rhythmic inhales and exhales to delay oxygen debt."
    ],
    avoid: [
      "Do not hold on to the treadmill handle bars when walking at an incline; this ruins natural posture and reduces caloric burn.",
      "Don't round your shoulders or slouch when using rowing machines or cycle bikes."
    ]
  }
};

export function getProTipsForExercise(
  name: any,
  pool?: string,
  muscleGroup?: string
): ProTips {
  const normName = typeof name === 'string' ? name.toLowerCase().trim() : '';

  // 1. Direct Specific Match
  if (normName && SPECIFIC_TIPS[normName]) {
    return SPECIFIC_TIPS[normName];
  }

  // 2. Keyword matching in the name
  if (normName.includes("squat") || normName.includes("leg press") || normName.includes("lunges")) {
    return CATEGORIES.squats_and_presses;
  }
  if (normName.includes("bench press") || normName.includes("chest press") || normName.includes("incline press") || normName.includes("decline press") || normName.includes("push up") || normName.includes("push-up") || normName.includes("military press") || normName.includes("shoulder press")) {
    return CATEGORIES.chest_press;
  }
  if (normName.includes("fly") || normName.includes("flye") || normName.includes("cable crossover")) {
    return CATEGORIES.chest_fly;
  }
  if (normName.includes("row") || normName.includes("pullup") || normName.includes("pull up") || normName.includes("chin up") || normName.includes("chin-up")) {
    return CATEGORIES.rows;
  }
  if (normName.includes("pulldown")) {
    return CATEGORIES.pulldowns;
  }
  if (normName.includes("bicep") || normName.includes("curl")) {
    // Calf raises also use "raise", so check if curl is present or bicep
    if (normName.includes("curl") || normName.includes("bicep")) {
      return CATEGORIES.bicep_curls;
    }
  }
  if (normName.includes("tricep") || normName.includes("pushdown") || normName.includes("extension") || normName.includes("dip")) {
    return CATEGORIES.tricep_extensions;
  }
  if (normName.includes("raise") && (normName.includes("lateral") || normName.includes("shoulder") || normName.includes("delt"))) {
    return CATEGORIES.shoulder_raises;
  }
  if (normName.includes("deadlift") || normName.includes("reverse hyper") || normName.includes("good morning")) {
    return CATEGORIES.deadlifts_posterior;
  }
  if (normName.includes("crunch") || normName.includes("plank") || normName.includes("leg raise") || normName.includes("sit up") || normName.includes("sit-up") || normName.includes("abs") || normName.includes("core")) {
    return CATEGORIES.core_abs;
  }
  if (normName.includes("treadmill") || normName.includes("run") || normName.includes("sprint") || normName.includes("cardio") || normName.includes("cycle") || normName.includes("rowing") || normName.includes("bike") || normName.includes("elliptical") || normName.includes("stair")) {
    return CATEGORIES.cardio_hiit;
  }

  // 3. Fallback based on pool
  const activePool = (pool || "").toLowerCase();
  if (activePool.includes("chest")) {
    return normName.includes("fly") ? CATEGORIES.chest_fly : CATEGORIES.chest_press;
  }
  if (activePool.includes("back") || activePool.includes("lats") || activePool.includes("rhomboids")) {
    return activePool.includes("lat") || normName.includes("pulldown") ? CATEGORIES.pulldowns : CATEGORIES.rows;
  }
  if (activePool.includes("legs") || activePool.includes("quads") || activePool.includes("hamstring") || activePool.includes("glute")) {
    return normName.includes("dead") || normName.includes("morning") ? CATEGORIES.deadlifts_posterior : CATEGORIES.squats_and_presses;
  }
  if (activePool.includes("biceps") || activePool.includes("brachialis")) {
    return CATEGORIES.bicep_curls;
  }
  if (activePool.includes("triceps")) {
    return CATEGORIES.tricep_extensions;
  }
  if (activePool.includes("delts") || activePool.includes("shoulder")) {
    return normName.includes("press") ? CATEGORIES.chest_press : CATEGORIES.shoulder_raises;
  }
  if (activePool.includes("core") || activePool.includes("obliques")) {
    return CATEGORIES.core_abs;
  }
  if (activePool.includes("cardio")) {
    return CATEGORIES.cardio_hiit;
  }

  // 4. Default broad athletic tips
  return {
    tips: [
      "Concentrate on establishing a deep mind-muscle connection. Actively visualize and feel the target muscle flexing on every contraction.",
      "Control the pacing of the lift: spend 2-3 seconds lowers the weight and pull or push with explosive, but controlled speed.",
      "Keep your shoulders neutral and pull your abdominal wall in to secure your body's posture."
    ],
    avoid: [
      "Never swing, sway, or use full-body momentum to jerk the weights up, which robs the target fibers of stimulus and risks joint strain.",
      "Don't rush through the set. Maintain a uniform and steady mechanical speed from reps 1 to 10."
    ]
  };
}

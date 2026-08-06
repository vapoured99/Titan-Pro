export interface Exercise {
  name: string;
  icon: string;
  pool: 'chest' | 'back' | 'shoulders' | 'legs' | 'biceps' | 'triceps' | 'core' | 'cardio' | 'equipment' | 'forearms' | 'upper_back' | 'lower_back' | 'front_delts' | 'side_delts' | 'rear_delts' | 'upper_core' | 'lower_core' | 'obliques' | 'upper_chest' | 'middle_chest' | 'lower_chest' | 'long_biceps' | 'short_biceps' | 'brachialis' | 'long_triceps' | 'lateral_triceps' | 'medial_triceps' | 'lats' | 'rhomboids_traps' | 'erector_spinae' | 'quads' | 'hamstrings' | 'calves';
  instructions?: string[];
  muscleGroup?: 'chest' | 'back' | 'shoulders' | 'quads' | 'hamstrings' | 'calves' | 'glutes' | 'biceps' | 'triceps' | 'core' | 'cardio' | 'equipment' | 'forearms' | 'upper_back' | 'lower_back' | 'front_delts' | 'side_delts' | 'rear_delts' | 'upper_core' | 'lower_core' | 'obliques' | 'upper_chest' | 'middle_chest' | 'lower_chest' | 'long_biceps' | 'short_biceps' | 'brachialis' | 'long_triceps' | 'lateral_triceps' | 'medial_triceps' | 'lats' | 'rhomboids_traps' | 'erector_spinae';
  legRegion?: 'upper' | 'lower';
  category?: 'compound' | 'isolation';
  equipmentCategory?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  secondaryMuscles?: string[];
  integrated?: boolean;
}

const RAW_POOLS: Record<string, Omit<Exercise, 'category'>[]> = {
  upper_chest: [
    { 
      name: "Barbell Incline Bench Press", 
      icon: "ArrowUp", 
      pool: "upper_chest",
      instructions: [
        "Set the bench to a 30-45 degree incline.",
        "Lie on the bench and grip the barbell with hands slightly wider than shoulder-width.",
        "Lower the bar to your upper chest in a controlled motion.",
        "Press the bar back up until your arms are fully extended.",
        "Ensure your feet remain flat on the floor throughout the lift."
      ]
    },
    { 
      name: "Decline Push Ups", 
      icon: "ArrowDown", 
      pool: "upper_chest",
      instructions: [
        "Place your feet on a bench or elevated surface and hands on the floor.",
        "Position your hands slightly wider than shoulder-width apart.",
        "Lower your chest toward the floor while keeping your body in a straight line.",
        "Push back up to the starting position.",
        "This variant focuses more on the upper chest and shoulders."
      ]
    },
    { 
      name: "Incline Dumbbell Chest Fly", 
      icon: "ArrowUp", 
      pool: "upper_chest",
      instructions: [
        "Lie on an incline bench set at 30-45 degrees.",
        "Hold dumbbells above your chest with a slight bend in the elbows.",
        "Lower the weights in a wide arc until you feel a stretch in your upper chest.",
        "Squeeze your chest and bring the weights back together.",
        "Keep your core engaged to stabilize your torso."
      ]
    },
    { 
      name: "Incline Dumbbell Chest Press", 
      icon: "ArrowUp", 
      pool: "upper_chest",
      instructions: [
        "Sit on an incline bench and hold dumbbells at shoulder height.",
        "Press the weights up until your arms are fully extended over your upper chest.",
        "Lower the dumbbells slowly back to the starting position.",
        "Keep your elbows at a 45-degree angle to your body.",
        "Maintain a steady and controlled tempo."
      ]
    },
    { 
      name: "Machine Incline Press", 
      icon: "ArrowUp", 
      pool: "upper_chest",
      instructions: [
        "Sit in the incline press machine and adjust the seat height.",
        "Grip the handles and push them upward along the machine's path.",
        "Extend your arms fully without locking your elbows.",
        "Lower the handles back to the starting position slowly.",
        "Targets the upper chest with added stability."
      ]
    },
    { 
      name: "Low to High Cable Flys", 
      icon: "ArrowUp", 
      pool: "upper_chest",
      instructions: [
        "Position the cable pulleys at the lowest setting.",
        "Stand in the middle and pull the handles up and inward toward your chest.",
        "Bring your hands together at roughly shoulder height.",
        "Slowly lower the handles back to the starting position.",
        "Targets the upper portion of the chest."
      ]
    }
  ],
  middle_chest: [
    { 
      name: "Archer Push Ups", 
      icon: "Activity", 
      pool: "middle_chest",
      instructions: [
        "Enters a push-up position with hands wider than shoulder-width apart.",
        "As you lower your body, shift your weight towards one arm while keeping the other arm straight.",
        "Push back up to the starting position and repeat on the other side.",
        "Keep your core tight and body in a straight line throughout the movement."
      ]
    },
    { 
      name: "Barbell Bench Press", 
      icon: "Dumbbell", 
      pool: "middle_chest",
      instructions: [
        "Lie flat on a bench with your feet firmly planted on the floor.",
        "Grip the barbell with hands slightly wider than shoulder-width apart.",
        "Lower the bar slowly to your mid-chest while keeping your elbows at a 45-degree angle.",
        "Press the bar back up until your arms are fully extended.",
        "Avoid arching your back excessively and maintain control throughout."
      ]
    },
    { 
      name: "Cable Flyes", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Set the pulleys to chest height and attach D-handles.",
        "Stand in the center, grasp handles, and step forward into a staggered stance.",
        "Bring the handles together in front of you in a wide arc, squeezing your chest.",
        "Slowly return your arms to the sides in a controlled arc.",
        "Maintain a slight bend in your elbows throughout the movement."
      ]
    },
    { 
      name: "Dumbbell Bench Press", 
      icon: "Dumbbell", 
      pool: "middle_chest",
      instructions: [
        "Sit on the edge of a flat bench with a dumbbell in each hand, resting on your knees.",
        "Lie back while bringing the dumbbells to your chest, then press them up to the starting position.",
        "Slowly lower the weights to the sides of your chest, keeping your elbows at roughly a 45-degree angle.",
        "Press the dumbbells back up to the top, avoiding letting them touch at the top to maintain tension.",
        "Keep your feet flat on the floor and your back pressed against the bench."
      ]
    },
    { 
      name: "Dumbbell Chest Fly", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Lie on a flat bench with a dumbbell in each hand, arms extended above your chest.",
        "Keep a slight bend in your elbows and lower your arms out to the sides in a wide arc.",
        "Stop when you feel a stretch in your chest, but before your elbows go below the bench line.",
        "Use your chest muscles to pull the dumbbells back to the starting position.",
        "Maintain the same elbow angle throughout the entire movement."
      ]
    },
    { 
      name: "Machine Fly", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Sit in the machine and press your back firmly against the pad.",
        "Grip the handles or place your forearms on the pads.",
        "Bring the handles or pads together in front of you using your chest.",
        "Slowly return to the starting position without letting the weights touch.",
        "Focus on the contraction at the peak of the movement."
      ]
    },
    { 
      name: "Machine Chest Press", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Adjust the seat so the handles are at mid-chest height.",
        "Sit back and grip the handles firmly.",
        "Push the handles forward until your arms are extended.",
        "Slowly return to the starting position under control.",
        "Keep your shoulders back and chest out throughout."
      ]
    },
    { 
      name: "Push Ups", 
      icon: "Activity", 
      pool: "middle_chest",
      instructions: [
        "Start in a high plank position with your hands slightly wider than shoulder-width.",
        "Maintain a straight line from your head to your heels, engaging your core.",
        "Lower your body until your chest nearly touches the floor, keeping elbows at 45 degrees.",
        "Push through your palms to return to the starting position.",
        "Avoid letting your hips sag or your butt stick up in the air."
      ]
    },
    { 
      name: "Seated Cable Fly", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Sit on a bench between two cable pulleys set at chest height.",
        "Grasp the handles and lean forward slightly.",
        "Bring the handles together in front of you in a wide arc.",
        "Squeeze your chest at the top of the movement.",
        "Return the handles slowly to the sides."
      ]
    },
    { 
      name: "Seated Chest Press", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Sit in a seated chest press machine and adjust the seat.",
        "Push the handles forward until your arms are fully extended.",
        "Lower the handles back toward your chest with control.",
        "Avoid arching your back off the seat.",
        "Maintain a consistent breathing pattern."
      ]
    },
    { 
      name: "Single Arm Chest Press", 
      icon: "Dumbbell", 
      pool: "middle_chest",
      instructions: [
        "Lie on a bench and hold one dumbbell in one hand.",
        "Press the dumbbell up while keeping your other hand on your hip or chest for balance.",
        "Lower the weight slowly to the side of your chest.",
        "Focus on stabilizing your core to prevent rotating.",
        "Finish all reps on one side before switching."
      ]
    },
    { 
      name: "Single Arm Chest Fly", 
      icon: "ArrowLeftRight", 
      pool: "middle_chest",
      instructions: [
        "Lie on a bench or stand at a cable machine.",
        "Perform a fly motion with a single arm, moving in a wide arc.",
        "Focus on the isolation of the chest muscle.",
        "Stabilize your body to prevent swinging or rotating.",
        "Slowly return to the starting position."
      ]
    }
  ],
  lower_chest: [
    { 
      name: "Assisted Chest Dips", 
      icon: "ArrowDown", 
      pool: "lower_chest",
      instructions: [
        "Grip the parallel bars and lift yourself up with locked elbows.",
        "Lean your torso forward slightly and bend your knees.",
        "Lower your body by bending your elbows until they reach a 90-degree angle.",
        "Push yourself back up to the starting position.",
        "Avoid flaring your elbows out excessively to protect your shoulders."
      ]
    },
    { 
      name: "Decline Dumbbell Bench Press", 
      icon: "ArrowDown", 
      pool: "lower_chest",
      instructions: [
        "Secure your feet at the top of a decline bench and lie back.",
        "Hold dumbbells above your lower chest with arms extended.",
        "Lower the weights slowly toward the sides of your chest.",
        "Press the dumbbells back up to the starting position.",
        "Focus on the contraction in your lower chest."
      ]
    },
    { 
      name: "Decline Dumbbell Fly", 
      icon: "ArrowLeftRight", 
      pool: "lower_chest",
      instructions: [
        "Lie on a decline bench with your feet secured.",
        "Hold dumbbells above your chest with a slight bend in your elbows.",
        "Lower the weights in a wide arc until you feel a stretch in your chest.",
        "Bring the weights back together over your lower chest.",
        "Maintain a consistent elbow angle throughout."
      ]
    },
    { 
      name: "Incline Push Ups", 
      icon: "ArrowUp", 
      pool: "lower_chest",
      instructions: [
        "Place your hands on a bench or elevated surface and feet on the floor.",
        "Position your hands slightly wider than shoulder-width.",
        "Lower your chest toward the bench while keeping your body straight.",
        "Push back up to the starting position.",
        "This variant is easier than standard push-ups and targets the lower chest."
      ]
    },
    { 
      name: "Weighted Chest Dips", 
      icon: "Plus", 
      pool: "lower_chest",
      instructions: [
        "Attach a weight plate to a dip belt or hold a dumbbell between your feet.",
        "Lower your body until your elbows are at 90 degrees.",
        "Drive yourself back up to the starting position.",
        "Maintain a slight forward lean to target the chest.",
        "Only add weight once you can perform several bodyweight reps with perfect form."
      ]
    },
    { 
      name: "High to Low Cable Flys", 
      icon: "ArrowDown", 
      pool: "lower_chest",
      instructions: [
        "Position the cable pulleys at the highest setting.",
        "Stand in the middle and pull the handles down and inward toward your waist.",
        "Cross your hands slightly at the bottom for extra contraction.",
        "Slowly bring the handles back up to the starting position.",
        "Targets the lower portion of the chest."
      ]
    }
  ],
  upper_back: [
    { 
      name: "Barbell Bent Over Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Stand with feet shoulder-width apart and grip the barbell with an overhand grip.",
        "Hinge at your hips and lean forward until your torso is nearly parallel to the floor.",
        "Keep your back straight and pull the bar toward your lower ribs by driving your elbows back.",
        "Squeeze your shoulder blades together at the top of the movement.",
        "Slowly lower the bar back to the starting position with control."
      ]
    },
    { 
      name: "Close Grip Lat Pulldown", 
      icon: "ArrowDown", 
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Attach a V-bar or close-grip handle to the lat pulldown machine.",
        "Sit and secure your thighs under the knee pads.",
        "Pull the handle down toward your upper chest, leaning back slightly.",
        "Squeeze your lats and middle back at the bottom.",
        "Slowly return the handle to the starting position."
      ]
    },
    { 
      name: "Dumbbell Bent Over Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Hold a dumbbell in each hand and hinge at the hips until your torso is nearly parallel to the floor.",
        "Let the weights hang with arms extended and palms facing each other.",
        "Pull the dumbbells toward your lower ribs, driving your elbows back.",
        "Squeeze your shoulder blades at the top.",
        "Lower the weights slowly to the starting position."
      ]
    },
    { 
      name: "Incline Row (Chest Supported)", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Lie face down on an incline bench set at 30-45 degrees.",
        "Hold dumbbells with arms hanging straight down.",
        "Pull the weights toward your ribs, keeping your chest pressed against the bench.",
        "Squeeze your back muscles at the top.",
        "Lower the weights slowly with control."
      ]
    },
    { 
      name: "Inverted Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Set a bar in a rack or use a TRX at waist height.",
        "Lie under the bar and grip it with hands wider than shoulders.",
        "Keep your body straight and pull your chest toward the bar.",
        "Squeeze your shoulder blades together at the peak.",
        "Lower yourself back to the starting position with control."
      ]
    },
    { 
      name: "Lat Pulldowns", 
      icon: "ArrowDown", 
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Sit at the machine and adjust the knee pad so your thighs are secured.",
        "Grip the bar with a wide, overhand grip, hands wider than shoulder-width.",
        "Pull the bar down towards your upper chest by retracting your shoulder blades and leading with your elbows.",
        "Squeeze your lats at the bottom of the movement.",
        "Slowly return the bar to the starting position, maintaining control."
      ]
    },
    { 
      name: "Pendlay Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Stand over a barbell with feet shoulder-width apart.",
        "Hinge forward until your torso is parallel to the floor.",
        "Grip the bar and pull it explosively toward your lower chest.",
        "Return the bar to the floor after each rep.",
        "Maintain a flat back and avoid using momentum from your legs."
      ]
    },
    { 
      name: "Seated Cable Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Sit at the rowing machine with your feet on the platforms and a slight bend in your knees.",
        "Grip the handle and sit upright with a neutral spine and shoulders back.",
        "Pull the handle toward your abdomen by driving your elbows back and squeezing your shoulder blades.",
        "Avoid leaning back excessively; keep your core engaged and torso stable.",
        "Slowly extend your arms back to the starting position without letting your shoulders round forward."
      ]
    },
    { 
      name: "Low to High Cable Row", 
      icon: "ArrowUp", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Set the cable pulley at the lowest position and attach a D-handle or rope.",
        "Stand facing the machine, step back to create tension on the cable, and assume a stable split stance.",
        "Engage your core and pull the handle up and back toward your lower ribs or chest, leading with your elbow.",
        "Squeeze your lats and middle back at the peak of the movement.",
        "Slowly extend your arm back down to the starting position under control."
      ]
    },
    { 
      name: "Single Arm Bent Over Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Place one knee and hand on a flat bench for support.",
        "Hold a dumbbell in the other hand with the arm extended.",
        "Pull the dumbbell toward your hip, keeping your elbow close to your side.",
        "Squeeze your lat at the top and lower the weight slowly.",
        "Keep your back flat and core engaged throughout."
      ]
    },
    { 
      name: "Single Arm Lat Pulldowns", 
      icon: "ArrowDown", 
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Attach a single handle to the lat pulldown machine.",
        "Sit and grip the handle with one hand.",
        "Pull the handle down toward your shoulder, focusing on the lat contraction.",
        "Slowly return to the start and repeat on the other side.",
        "This version helps correct muscle imbalances."
      ]
    },
    { 
      name: "Straight Arm Lat Pulldowns", 
      icon: "ArrowDown", 
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Stand facing the cable machine and grip a bar with arms fully extended.",
        "With a slight bend in your elbows, pull the bar down to your thighs using your lats.",
        "Avoid using your triceps; keep the movement in your back.",
        "Squeeze your lats at the bottom.",
        "Slowly return the bar to the starting level."
      ]
    },
    { 
      name: "T Bar Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Stand over the T-bar or landmine setup with a wide or narrow handle.",
        "Hinge forward and pull the handles toward your abdomen.",
        "Squeeze your shoulder blades together at the top.",
        "Lower the weight slowly to the starting position.",
        "Keep your knees slightly bent and back flat."
      ]
    },
    { 
      name: "Wide Grip Lat Pulldowns", 
      icon: "ArrowDown", 
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Grip the long bar with hands well beyond shoulder-width.",
        "Pull the bar down toward your upper chest.",
        "Focus on driving your elbows down and back.",
        "Slowly return the bar to the top.",
        "Targets the outer lats for a wider back appearance."
      ]
    },
    { 
      name: "Machine Row", 
      icon: "ArrowLeftRight", 
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Sit in the machine and adjust the chest pad.",
        "Grip the handles and pull them toward your waist.",
        "Squeeze your back muscles at the peak contraction.",
        "Slowly return to the starting position.",
        "Maintain an upright posture throughout the exercise."
      ]
    },
    {
      name: "Pull Ups",
      icon: "ArrowUp",
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Grasp the pull-up bar with an overhand grip, hands slightly wider than shoulder-width apart.",
        "Hang with your arms fully extended and your feet off the floor, crossing your ankles if needed.",
        "Pull your body up by driving your elbows down toward your sides, bringing your chest toward the bar.",
        "Pause at the top with your chin over the bar, then slowly lower yourself back to the starting position.",
        "Avoid swinging or using momentum to pull yourself up."
      ]
    },
    {
      name: "Assisted Pull Ups",
      icon: "ArrowUpCircle",
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Select an appropriate counterweight on the machine and step onto the platform or place your knees/feet on the padded bar.",
        "Grasp the overhead handles with an overhand grip, hands slightly wider than shoulder-width apart.",
        "Slowly lower your body until your arms are fully extended, allowing the machine to support your weight.",
        "Pull yourself up by driving your elbows down, keeping your chest tall and core engaged.",
        "Slowly lower yourself back down to the starting position under control."
      ]
    },
    {
      name: "Plate Loaded Row",
      icon: "ArrowLeftRight",
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Sit facing the machine with your chest firmly against the support pad.",
        "Adjust the seat height so that the handles align with your lower chest or upper abdomen.",
        "Grip the handles with an overhand or neutral grip and extend your arms fully.",
        "Pull the handles toward you by driving your elbows back and squeezing your shoulder blades together.",
        "Slowly return to the starting position under control, fully extending your arms to stretch the lats."
      ]
    },
    {
      name: "Single Arm Cable Row",
      icon: "ArrowLeftRight",
      pool: "upper_back",
      muscleGroup: "lats",
      instructions: [
        "Attach a single handle to a low cable pulley and select the appropriate weight.",
        "Step back from the pulley, hinge at the hips slightly, and keep your knees unlocked for stability.",
        "Hold the handle with your arm fully extended, palm facing inward (neutral grip).",
        "Pull the handle toward your hip/waist by driving your elbow back, keeping it close to your side.",
        "Squeeze your lat at the peak of the contraction, then slowly return to the starting position."
      ]
    },
    {
      name: "Diverging Seated Row",
      icon: "ArrowLeftRight",
      pool: "upper_back",
      muscleGroup: "rhomboids_traps",
      instructions: [
        "Seat & Chest Support Setup: Sit at the diverging row machine and adjust the seat height so that the handles align with your mid-to-upper chest. Secure your chest firmly against the front support pad and plant your feet flat on the floor to stabilize your lower body.",
        "Grip & Initial Setup: Reach forward and grasp the handles with a comfortable neutral or overhand grip. Maintain a tall torso, proud chest, and neutral spine with arms extended, feeling a mild stretch in your lats and upper back.",
        "Diverging Pull Execution: Inhale, brace your core, and drive your elbows back and outwards along the natural diverging arc of the machine, pulling the handles toward your sides while retracting your shoulder blades.",
        "Peak Contraction: Pause for 1-2 seconds at full contraction, squeezing your upper back, rhomboids, and rear deltoids forcefully while keeping your chest pinned against the support pad.",
        "Controlled Eccentric Extension: Exhale and slowly extend your arms back to the starting position over 2-3 seconds, controlling the resistance throughout the full range of motion without letting the weight stack crash."
      ]
    }
  ],
  lower_back: [
    {
      name: "Hex Bar Deadlift",
      icon: "ArrowUp",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Step inside the hex bar (trap bar) with feet hip-to-shoulder width apart.",
        "Bend at your hips and knees to grab the handles in the exact center.",
        "Flatten your back, lift your chest high, and drop your hips slightly lower than in a conventional deadlift setup.",
        "Engage your core and lats, drive your feet into the floor to lift the bar, and stand tall.",
        "Lock out your hips and squeeze your glutes at the top, then lower the bar under control."
      ]
    },
    {
      name: "Barbell Deadlifts",
      icon: "ArrowUp",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Stand with your feet hip-width apart and the barbell over the mid-foot.",
        "Hinge at your hips and bend your knees to grip the bar with a flat back.",
        "Drive through your feet to push the floor away, pulling the bar up along your shins.",
        "Keep your chest high and back straight as you stand up completely, locking out your hips.",
        "Hinge at the hips first, then bend knees to lower the bar back to the floor under control."
      ]
    },
    { 
      name: "Rack Pulls", 
      icon: "ArrowUp", 
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Set a barbell on the safety pins of a power rack at or just below knee height.",
        "Grip the bar with hands shoulder-width apart and a flat back.",
        "Pull the bar up by extending your hips and knees to a standing position.",
        "Squeeze your back and glutes at the top.",
        "Slowly lower the bar back to the pins."
      ]
    },
    {
      name: "Good Mornings",
      icon: "ArrowDown",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Rest a barbell on your upper back / traps with a tight shoulder blades retraction.",
        "Stand with feet shoulder-width apart, knees slightly unlocked.",
        "Hinge at your hips, sending your buttocks backward as you lower your straight-back torso toward the floor.",
        "Stop when your torso is nearly parallel to the floor, then return to upright position by driving through the hips."
      ]
    },
    {
      name: "Back Hyperextensions",
      icon: "ArrowUp",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Position yourself on a back extension bench with your hips resting on the pad and ankles secured.",
        "With a flat back, bend forward at the waist as far as you can comfortably stretch.",
        "Contract your erector spinae (lower back muscles) to raise your upper body until it is in line with your legs.",
        "Avoid hyperextending or arching your back excessively at the top."
      ]
    },
    {
      name: "Reverse Hyperextensions",
      icon: "ArrowUp",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Lie face down on a reverse hyperextension machine table with your hips at the edge of the pad.",
        "Secure your feet in the strap or roller attachment, keeping your legs straight and hanging down.",
        "Grip the handles firmly to stabilize your upper body and protect your shoulders.",
        "Engage your lower back, glutes, and hamstrings to lift your legs backward until they are in line with your torso.",
        "Control the weight as your legs swing back down, allowing a slight, safe decompression stretch at the bottom."
      ]
    },
    {
      name: "Jefferson Curls",
      icon: "ArrowDown",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Stand tall on an elevated box or flat bench holding a light barbell or kettlebell with both hands hanging straight down.",
        "Begin the movement by tucking your chin to your chest, then slowly curl your spine downward nose-to-toes, one vertebra at a time.",
        "Keep your legs completely locked straight as you descend to maximize posterior chain stretch.",
        "Go as deep as your flexibility allows, letting the weight gently pull you deeper into spinal flexion.",
        "Slowly reverse the movement under complete control, uncurling your spine from bottom to top until standing upright."
      ]
    },
    {
      name: "Supermans",
      icon: "Zap",
      pool: "lower_back",
      muscleGroup: "erector_spinae",
      instructions: [
        "Lie flat on your stomach on an exercise mat with your legs straight and arms fully extended overhead.",
        "Keep your neck neutral by looking down at the mat throughout the movement.",
        "Simultaneously lift your arms, chest, and legs several inches off the floor by contracting your lower back and glutes.",
        "Hold this contracted flying pose position for 2 to 3 seconds.",
        "Slowly lower your arms, chest, and legs back to the starting resting position."
      ]
    }
  ],
  front_delts: [
    { 
      name: "Arnold Press", 
      icon: "ArrowUpCircle", 
      pool: "front_delts",
      instructions: [
        "Sit on a bench with back support, holding dumbbells in front of your shoulders, palms facing you.",
        "As you press the weights overhead, rotate your palms to face forward.",
        "Extend your arms fully, then reverse the rotation as you lower the weights.",
        "This variant engages all three heads of the deltoids.",
        "Keep the movement smooth and controlled."
      ]
    },
    { 
      name: "Barbell Front Raise", 
      icon: "ArrowUp", 
      pool: "front_delts",
      instructions: [
        "Stand with feet shoulder-width apart, holding a barbell in front of your thighs.",
        "With a slight bend in the elbows, lift the bar to shoulder height.",
        "Lower the bar slowly back to the starting position.",
        "Avoid using momentum or swinging your body.",
        "Focus on isolating the front deltoids."
      ]
    },
    { 
      name: "Dumbbell Shoulder Press", 
      icon: "ArrowUpCircle", 
      pool: "front_delts",
      instructions: [
        "Sit on a bench with back support or stand tall, holding a dumbbell in each hand at shoulder height.",
        "Position your elbows out to the sides with palms facing forward.",
        "Press the dumbbells overhead until your arms are fully extended.",
        "Avoid letting the dumbbells touch at the top and keep your core braced.",
        "Lower the weights back to shoulder height with control."
      ]
    },
    { 
      name: "Military Press", 
      icon: "ArrowUpCircle", 
      pool: "front_delts",
      instructions: [
        "Stand with feet shoulder-width apart and grip a barbell with hands slightly wider than shoulders.",
        "Hold the bar at upper-chest level with elbows tucked forward.",
        "Press the bar overhead until your arms are fully locked out, keeping your core tight.",
        "Push your head forward slightly at the top to allow the bar to travel in a straight line.",
        "Slowly lower the bar back to your upper chest."
      ]
    },
    { 
      name: "Shoulder Press Machine", 
      icon: "ArrowUpCircle", 
      pool: "front_delts",
      instructions: [
        "Sit in the machine and adjust the seat height.",
        "Grip the handles and press them upward until your arms are extended.",
        "Lower the handles slowly back to shoulder height.",
        "Ensure your back remains pressed against the seat pad.",
        "Focus on driving with your shoulders rather than your triceps."
      ]
    },
    { 
      name: "Overhead Press", 
      icon: "ArrowUpCircle", 
      pool: "front_delts",
      instructions: [
        "Set the barbell at shoulder height on the rack. Grip it with hands slightly wider than shoulder-width apart.",
        "Unrack the barbell, bracing your chest, core, and glutes. Keep your forearms completely vertical.",
        "Take a deep breath, tuck your chin back slightly, and press the bar straight overhead by extending your arms.",
        "Push your head forward slightly once the bar clears your face, locking out your arms at the top of the movement.",
        "Lower the barbell back to the start position with control at the collarbone/upper chest area."
      ]
    }
  ],
  side_delts: [
    { 
      name: "Cable Lateral Raise", 
      icon: "ArrowLeftRight", 
      pool: "side_delts",
      instructions: [
        "Stand next to a cable machine and grip a handle with the opposite hand.",
        "Pull the handle across your body and out to the side until it reaches shoulder height.",
        "Slowly lower the handle back to the starting position.",
        "Maintain constant tension on the muscle throughout the rep.",
        "Keep your core engaged for stability."
      ]
    },
    { 
      name: "Dumbbell Lateral Raise", 
      icon: "ArrowLeftRight", 
      pool: "side_delts",
      instructions: [
        "Stand tall with a dumbbell in each hand, palms facing your body.",
        "With a slight bend in your elbows, raise the weights out to the sides until they are at shoulder height.",
        "Keep your torso still; do not swing the weights.",
        "Lower the dumbbells back down slowly to your sides.",
        "Focus on leading with your elbows to maximize shoulder engagement."
      ]
    },
    {
      name: "Cable Upright Row",
      icon: "ArrowLeftRight",
      pool: "side_delts",
      instructions: [
        "Attach a straight bar or EZ-bar to the low pulley of a cable machine.",
        "Stand facing the machine, holding the bar with an overhand grip (palms facing you) slightly narrower than shoulder-width.",
        "Keep your back straight and pull the bar vertically up toward your collarbone, leading with your elbows.",
        "Keep the bar close to your body throughout the upward movement, raising elbows until they are slightly higher than your shoulders.",
        "Pause for a moment at the peak contraction, then slowly lower the bar back to the starting position with complete control."
      ]
    }
  ],
  rear_delts: [
    { 
      name: "Face Pulls", 
      icon: "ArrowLeftRight", 
      pool: "rear_delts",
      instructions: [
        "Set the cable machine to upper-chest height with a rope attachment.",
        "Hold the rope with an overhand grip, thumbs facing you.",
        "Pull the rope toward your face while pulling the ends apart, leading with your elbows.",
        "Squeeze your rear deltoids and upper back at the peak of the movement.",
        "Slowly return to the starting position, keeping tension on the cable."
      ]
    },
    { 
      name: "Rear Delt Flyes", 
      icon: "ArrowLeftRight", 
      pool: "rear_delts",
      instructions: [
        "Sit on the edge of a bench and lean forward, or stand and hinge at the hips.",
        "Hold dumbbells with palms facing each other and arms hanging down.",
        "Raise the weights out to the sides, focusing on the rear deltoids.",
        "Squeeze at the top and lower the weights slowly.",
        "Avoid using your traps; keep the movement in the shoulders."
      ]
    }
  ],
  quads: [
    { 
      name: "Barbell Back Squat", 
      icon: "ArrowDown", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Position a barbell across your upper back (traps), not your neck.",
        "Stand with feet shoulder-width apart, toes slightly pointed out.",
        "Lower your hips back and down as if sitting into a chair, keeping your chest up and back straight.",
        "Lower until your thighs are at least parallel to the floor.",
        "Drive through your heels to return to the starting position."
      ]
    },
    { 
      name: "Bulgarian Split Squats", 
      icon: "Flame", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Stand a few feet in front of a bench and place one foot behind you on the bench.",
        "Lower your hips until your front thigh is parallel to the ground.",
        "Keep your front knee aligned with your foot and chest upright.",
        "Drive back up to the starting position using your front leg.",
        "Excellent for targeting quads, glutes, and improving balance."
      ]
    },
    { 
      name: "Goblet Squat", 
      icon: "ArrowDown", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Hold a dumbbell or kettlebell against your chest with both hands.",
        "Stand with feet slightly wider than shoulder-width.",
        "Squat down by pushing your hips back and bending your knees.",
        "Lower until your elbows touch the inside of your knees.",
        "Drive through your heels to return to a standing position."
      ]
    },
    { 
      name: "Hack Squat", 
      icon: "ArrowDown", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Position yourself in the hack squat machine with your back against the pad.",
        "Place your feet shoulder-width apart on the platform.",
        "Lower the platform by bending your knees until they are at 90 degrees.",
        "Push the platform back up using your quads.",
        "Keep your back flat and do not lock out your knees at the top."
      ]
    },
    { 
      name: "Leg Extensions", 
      icon: "ArrowUp", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Sit in the machine and adjust the leg pad to rest on your shins.",
        "Extend your legs until they are straight in front of you.",
        "Squeeze your quads at the top of the movement.",
        "Lower the weight slowly to the starting position.",
        "Avoid using momentum to swing the weight up."
      ]
    },
    { 
      name: "Lunges", 
      icon: "Flame", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Stand tall with feet hip-width apart and hands on your hips or holding weights.",
        "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.",
        "Keep your front knee directly above your ankle and your back knee hovering just off the floor.",
        "Push through your front heel to return to the starting position.",
        "Repeat on the other side, keeping your torso upright throughout."
      ]
    },
    { 
      name: "Seated Leg Press", 
      icon: "ArrowDown", 
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Sit in the leg press machine and place your feet shoulder-width apart on the platform.",
        "Lower the platform toward your chest by bending your knees until they are at a 90-degree angle.",
        "Push the platform away using your heels, but do not lock out your knees at the top.",
        "Keep your back and head pressed firmly against the seat throughout the movement.",
        "Maintain control as you return to the starting position."
      ]
    },
    {
      name: "Hip Abductor",
      icon: "ArrowUp",
      pool: "quads",
      muscleGroup: "glutes",
      legRegion: "upper",
      instructions: [
        "Sit in the hip abduction machine and select an appropriate resistance weight.",
        "Adjust the starting position to a comfortable range of motion, setting the thigh pads to rest against the outside of your knees.",
        "Sit tall, press your lower back firmly against the backrest, and grip the support handles.",
        "Drive your legs outward against the pads as far as comfortable, contracting your outer thighs and glutes.",
        "Pause and squeeze for a second at maximum extension, then slowly control the pads back to the starting position."
      ]
    },
    {
      name: "Hip Adductor",
      icon: "ArrowDown",
      pool: "quads",
      muscleGroup: "quads",
      legRegion: "upper",
      instructions: [
        "Sit in the hip adduction machine and select an appropriate resistance weight.",
        "Adjust the starting position so that your legs are comfortably opened, setting the thigh pads on the inside of your knees.",
        "Sit tall, press your back firmly against the seat, and grip the support handles for stability.",
        "Squeeze your legs inward together against the resistance until the pads meet, focusing on your inner thighs.",
        "Pause briefly, then slowly and under control return your legs back to the starting wide position."
      ]
    }
  ],
  hamstrings: [
    { 
      name: "Conventional Deadlift", 
      icon: "ArrowUp", 
      pool: "hamstrings",
      muscleGroup: "glutes",
      legRegion: "upper",
      instructions: [
        "Stand with your feet hip-width apart and the barbell over the middle of your feet.",
        "Hinge at your hips and grip the bar with a flat back and shins touching the bar.",
        "Drive through your legs to lift the bar, keeping it close to your shins throughout.",
        "Stand tall at the top, locking out your hips and knees.",
        "Slowly lower the bar by hinging at the hips and then bending your knees once past the thighs."
      ]
    },
    { 
      name: "Lying Hamstring Curl", 
      icon: "ArrowDown", 
      pool: "hamstrings",
      muscleGroup: "hamstrings",
      legRegion: "upper",
      instructions: [
        "Lie face down on the machine and position the pad behind your ankles.",
        "Grip the handles and curl your legs up toward your glutes.",
        "Squeeze your hamstrings at the peak of the curl.",
        "Lower your legs slowly back to the starting position.",
        "Ensure your hips remain pressed against the bench throughout."
      ]
    },
    { 
      name: "Romanian Deadlift", 
      icon: "ArrowUp", 
      pool: "hamstrings",
      muscleGroup: "hamstrings",
      legRegion: "upper",
      instructions: [
        "Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs.",
        "Keeping a slight bend in your knees, hinge at the hips and lower the weights toward the floor.",
        "Keep the weights close to your legs and your back flat until you feel a deep stretch in your hamstrings.",
        "Drive your hips forward to return to the starting position with a powerful contraction.",
        "Avoid rounding your back or letting the weights pull you too far forward."
      ]
    },
    { 
      name: "Sumo Deadlift", 
      icon: "ArrowUp", 
      pool: "hamstrings",
      muscleGroup: "glutes",
      legRegion: "upper",
      instructions: [
        "Stand with feet wider than shoulder-width and toes pointed out.",
        "Grip the bar with hands inside your knees.",
        "Lower your hips and pull the bar up by extending your hips and knees.",
        "Stand tall and squeeze your glutes at the top.",
        "Lower the bar back to the floor with control, keeping it close to your body."
      ]
    },
    {
      name: "Hip Thrust Machine",
      icon: "ArrowUp",
      pool: "hamstrings",
      muscleGroup: "glutes",
      legRegion: "upper",
      instructions: [
        "Setup & Belt/Pad Adjustment: Sit into the hip thrust machine and position the padded waist belt or lap bar securely across your lower hips (just above your hip bones).",
        "Foot Placement & Back Support: Place your feet flat on the footplate at shoulder-width distance. Adjust your upper back securely against the padded pivot rest so your shoulder blades are well supported.",
        "The Thrust (Drive Phase): Inhale, brace your core, and drive forcefully through your heels to thrust your hips upward until your knees, hips, and shoulders form a straight line.",
        "Glute Lockout & Rib Position: Lock out your hips at the top by contracting your glutes aggressively for 1-2 seconds. Keep your chin slightly tucked and your ribs pulled down to prevent lower back arching.",
        "Controlled Descent: Lower your hips back down in a smooth, controlled motion until you feel a deep stretch in your glutes, then repeat without letting the weight stack or lever crash."
      ]
    },
    {
      name: "Seated Leg Curl",
      icon: "ArrowDown",
      pool: "hamstrings",
      muscleGroup: "hamstrings",
      legRegion: "upper",
      instructions: [
        "Machine & Seat Adjustment: Sit on the seated leg curl machine and adjust the backrest so your knee joints align precisely with the machine's pivot axis. Position the thigh pad firmly against your lower quads to keep your upper body locked down.",
        "Lower Pad Placement: Adjust the lower leg roller pad so it rests comfortably against the back of your lower calves/Achilles, just above your ankles. Pull the thigh lock lever down securely.",
        "The Curl Execution: Inhale, brace your core, and drive through your hamstrings to curl the lower pad down and backward toward your glutes in a smooth, sweeping motion.",
        "Peak Contraction: Hold the fully contracted bottom position for 1-2 seconds, squeezing your hamstrings intensely while keeping your back flat against the seat.",
        "Controlled Eccentric Return: Exhale and slowly guide the pad back up to the starting position over 2-3 seconds under complete control, feeling a deep stretch across your hamstrings before initiating the next rep."
      ]
    }
  ],
  calves: [
    { 
      name: "Standing Calf Raises", 
      icon: "ArrowUp", 
      pool: "calves",
      muscleGroup: "calves",
      legRegion: "lower",
      instructions: [
        "Stand on the edge of a step or platform with your heels hanging off.",
        "Raise your heels as high as possible by pushing through the balls of your feet.",
        "Squeeze your calves at the top.",
        "Lower your heels slowly until you feel a stretch in your calves.",
        "Keep your knees straight but not locked."
      ]
    },
    { 
      name: "Seated Calf Raises", 
      icon: "ArrowUp", 
      pool: "calves",
      muscleGroup: "calves",
      legRegion: "lower",
      instructions: [
        "Sit in the calf raise machine and place the pads on your lower thighs.",
        "Lift the weight by pushing your toes down and raising your heels.",
        "Squeeze your calves at the top contraction.",
        "Lower your heels slowly towards the floor.",
        "This exercise targets the soleus muscle specifically."
      ]
    }
  ],
  long_biceps: [
    { 
      name: "Barbell Bicep Curl", 
      icon: "ArrowUpCircle", 
      pool: "long_biceps",
      instructions: [
        "Stand with feet shoulder-width apart, holding a barbell with an underhand grip.",
        "Keep your elbows tucked into your sides and your torso stationary.",
        "Curl the bar toward your shoulders by contracting your biceps.",
        "Squeeze at the top, then slowly lower the bar back to the starting position.",
        "Avoid using momentum or swinging your body to lift the weight."
      ]
    },
    { 
      name: "Dumbbell Bicep Curls", 
      icon: "ArrowUpCircle", 
      pool: "long_biceps",
      instructions: [
        "Stand with a dumbbell in each hand, arms fully extended at your sides.",
        "Keep your elbows tucked close to your torso and palms facing forward.",
        "Curl the weights toward your shoulders while contracting your biceps.",
        "Hold the contraction shortly at the top.",
        "Lower the dumbbells back to the starting position with a controlled tempo."
      ]
    },
    {
      name: "Incline Dumbbell Curls",
      icon: "Dumbbell",
      pool: "long_biceps",
      instructions: [
        "Sit on an incline bench set to a 45-degree angle, holding a dumbbell in each hand with arms hanging straight down, palms facing forward.",
        "Keep your elbows tucked close to your torso as you slowly curl the weights up toward your shoulders.",
        "Squeeze your biceps at the peak of the contraction, keeping your shoulders static.",
        "Slowly lower the dumbbells back to the starting position, maintaining control and a full stretch.",
        "Avoid swinging your arms or lifting your elbows forward during the movement."
      ]
    },
    {
      name: "Pull-up Hold",
      icon: "ArrowUpCircle",
      pool: "long_biceps",
      instructions: [
        "Hang from a pull-up bar with an underhand grip, keeping your hands shoulder-width apart to focus emphasis on the biceps.",
        "Pull your body up smoothly until your chin is completely above the bar, driving your elbows down toward your ribs.",
        "Hold this top peak-contraction position static, keeping your core tight and avoiding any swinging or leg assist.",
        "Squeeze your biceps and latissimus dorsi muscles intensely to hold your physical positioning for the target duration.",
        "Under deliberate control, slowly lower your body back to a full dead hang position once the target time is reached or failure occurs."
      ]
    }
  ],
  short_biceps: [
    { 
      name: "Cable Bicep Curls", 
      icon: "ArrowUpCircle", 
      pool: "short_biceps",
      instructions: [
        "Attach a bar or handle to the low pulley of a cable machine.",
        "Stand tall and curl the weight toward your shoulders.",
        "Maintain constant tension on the biceps throughout the movement.",
        "Slowly lower the weight back to the starting position.",
        "Keep your elbows stationary at your sides."
      ]
    },
    { 
      name: "Concentration Curls", 
      icon: "ArrowUpCircle", 
      pool: "short_biceps",
      instructions: [
        "Sit on a bench with your legs spread and lean forward.",
        "Hold a dumbbell in one hand and rest your elbow against your inner thigh.",
        "Curl the dumbbell toward your shoulder, focusing on the bicep peak.",
        "Lower the weight slowly under control.",
        "Finish all reps on one arm before switching."
      ]
    },
    { 
      name: "Preacher Curls", 
      icon: "ArrowUpCircle", 
      pool: "short_biceps",
      instructions: [
        "Sit at a preacher bench and rest your upper arms on the pad.",
        "Hold a barbell or EZ bar with an underhand grip.",
        "Curl the bar toward your chin while keeping your arms on the pad.",
        "Lower the bar slowly until your arms are fully extended.",
        "Focus on isolating the biceps without using momentum."
      ]
    },
    {
      name: "Dumbbell Preacher Curls",
      icon: "ArrowUpCircle",
      pool: "short_biceps",
      instructions: [
        "Sit at a preacher bench and adjust the seat height so your armpits rest comfortably over the top of the angled pad.",
        "Grip a dumbbell in one hand with an underhand grip (palm facing upward).",
        "Position your upper arm flat against the preacher pad, ensuring full elbow-to-armpit contact to prevent swinging or shoulder involvement.",
        "With your arm fully extended, curl the dumbbell upward toward your shoulder by flexing exclusively at your elbow, focusing on contracting the short head of the biceps.",
        "Squeeze your biceps intensely at the peak contraction, then slowly lower the dumbbell back to full extension under steady control."
      ]
    },
    { 
      name: "Spider Curls", 
      icon: "ArrowUpCircle", 
      pool: "short_biceps",
      instructions: [
        "Lie face down on an incline bench set at 45 degrees.",
        "Hold dumbbells or a barbell with arms hanging straight down.",
        "Curl the weight toward your shoulders, keeping your elbows stationary.",
        "Squeeze your biceps at the peak contraction.",
        "Slowly lower the weight back to the starting position."
      ]
    },
    { 
      name: "Machine Bicep Curl", 
      icon: "ArrowUpCircle", 
      pool: "short_biceps",
      instructions: [
        "Sit in the machine and adjust the seat so your elbows align with the pivot point.",
        "Grip the handles and curl them toward your shoulders.",
        "Control the weight as you return to the starting position.",
        "Maintain a steady tempo throughout the exercise.",
        "Provides constant tension and stability for bicep isolation."
      ]
    },
    {
      name: "Preacher Curl Machine",
      icon: "Activity",
      pool: "short_biceps",
      instructions: [
        "Machine & Seat Adjustment: Adjust the preacher curl machine seat height so that your armpits rest comfortably over the top edge of the angled pad.",
        "Arm Positioning & Grip: Place your upper arms flat and flush against the preacher pad. Grasp the machine handles with an underhand grip (palms facing up), keeping your wrists firm and neutral.",
        "The Curl (Concentric): Exhale, brace your torso firmly against the seat, and contract your biceps to curl the handles smoothly upward toward your shoulders.",
        "Peak Contraction: Squeeze your biceps forcefully at the top peak of the curl without letting your elbows lift or shift off the pad.",
        "Controlled Lowering (Eccentric): Slowly lower the handles back down under complete control (2-3 seconds) until your arms are almost fully extended, maintaining constant biceps tension while protecting your elbow joints."
      ]
    }
  ],
  brachialis: [
    { 
      name: "Hammer Curls", 
      icon: "ArrowUpCircle", 
      pool: "brachialis",
      instructions: [
        "Stand with a dumbbell in each hand, palms facing your torso.",
        "Curl the weights toward your shoulders while maintaining the neutral grip.",
        "Squeeze your biceps and brachialis at the top.",
        "Lower the dumbbells slowly to the starting position.",
        "Excellent for building thickness in the arms."
      ]
    },
    {
      name: "Crossbody Hammer Curls",
      icon: "Dumbbell",
      pool: "brachialis",
      instructions: [
        "Stand with a dumbbell in each hand, palms facing each other in a neutral grip.",
        "Keeping your upper arm stationary, curl one dumbbell across your torso towards your opposite shoulder.",
        "Contract your brachioradialis and forearm muscles at the top.",
        "Slowly lower the weight back down with control and alternate sides."
      ]
    },
    {
      name: "Bayesian Curls",
      icon: "ArrowUpCircle",
      pool: "brachialis",
      instructions: [
        "Attach a single D-handle to a cable pulley positioned at the lowest setting.",
        "Grasp the handle, turn your back to the machine, and take a large step forward into a stable, staggered stance.",
        "Allow the cable tension to pull your arm slightly behind your torso, placing the brachialis and the long head of the biceps under a deep passive stretch.",
        "Brace your core, keep your elbow completely locked relative to your body, and curl the handle forward and upward toward your shoulder.",
        "Contract your biceps and brachialis powerfully at the peak contraction, then slowly lower the handle back down under deliberate control."
      ]
    },
    {
      name: "Hammer Preacher Curls",
      icon: "ArrowUpCircle",
      pool: "brachialis",
      instructions: [
        "Sit at a preacher bench and adjust the seat height so your armpits rest comfortably over the top of the angled pad.",
        "Grip a pair of dumbbells (or a single dumbbell for one arm at a time) with a neutral hammer grip (palms facing inward).",
        "Position your upper arms flat against the preacher pad, maintaining perfect flush contact and keeping your shoulders packed back and down.",
        "With your arms fully extended, curl the weights upward by flexing exclusively at your elbow joints, keeping your wrists neutral and rigid throughout the ascent.",
        "Squeeze your brachialis and brachioradialis muscles intensely at the top of the range, then slowly lower the dumbbells back to full extension under steady control."
      ]
    }
  ],
  long_triceps: [
    { 
      name: "Overhead Tricep Extension", 
      icon: "ArrowUpCircle", 
      pool: "long_triceps",
      instructions: [
        "Hold a dumbbell with both hands or use a cable with a rope attachment.",
        "Extend your arms overhead and lower the weight behind your head.",
        "Press the weight back up until your arms are fully extended.",
        "Keep your elbows tucked in near your ears.",
        "Avoid arching your back excessively."
      ]
    },
    { 
      name: "Skull Crushers", 
      icon: "ArrowDown", 
      pool: "long_triceps",
      instructions: [
        "Lie on a flat bench holding an EZ bar or dumbbells with arms extended straight up.",
        "Keeping your upper arms stationary, bend your elbows to lower the weight toward your forehead.",
        "Stop just before the weight touches your head, then press back up using your triceps.",
        "Keep your elbows tucked in and avoid letting them flare out to the sides.",
        "Maintain a slow and controlled tempo throughout."
      ]
    },
    {
      name: "EZ Bar Skull Crushers",
      icon: "ArrowDown",
      pool: "long_triceps",
      instructions: [
        "Lie flat on a bench while holding an EZ bar over your chest with a shoulder-width overhand grip.",
        "Flex at your elbows to lower the bar in an arc towards your forehead, keeping your upper arms stationary.",
        "Stop just above your forehead, then contract your triceps to return to the starting position.",
        "Keep your elbows tucked and avoid flaring them outward during the contraction."
      ]
    },
    {
      name: "Single Arm Overhead Tricep Extension",
      icon: "ArrowUpCircle",
      pool: "long_triceps",
      instructions: [
        "Machine Setup & Cable Height: Set a single cable pulley to a low or waist-height position. Attach a single D-handle or single rope attachment. Stand facing away from the cable stack with your feet in a stable split stance.",
        "Grip & Overhead Positioning: Reach back and grab the handle with one hand, bringing your upper arm vertically alongside your head so your elbow points toward the ceiling. Use your non-working hand to brace your core or torso for stability.",
        "The Extension (Execution): Inhale, brace your core, and extend your arm upwards by contracting your triceps until your elbow is fully extended overhead. Keep your upper arm stationary and close to your head throughout.",
        "Peak Contraction: Squeeze the long head of your tricep intensely at the top lockout position for a brief second, feeling complete muscular engagement.",
        "Controlled Eccentric Stretch: Slowly lower the handle back behind your head in a controlled 2-3 second movement, taking your tricep into a deep stretch before initiating the next repetition."
      ]
    },
    {
      name: "Bayesian Tricep Extension",
      icon: "ArrowUpCircle",
      pool: "long_triceps",
      muscleGroup: "triceps",
      instructions: [
        "Cable & Pulley Setup: Set a cable pulley at high height (shoulder height or above) and attach a single handle or D-grip attachment. Stand facing away from the cable machine with feet staggered for maximum stability.",
        "Initial Positioning: Hold the attachment behind your body, letting your upper arm angle backward so your tricep long head is under continuous stretch.",
        "Extension Execution: Inhale, brace your core, and extend your arm forward and upward by contracting your triceps until your elbow locks out.",
        "Peak Contraction: Squeeze your triceps intensely at the top of the movement while keeping your shoulder stabilized.",
        "Controlled Stretch: Slowly lower the weight back into the deep stretched position behind you over 2-3 seconds before starting the next rep."
      ]
    },
    {
      name: "Bayesian Tricep",
      icon: "ArrowUpCircle",
      pool: "long_triceps",
      muscleGroup: "triceps",
      instructions: [
        "Cable & Pulley Setup: Set a cable pulley at high height (shoulder height or above) and attach a single handle or D-grip attachment. Stand facing away from the cable machine with feet staggered for maximum stability.",
        "Initial Positioning: Hold the attachment behind your body, letting your upper arm angle backward so your tricep long head is under continuous stretch.",
        "Extension Execution: Inhale, brace your core, and extend your arm forward and upward by contracting your triceps until your elbow locks out.",
        "Peak Contraction: Squeeze your triceps intensely at the top of the movement while keeping your shoulder stabilized.",
        "Controlled Stretch: Slowly lower the weight back into the deep stretched position behind you over 2-3 seconds before starting the next rep."
      ]
    }
  ],
  lateral_triceps: [
    { 
      name: "Tricep Pushdowns", 
      icon: "ArrowDown", 
      pool: "lateral_triceps",
      instructions: [
        "Stand facing the cable machine with a straight bar or rope attachment at chest height.",
        "Grip the attachment with an overhand grip, elbows tucked into your sides.",
        "Push the bar down until your arms are fully extended at your sides.",
        "Focus on using only your triceps to move the weight; keep your shoulders still.",
        "Slowly bring the bar back up to the starting position."
      ]
    },
    {
      name: "Single Arm Tricep Pushdown",
      icon: "ArrowDown",
      pool: "lateral_triceps",
      instructions: [
        "Set Up & Attachment: Set a cable pulley to the high top setting and attach a single D-handle or comfortable single grip attachment.",
        "Stance & Elbow Fixation: Stand upright facing the cable machine in a solid athletic stance. Grab the handle with an overhand or neutral grip and lock your working elbow firmly against the side of your torso.",
        "Execution (Pushdown): Exhale and drive the handle straight down by contracting your triceps until your arm is completely straight alongside your hip.",
        "Peak Squeeze: Flex and squeeze your tricep aggressively at the bottom lockout position without allowing your shoulder to roll forward or lift.",
        "Controlled Negative: Slowly guide the handle back up to approximately 90 degrees at elbow height, maintaining continuous cable tension on the tricep throughout the full range of motion."
      ]
    }
  ],
  medial_triceps: [
    {
      name: "Single Arm - Tricep Pulldown",
      icon: "ArrowDown",
      pool: "medial_triceps",
      instructions: [
        "Attach a single D-handle to a high cable pulley machine connection.",
        "Stand facing or slightly offset from the machine, holding the handle with a neutral or underhand grip.",
        "Tuck your active elbow tightly into the side of your body and keep it completely stationary.",
        "Engage your tricep to push the handle straight down until your arm is fully locked out at the bottom.",
        "Squeeze your tricep firmly for a split second, then slowly guide the handle back up to chest height."
      ]
    },
    {
      name: "Tricep Pulldown",
      icon: "ArrowDown",
      pool: "medial_triceps",
      instructions: [
        "Attach a straight bar or EZ-bar to a high cable pulley machine connection.",
        "Hold the attachment using an underhand (palms facing upward) reverse grip slightly narrower than shoulder-width.",
        "Pin your elbows tightly close to your ribs while leaning your upper torso forward slightly.",
        "Fully extend your arms straight down toward your upper thighs by contracting your triceps.",
        "Hold the maximum squeeze at the bottom of the range, then slowly return the bar back to the starting position."
      ]
    },
    { 
      name: "Close Grip Bench Press", 
      icon: "Dumbbell", 
      pool: "medial_triceps",
      instructions: [
        "Lie on a flat bench and grip the barbell with hands about 8-12 inches apart.",
        "Lower the bar to your mid-chest while keeping your elbows tucked to your sides.",
        "Press the bar back up explosively using your triceps.",
        "Keep your feet flat on the floor and core engaged.",
        "This version shifts the emphasis from the chest to the triceps."
      ]
    },
    { 
      name: "Dumbbell Floor Fly", 
      icon: "ArrowLeftRight", 
      pool: "medial_triceps",
      instructions: [
        "Lie on the floor with your knees bent and feet flat.",
        "Hold dumbbells above your chest with a slight bend in the elbows.",
        "Lower the weights out to the sides until your upper arms touch the floor.",
        "Squeeze your chest and triceps to bring the weights back together.",
        "The floor limits the range of motion, protecting the shoulders."
      ]
    },
    { 
      name: "Machine Triceps Extension", 
      icon: "ArrowDown", 
      pool: "medial_triceps",
      instructions: [
        "Sit in the machine and place your elbows on the pads.",
        "Grip the handles and extend your arms fully.",
        "Squeeze the triceps at the peak of the extension.",
        "Slowly return to the starting position under control.",
        "Adjust the seat so your elbows are in a comfortable position."
      ]
    },
    { 
      name: "Assisted Tricep Dips", 
      icon: "ArrowDown", 
      pool: "medial_triceps",
      instructions: [
        "Grip the parallel bars and lift yourself up with locked elbows.",
        "Lower your body by bending your elbows until they are at 90 degrees.",
        "Push yourself back up to the starting position.",
        "Keep your torso upright to maximize tricep engagement.",
        "Avoid flaring your elbows; keep them tucked close to your body."
      ]
    },
    { 
      name: "Weighted Tricep Dips", 
      icon: "ArrowDown", 
      pool: "medial_triceps",
      instructions: [
        "Load Setup & Positioning: Attach a weight plate to a dip belt secured around your waist, or hold a dumbbell between your feet. Mount the dip bars and lift yourself to the starting position with locked arms.",
        "Grip & Torso Alignment: Position your hands on the parallel bars with a firm grip. Keep your torso upright and shoulders pulled down (depressed) to maximize triceps recruitment and protect the joints.",
        "The Descent (Eccentric Phase): Inhale and slowly lower your body by bending your elbows. Keep your elbows tucked close to your body, pointing backwards, until your upper arms are roughly parallel to the floor (about 90 degrees).",
        "The Drive (Concentric Phase): Exhale and press through your palms, contracting your triceps intensely to push your body back up to the starting position.",
        "Lockout & Control: Lock out your elbows at the top of the movement and squeeze your triceps. Maintain complete control over the added weight, avoiding any swinging or momentum throughout the set."
      ]
    },
    { 
      name: "Tricep Push Ups", 
      icon: "Activity", 
      pool: "medial_triceps",
      instructions: [
        "Start in a plank position with hands directly under your shoulders.",
        "Keep your elbows tucked in close to your ribs as you lower your body.",
        "Press back up using your triceps.",
        "Maintain a straight line from head to heels.",
        "This variant focuses heavily on the triceps compared to a standard push-up."
      ]
    }
  ],
  upper_core: [
    { 
      name: "Ab Crunches", 
      icon: "Activity", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Lie on your back with knees bent and feet flat on the floor.",
        "Place your hands behind your head or across your chest.",
        "Lift your shoulders off the floor using your abdominal muscles.",
        "Squeeze at the top and lower back down slowly.",
        "Avoid pulling on your neck; focus on the core contraction."
      ]
    },
    { 
      name: "Ab Machine", 
      icon: "Activity", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Sit in the machine and adjust the seat so your waist aligns with the pivot point.",
        "Secure your feet behind the pads and grip the handles.",
        "Contract your abs to curl your torso forward.",
        "Squeeze at the peak of the movement.",
        "Slowly return to the starting position under control."
      ]
    },
    { 
      name: "Ab Wheel Rollouts", 
      icon: "RotateCw", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Kneel on the floor and hold the ab wheel handles.",
        "Roll the wheel forward as far as you can while maintaining a flat back.",
        "Use your core to pull the wheel back to the starting position.",
        "Avoid letting your hips sag or your back arch.",
        "Progress slowly to increase the range of motion."
      ]
    },
    { 
      name: "Cable Crunches", 
      icon: "ArrowDown", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Kneel in front of a cable machine with a rope attachment set high.",
        "Grasp the rope and pull it down until your hands are next to your head.",
        "Contract your abs to bring your elbows toward your knees.",
        "Squeeze your core at the bottom of the movement.",
        "Slowly return to the starting position while keeping tension on the cables."
      ]
    },
    { 
      name: "Plank", 
      icon: "Activity", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Place your forearms on the floor with elbows directly under your shoulders.",
        "Extend your legs behind you, resting on your toes.",
        "Keep your body in a straight line from head to heels.",
        "Engage your core and glutes to prevent your hips from sagging.",
        "Hold this position for the target duration while breathing steadily."
      ]
    },
    { 
      name: "Sit Ups", 
      icon: "Activity", 
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Lie on your back with knees bent and feet anchored or flat on the floor.",
        "Curl your torso all the way up until your chest is near your knees.",
        "Slowly lower yourself back to the starting position.",
        "Engage your abs throughout the entire range of motion.",
        "Maintain a controlled pace to maximize muscle engagement."
      ]
    },
    {
      name: "Bird Dog",
      icon: "Activity",
      pool: "upper_core",
      muscleGroup: "upper_core",
      instructions: [
        "Start on all fours with your hands directly under your shoulders and knees under your hips.",
        "Slowly extend one arm straight forward while kicking the opposite leg straight back.",
        "Maintain a completely flat back and square hips to ensure core engagement.",
        "Slowly return to the starting position and repeat on the alternate side."
      ]
    }
  ],
  lower_core: [
    { 
      name: "Hanging Leg Raises", 
      icon: "ArrowUp", 
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Hang from a pull-up bar with an overhand grip and arms fully extended.",
        "Keeping your legs straight or slightly bent, lift them until they are parallel to the floor.",
        "Focus on using your lower abs to pull your legs up, avoiding excessive swinging.",
        "Slowly lower your legs back to the starting position with control.",
        "To increase difficulty, bring your toes all the way to the bar."
      ]
    },
    {
      name: "Lying Leg Raises",
      icon: "ArrowUp",
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Lie flat on your back with your legs straight and hands either under your hips or at your sides.",
        "Keeping your legs as straight as possible, lift them until they are vertical.",
        "Slowly lower them back down until they are just hovering above the floor.",
        "Engage your lower abs throughout and keep your lower back pressed into the floor."
      ]
    },
    {
      name: "Reverse Crunches",
      icon: "Activity",
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Lie on your back with your knees bent at 90-degrees and hands flat on the floor.",
        "Contract your abs to pull your knees toward your chest, lifting your hips off the floor.",
        "Slowly lower your hips and feet back down without letting your feet touch the floor.",
        "Avoid using momentum; focus entirely on the lower core contraction."
      ]
    },
    {
      name: "Deadbug",
      icon: "Activity",
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Lie flat on your back, arms extended straight over your shoulders, knees bent at 90-degrees over your hips.",
        "Slowly lower one arm behind your head while simultaneously extending the opposite leg forward.",
        "Exhale, drive your lower back into the floor, and return them both to the start position.",
        "Repeat with the other arm and leg, focusing on core stabilization."
      ]
    },
    {
      name: "Flutter Kicks",
      icon: "Activity",
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Lie on your back with legs straight, hands underneath your lower back or glutes for support.",
        "Lift your legs about 15cm off the ground.",
        "Perform rapid, short scissor-like kicking motions up and down.",
        "Keep your legs straight, toes pointed, and lower back firmly pressed into the pad/floor."
      ]
    },
    {
      name: "V Sit-Ups",
      icon: "Activity",
      pool: "lower_core",
      muscleGroup: "lower_core",
      instructions: [
        "Lie flat on your back with your legs straight and arms extended fully behind your head.",
        "In one synchronized motion, contract your brace core to lift both your legs and your upper body up off the floor.",
        "Reach your hands forward to touch your toes or shins, forming a 'V' shape with your body.",
        "Slowly lower your arms and legs back to the starting resting position, maintaining core stability and control throughout."
      ]
    }
  ],
  obliques: [
    { 
      name: "Bicycle Crunches", 
      icon: "Activity", 
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Lie on your back and bring your knees to a 90-degree angle.",
        "Perform a crunch motion while alternating bringing opposite elbows to knees.",
        "Straighten the other leg out as you twist.",
        "Maintain a steady rhythm and keep your core engaged.",
        "Excellent for targeting the obliques and overall core stability."
      ]
    },
    { 
      name: "Russian Twists", 
      icon: "RotateCw", 
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Sit on the floor with your knees bent and feet slightly elevated.",
        "Lean back slightly and hold your hands together in front of you.",
        "Rotate your torso from side to side, touching the floor on each side.",
        "Keep your back straight and core braced.",
        "Can be performed with a weight for added difficulty."
      ]
    },
    {
      name: "Side Plank",
      icon: "Activity",
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Lie on your side with your elbow directly under your shoulder, feet stacked or staggered.",
        "Lift your hips until your body forms a straight diagonal line from head to heels.",
        "Engage your obliques, keep your core braced, and hold the position without dipping.",
        "Repeat on the opposite side to balance lateral core strength."
      ]
    },
    {
      name: "Alternate Heel Taps",
      icon: "Activity",
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Lie flat on your back with your knees bent and feet flat on the floor, about hip-width apart.",
        "Crunch your head and shoulders slightly off the ground to engage your upper abs.",
        "Engage your obliques to reach your right hand to tap your right heel, then left hand to left heel.",
        "Maintain a continuous, controlled lateral twisting rhythm."
      ]
    },
    {
      name: "Wood Chops (Mid)",
      icon: "Activity",
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Set the cable pulley to shoulder/chest height.",
        "Stand sideways to the machine with a wide stance, and grasp the handle with both hands.",
        "With arms extended, pull the cable horizontally across your body while rotating your hips and pivoting your back foot.",
        "Engage your obliques intensely as you reach the peak horizontal twist.",
        "Slowly return to the starting position under full control, resisting the weight pull, and repeat before swapping sides."
      ]
    },
    {
      name: "Wood Chops (H2L)",
      icon: "Activity",
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Set the cable pulley to a high position (above head height).",
        "Stand sideways to the cable machine with a wide athletic stance, holding the handle with both hands.",
        "With straight arms, pull the handle diagonally downward and across your body towards the opposite knee.",
        "Rotate your torso, hips, and pivot your trailing foot as you pull down, squeezing your obliques at the bottom.",
        "Slowly and under control, return to the starting high position, maintaining tension on the core."
      ]
    },
    {
      name: "Wood Chops (L2H)",
      icon: "Activity",
      pool: "obliques",
      muscleGroup: "obliques",
      instructions: [
        "Set the cable pulley to a low position (near the ground).",
        "Stand sideways to the cable machine with feet shoulder-width apart, holding the handle with both hands.",
        "With arms extended, pull the handle diagonally upward and across your body, ending above your opposite shoulder.",
        "Pivot your trailing foot and rotate your hips and shoulders dynamically to drive the movement from your obliques.",
        "Control the weight back down along the same diagonal path to the starting position."
      ]
    }
  ],
  forearms: [
    {
      name: "Cable Wrist Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Position the cable pulley at the highest setting and connect a single handle (D-handle) attachment.",
        "Stand facing the machine, grasp the handle with a secure underhand grip, and position your elbow close to your side with the forearm parallel to the floor.",
        "Brace your core and isolate your arm. Using only your wrist joint, pull the handle downward in a curling motion, squeezing your forearm flexors at the peak contraction.",
        "Slowly allow the cable tension to pull your wrist back upward to the starting position under full control, ensuring your elbow and shoulder remain completely stationary."
      ]
    },
    {
      name: "Reverse Cable Wrist Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Position the cable pulley at the lowest setting and connect a single handle (D-handle) attachment.",
        "Stand or kneel facing the machine, grasp the handle with an overhand grip (palm facing down), and rest your forearm comfortably against your thigh or support pad for isolation.",
        "Using only your wrist joint, extension-curl the handle upward against the resistance of the cable, focusing on contracting the forearm extensor muscles at the top of the movement.",
        "Slowly lower the handle back down to the starting position, resisting the pull of the cable under steady and deliberate control."
      ]
    },
    {
      name: "Dumbbell Wrist Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Sit on a flat bench with your forearms resting flat on your thighs or on the bench, holding dumbbells or a barbell with palms facing up.",
        "Allow the weight to roll down slightly into your fingers, extending your wrists toward the floor.",
        "Curl your wrists upward as high as possible, contracting and squeezing your forearm flexor muscles at the top of the movement.",
        "Slowly lower the weight back down to the starting position with control under full tension."
      ]
    },
    {
      name: "Reverse Dumbbell Wrist Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Sit on a flat bench with your forearms resting flat on your thighs or on the bench, holding dumbbells or a barbell with palms facing down (pronated grip).",
        "Let your wrists hang slightly over your knees, allowing the weight to extend down towards the floor.",
        "Raise the weight by extending your wrists upward as high as possible, feeling a deep contraction in your forearm extensor muscles.",
        "Lower the weight slowly with steady control to return to the starting position."
      ]
    },
    {
      name: "Reverse Barbell Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Stand up tall, holding a barbell with a pronated shoulder-width overhand grip (palms facing down).",
        "Keeping your elbows tucked strictly against your sides, curl the bar upward toward your shoulders.",
        "Squeeze the brachioradialis forearm muscles at the top of the contraction.",
        "Slowly lower the barbell back to the start position with controlled speed."
      ]
    },
    {
      name: "Farmer's Hand Walk Carry",
      icon: "Dumbbell",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Place two heavy dumbbells or kettlebells on the floor on either side of you.",
        "Grip them firmly, stand up tall with shoulders set back and down, and engage your core.",
        "Walk forward in a controlled manner, maintaining a strong, unyielding grip on the handles.",
        "Keep your spine tall and head up throughout the duration of the walk."
      ]
    },
    {
      name: "Behind-the-Back Wrist Curls",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Stand tall holding a barbell behind your glutes with an overhand grip (palms facing away from your body).",
        "Allow the bar to roll down slightly into your fingertips.",
        "Curl your wrists upward, pulling the bar up as high as possible, squeezing your forearm extensors/flexors.",
        "Slowly return to the start position with controlled speed."
      ]
    },
    {
      name: "Plate Pinch Carry",
      icon: "Dumbbell",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Take two smooth olympic weight plates and pinch them together between your thumb and fingers of one hand.",
        "Lift them off the floor, stand tall, and hold them for a target duration, or walk forward carefully.",
        "Ensure your shoulders remain packed back and your posture is perfectly upright."
      ]
    },
    {
      name: "Passive Dead Hang",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Hang from a pull-up bar with an overhand grip, slightly wider than shoulder-width apart.",
        "Keep your arms straight and engage your shoulder blades by pulling them down and together slightly.",
        "Maintain this hanging position for as long as possible, keeping your core stable and braced."
      ]
    },
    {
      name: "Towel Grip Pull-ups",
      icon: "Activity",
      pool: "forearms",
      muscleGroup: "forearms",
      instructions: [
        "Drape one or two thick towels over a secure pull-up bar.",
        "Grip the towel ends firmly with both hands, using a neutral grip.",
        "Hang with straight arms, then pull your chest up towards the bar by driving your elbows down.",
        "Slowly lower yourself back down to a full hang, placing huge demand on your grip and forearm strength."
      ]
    }
  ],
  cardio: [
    {
      name: "Treadmill Hike",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Set the treadmill incline to 15 degrees.",
        "Walk at a steady, challenging pace (typically 2.5 - 3.5 mph).",
        "Maintain an upright posture and avoid holding onto the handrails to maximize core and leg engagement.",
        "Pump your arms rhythmically to drive your stride."
      ]
    },
    {
      name: "HIIT Rowing",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Sit tall on the rower seat and secure your feet in the straps.",
        "Push off dynamically with your legs first, then lean back slightly and pull the handle to your lower chest.",
        "Extend your arms, lean forward from the hips, and bend your knees to slide back to the start.",
        "Perform intervals of 30 seconds of maximum effort followed by 30 seconds of slow recovery."
      ]
    },
    {
      name: "Elliptical Interval Sprint",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Grip the moving handles of the elliptical trainer.",
        "Begin pedaling rapidly, aiming for a high resistance and SPM (strides per minute).",
        "Alternate between 1 minute of high-intensity sprint and 1 minute of active recovery.",
        "Keep your core contracted and push and pull active handles."
      ]
    },
    {
      name: "Stairmaster Climb",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Step onto the Stairmaster and select a challenging speed level.",
        "Step firmly through your entire foot, pushing with your glutes and hamstrings rather than just your toes.",
        "Avoid leaning with your upper body weight on the handrails.",
        "Keep a steady rhythm and focus on breathing."
      ]
    },
    {
      name: "Jump Rope Sessions",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Hold the jump rope handles with your hands at hip height, elbows close to your torso.",
        "Jump only high enough to clear the rope (about 1 inch off the ground).",
        "Land softly on the balls of your feet to absorb the impact.",
        "Turn the rope using your wrists, not your entire arms."
      ]
    },
    {
      name: "Stationary Cycling",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Adjust the bike seat height so there is a slight bend in your knee at the bottom of the pedal stroke.",
        "Pedal at a steady cadence (80-100 RPM) with moderate resistance.",
        "Keep your back flat and shoulders relaxed.",
        "Engage your hamstrings by pulling up at the bottom of the pedal stroke."
      ]
    },
    {
      name: "Assault Bike Sprint",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Sit on the assault bike, grabbing the handles firmly.",
        "Pedal as fast as possible while pulling and pushing the handles in sync.",
        "Maintain high effort intervals (e.g., 20 seconds on, 10 seconds active recovery).",
        "Keep your back straight and drive from your legs and upper body simultaneously."
      ]
    },
    {
      name: "Burpee Cardio Intervals",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Start on a standing position, then drop into a squat with hands on the floor.",
        "Jump your feet back to a pushup position, lower your chest, then push up.",
        "Jump your feet forward to the hands, and jump explosively into the air with hands overhead.",
        "Repeat continuously with a fast, controlled tempo."
      ]
    },
    {
      name: "High-Knee Sprints",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Stand with feet hip-width apart and jog in place rapidly.",
        "Drive your knees up toward your chest as high as possible, aiming to reach waist height.",
        "Pump your arms to stay balanced and speed up the cadence.",
        "Land softly on the balls of your feet."
      ]
    },
    {
      name: "Mountain Climbers",
      icon: "Activity",
      pool: "cardio",
      instructions: [
        "Enter a strong high plank position with shoulders directly above your wrists.",
        "Drive one knee toward your chest quickly, then return it to the start as you drive the opposite knee forward.",
        "Maintain a flat back and low hips, keeping a rapid running cadence.",
        "Breathe steadily throughout the duration."
      ]
    }
  ],
  equipment: [
    {
      name: "Kettlebell Swing",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Kettlebells",
      instructions: [
        "Stand with feet shoulder-width apart, holding a kettlebell with both hands in front of you.",
        "Hinge at your hips, bending slightly at your knees, and pull the kettlebell back between your legs.",
        "Drive your hips forward dynamically, fully contracting your glutes and hamstrings to swing the bell up to shoulder height.",
        "Allow the kettlebell to swing back down controlled as you hinge your hips back for the next rep."
      ]
    },
    {
      name: "Kettlebell Goblet Squat",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Kettlebells",
      instructions: [
        "Hold a kettlebell close to your chest by the horns with both hands.",
        "Set feet shoulder-width apart and squat down deeply, keeping your chest upright and knees tracking over toes.",
        "Drive through the entire foot back to the starting position."
      ]
    },
    {
      name: "TRX Suspension Row",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "TRX",
      instructions: [
        "Grip the TRX handles and lean backward, forming a straight line from head to heels with your arms extended.",
        "Pull your chest up towards the handles by driving your elbows backward and squeezing your shoulder blades.",
        "Slowly lower yourself back to the starting position with control."
      ]
    },
    {
      name: "TRX Pushup",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "TRX",
      instructions: [
        "Place your feet in the TRX foot cradles and assume a pushup position.",
        "Lower your chest to the ground, keeping your body perfectly aligned and core heavily braced.",
        "Push back up to the top plank position."
      ]
    },
    {
      name: "Battle Rope Double Waves",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Battle Ropes",
      instructions: [
        "Hold a battle rope handle in each hand with feet shoulder-width apart in a quarter-squat stance.",
        "Vigorously pump both arms up and down simultaneously to create smooth, rolling waves in the ropes.",
        "Engage your core and legs to keep your posture grounded."
      ]
    },
    {
      name: "Battle Rope Alternating Waves",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Battle Ropes",
      instructions: [
        "From a quarter-squat stance, alternate rapidly pumping your left and right arms up and down.",
        "Focus on high-speed movements, keeping the waves traveling all the way to the anchor point."
      ]
    },
    {
      name: "Band Pull-Aparts",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Resistance Bands",
      instructions: [
        "Hold a resistance band with hands shoulder-width apart in front of your chest.",
        "Keep your arms straight and pull your shoulder blades together to stretch the band across your chest.",
        "Carefully return to the starting position."
      ]
    },
    {
      name: "Band Bicep Curls",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Resistance Bands",
      instructions: [
        "Stand on the middle of the resistance band and hold the handles at your sides.",
        "Curl your hands toward your shoulders, squeezing your biceps at the top.",
        "Slowly lower your hands back down."
      ]
    },
    {
      name: "Plate Ground to Overhead",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Weight Plates",
      instructions: [
        "Squat down and grasp a weight plate on opposite sides with both hands.",
        "In one explosive movement, drive your legs and raise the plate straight overhead.",
        "Lower the plate back to the ground with a flat back."
      ]
    },
    {
      name: "Plate Halo",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Weight Plates",
      instructions: [
        "Hold a weight plate close to your chest by its edges.",
        "Circumnavigate the plate around your head in a circular 'halo' motion, engaging your shoulders and core.",
        "Reverse the circular direction for the next repetition."
      ]
    },
    {
      name: "Overhead Ball Slam",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Slam Balls",
      instructions: [
        "Stand tall with feet hip-width apart, holding the slam ball with both hands.",
        "Raise the ball straight overhead, extending your hips and knees.",
        "Use your core and arms to explosively slam the ball into the floor as hard as possible.",
        "Catch the bounce or scoop the ball up and repeat."
      ]
    },
    {
      name: "Slam Ball Russian Twist",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Slam Balls",
      instructions: [
        "Sit on the floor holding a slam ball with knees bent and feet slightly elevated.",
        "Move the slam ball across your body to touch the floor on either side, rotating your torso."
      ]
    },
    {
      name: "Box Jumps",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Plyo Boxes",
      instructions: [
        "Stand facing the plyo box in an athletic stance.",
        "Hinge at the hips, swing your arms, and jump explosively onto the box, landing softly in a partial squat.",
        "Step down carefully and repeat."
      ]
    },
    {
      name: "Step-Ups",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Plyo Boxes",
      instructions: [
        "Place one foot firmly on the center of the plyo box.",
        "Push through your heel to lift your entire body up until your leg is fully extended.",
        "Step down slowly using the same leg."
      ]
    },
    {
      name: "Bosu Ball Dome Squats",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Bosu Balls",
      instructions: [
        "Place the Bosu ball dome-side up on the ground.",
        "Carefully step onto the center of the dome, establishing balance.",
        "Squat down slowly, maintaining a strong, stable core to handle the ankle stabilizers."
      ]
    },
    {
      name: "Bosu Ball Plank",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Bosu Balls",
      instructions: [
        "Place the Bosu ball flat-side up (or dome-side up for preference) and grip the edge handles.",
        "Extend your legs behind you and hold a straight plank position, managing the micro-wobbles."
      ]
    },
    {
      name: "Weighted Sled Push",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Sleds",
      instructions: [
        "Grip the high handles of the training sled, keeping a flat back and low hips.",
        "Drive forward with explosive leg power, taking long, strong strides to push the sled across the turf."
      ]
    },
    {
      name: "Weighted Sled Pull",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Sleds",
      instructions: [
        "Attach straps or a rope to the sled and walk backward, pulling the sled toward yourself by driving your legs through each step."
      ]
    },
    {
      name: "Kettlebell Clean & Press",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Kettlebells",
      instructions: [
        "Position a kettlebell between your legs on the floor.",
        "Hinge at the hips, pull the bell up and pivot it nicely to the rack position at your chest (the clean).",
        "Brace your core and press the kettlebell straight upward overhead (the press).",
        "Lower back down with control."
      ]
    },
    {
      name: "Kettlebell Turkish Get-Up",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Kettlebells",
      instructions: [
        "Lie flat on the floor holding a kettlebell upright in one hand.",
        "Systematically move from lying to knee-prop, kneeling, standing, and back down, keeping the arm extended straight up.",
        "Maintain focus on the kettlebell at all times to stabilize."
      ]
    },
    {
      name: "TRX Chest Fly",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "TRX",
      instructions: [
        "Facing away from the anchor, hold TRX straps out in front of you.",
        "Slowly extend your arms out wide to the sides, lowering your chest forward.",
        "Contract your chest to bring your hands back together."
      ]
    },
    {
      name: "TRX Pistol Squat",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "TRX",
      instructions: [
        "Hold onto the TRX handles and lift one leg off the floor.",
        "Lower your hips down and back into a deep single-leg squat, using the straps for assistance/balance.",
        "Drive back up using your working leg."
      ]
    },
    {
      name: "Battle Rope Slams",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Battle Ropes",
      instructions: [
        "Raise both battle rope handles straight overhead, lifting onto your toes.",
        "Explosively slam both hands down toward the floor, bending the knees into a squat."
      ]
    },
    {
      name: "Battle Rope Outside Circles",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Battle Ropes",
      instructions: [
        "Hold handles at hip height and swing arms in outward circular motions.",
        "This isolates the shoulder stabilizers and challenges core rotational control."
      ]
    },
    {
      name: "Band Glute Kickbacks",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Resistance Bands",
      instructions: [
        "Loop a band around your ankles and stand upright or lean forward on a bench.",
        "Drive one leg straight back against the resistance, squeezing the glute at the apex."
      ]
    },
    {
      name: "Band Chest Press",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Resistance Bands",
      instructions: [
        "Anchor the band behind you and hold both handles near your chest.",
        "Press your hands straight forward, squeezing the chest at the point of peak band tension."
      ]
    },
    {
      name: "Plate Front Raise",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Weight Plates",
      instructions: [
        "Hold a weight plate on opposite sides in front of your thighs.",
        "Keeping your arms nearly straight, lift the plate directly forward to shoulder height.",
        "Lower under control with no body swing."
      ]
    },
    {
      name: "Plate Overhead Lunge",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Weight Plates",
      instructions: [
        "Hold a weight plate flat overhead, locking your arms out.",
        "Step forward into a lunge, keeping the plate balanced securely overhead.",
        "Squeeze your core and shoulders for stability."
      ]
    },
    {
      name: "Slam Ball Bear Hug Squat",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Slam Balls",
      instructions: [
        "Hug a heavy slam ball tightly against your chest.",
        "Squat down to parallel, keeping your back straight and the load snug.",
        "Drive back to standing."
      ]
    },
    {
      name: "Slam Ball Chest Pass",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Slam Balls",
      instructions: [
        "Hold a slam ball at chest height facing a sturdy wall or partner.",
        "Explosively throw the ball forward from your chest.",
        "Catch the rebound and immediately transition into the next pass."
      ]
    },
    {
      name: "Lateral Box Jumps",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Plyo Boxes",
      instructions: [
        "Stand side-by-side next to a plyo box.",
        "Jump explosively sideways/upward onto the center of the box, landing softly.",
        "Step down safely."
      ]
    },
    {
      name: "Box Decline Pushups",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Plyo Boxes",
      instructions: [
        "Place your toes on the edge of the plyo box and hands on the floor.",
        "Perform a decline pushup, driving your upper chest and anterior deltoids."
      ]
    },
    {
      name: "Bosu Ball Mountain Climbers",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Bosu Balls",
      instructions: [
        "Place the Bosu ball flat-side up and hold onto the edge handles.",
        "Rapidly drive your knees in and out toward your chest in a running cadence, managing the balance challenge."
      ]
    },
    {
      name: "Bosu Ball Side Plank",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Bosu Balls",
      instructions: [
        "Rest one forearm on the dome of the Bosu ball.",
        "Stack your feet and lift your hips into a side plank, stabilizing through your lower oblique core."
      ]
    },
    {
      name: "Sled Drag",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Sleds",
      instructions: [
        "Attach a harness to your waist connected to the sled.",
        "Walk or sprint forward, dragging the sled behind you with explosive leg drive."
      ]
    },
    {
      name: "Sled Row",
      icon: "Dumbbell",
      pool: "equipment",
      equipmentCategory: "Sleds",
      instructions: [
        "Hold onto sled straps facing the sled.",
        "Perform explosive rowing pulls to pull the sled closer, then step back and repeat."
      ]
    }
  ]
};

export function getExerciseCategory(name: string, pool: string): 'compound' | 'isolation' {
  const n = name.toLowerCase();
  
  if (pool === 'chest' || pool === 'upper_chest' || pool === 'middle_chest' || pool === 'lower_chest') {
    if (n.includes('press') || n.includes('push up') || n.includes('pushup') || n.includes('dip')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'back' || pool === 'upper_back' || pool === 'lower_back') {
    if (n.includes('straight arm') || n.includes('hyperexten') || n.includes('extension')) {
      return 'isolation';
    }
    return 'compound'; 
  }
  
  if (pool === 'shoulders' || pool === 'front_delts' || pool === 'side_delts' || pool === 'rear_delts') {
    if (n.includes('press') || n.includes('military')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'legs' || pool === 'quads' || pool === 'hamstrings' || pool === 'calves') {
    if (n.includes('squat') || n.includes('deadlift') || n.includes('lunge') || n.includes('press')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'biceps' || pool === 'long_biceps' || pool === 'short_biceps' || pool === 'brachialis') {
    return 'isolation';
  }
  
  if (pool === 'triceps' || pool === 'long_triceps' || pool === 'lateral_triceps' || pool === 'medial_triceps') {
    if (n.includes('bench press') || n.includes('dip') || n.includes('push up') || n.includes('pushup')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'core' || pool === 'upper_core' || pool === 'lower_core' || pool === 'obliques') {
    if (
      n.includes('plank') || 
      n.includes('wheel') || 
      n.includes('hanging') || 
      n.includes('sit up') ||
      n.includes('sit-up') ||
      n.includes('situp') ||
      n.includes('v sit') ||
      n.includes('v-sit') ||
      n.includes('deadbug') ||
      n.includes('bird dog')
    ) {
      return 'compound';
    }
    return 'isolation';
  }

  if (pool === 'cardio') {
    return 'compound';
  }

  if (pool === 'equipment') {
    if (
      n.includes('swing') ||
      n.includes('squat') ||
      n.includes('row') ||
      n.includes('pushup') ||
      n.includes('overhead') ||
      n.includes('jump') ||
      n.includes('step-up') ||
      n.includes('push') ||
      n.includes('pull') ||
      n.includes('plank') ||
      n.includes('wave') ||
      n.includes('press') ||
      n.includes('get-up') ||
      n.includes('clean') ||
      n.includes('snatch') ||
      n.includes('lunge') ||
      n.includes('climber') ||
      n.includes('drag') ||
      n.includes('slam')
    ) {
      return 'compound';
    }
    return 'isolation';
  }

  if (pool === 'forearms') {
    if (
      n.includes('farmer') || 
      n.includes('dead hang') || 
      n.includes('pull-up') || 
      n.includes('pullup') || 
      n.includes('carry')
    ) {
      return 'compound';
    }
    return 'isolation';
  }
  
  return 'isolation';
}

export const EXERCISE_YOUTUBE_MAP: Record<string, string> = {
  "Ab Crunches": "NnVhqMQRvmM",
  "Ab Machine": "CQjoA8KC4Dw",
  "Ab Wheel Rollouts": "SBO5aFR09D4",
  "Alternate Heel Taps": "L1uY38FyxNU",
  "Archer Push Ups": "MxVbNel13Ek",
  "Arnold Press": "jeJttN2EWCo",
  "Assisted Pull Ups": "wFj808u2HWU",
  "Back Hyperextensions": "8rXdAAwm8Rs",
  "Band Bicep Curls": "20xtfGZ37nw",
  "Band Chest Press": "T0UJ0W-_yIE",
  "Band Glute Kickbacks": "CZvQm1vNzD0",
  "Band Pull-Aparts": "SuvO4TBwSu4",
  "Barbell Back Squat": "rrJIyZGlK8c",
  "Barbell Bench Press": "CjHIKDQ4RQo",
  "Barbell Bent Over Row": "FsK19s8eGFs",
  "Barbell Bicep Curl": "N5x5M1x1Gd0",
  "Barbell Deadlifts": "GxsLrTzyGUU",
  "Barbell Front Raise": "Ofo2DQdT7DA",
  "Barbell Incline Bench Press": "2jFFCy8JBU8",
  "Battle Rope Alternating Waves": "z4ySEjuaYh8",
  "Battle Rope Double Waves": "uyaANzMXQHY",
  "Battle Rope Outside Circles": "LcvzYXQZniY",
  "Battle Rope Slams": "FInbOExDeU0",
  "Bayesian Curls": "_Z8Afknw_Fc",
  "Bayesian Tricep Extension": "https://www.tiktok.com/@bio_fit_anatomy/video/7515485715401133342",
  "Bayesian Tricep": "https://www.tiktok.com/@bio_fit_anatomy/video/7515485715401133342",
  "Bayesian Triceps": "https://www.tiktok.com/@bio_fit_anatomy/video/7515485715401133342",
  "Seated Leg Curl": "https://www.tiktok.com/@thewhitestchocolat/video/7615672180642188574",
  "Seated Leg Curls": "https://www.tiktok.com/@thewhitestchocolat/video/7615672180642188574",
  "Behind-the-Back Wrist Curls": "Cj9RNAYD7iY",
  "Cable Wrist Curls": "Avvmae4hIMA",
  "Reverse Cable Wrist Curls": "https://www.tiktok.com/@ibrku/video/7488062439058115848",
  "Bicycle Crunches": "wnuLak2onoA",
  "Bird Dog": "ZdAHe9_HeEw",
  "Bosu Ball Dome Squats": "zzPWFjL6WZE",
  "Bosu Ball Mountain Climbers": "TMjDM4sZIBk",
  "Bosu Ball Plank": "VNIeygoUJaU",
  "Bosu Ball Side Plank": "qr2hGUnBKb0",
  "Box Decline Pushups": "QBlYp-EwHlo",
  "Box Jumps": "k7dmYdknbac",
  "Bulgarian Split Squats": "TEXl2b3__S4",
  "Cable Bicep Curls": "GNlopToAZyg",
  "Cable Crunches": "ToJeyhydUxU",
  "Cable Flyes": "QcTcWpkn_bw",
  "Cable Lateral Raise": "Z5FA9aq3L6A",
  "Cable Upright Row": "WNz7O59GORA",
  "Assisted Chest Dips": "2HYAeF6o7Bc",
  "Close Grip Bench Press": "DzA2xZhDGeo",
  "Close Grip Lat Pulldown": "IjoFCmLX7z0",
  "Concentration Curls": "llD6MImgqe8",
  "Conventional Deadlift": "GxsLrTzyGUU",
  "Crossbody Hammer Curls": "qmQkt1Y-FX8",
  "Deadbug": "ZSYRZKYOf28",
  "Decline Dumbbell Bench Press": "4R_GwRhG0rY",
  "Diverging Seated Row": "cdurJOr2jwQ",
  "Decline Dumbbell Fly": "IMALXhhHRKM",
  "Decline Push Ups": "dcV-ATSeryA",
  "Dumbbell Bench Press": "AduT4Eq-iP0",
  "Dumbbell Bent Over Row": "6gvmcqr226U",
  "Dumbbell Bicep Curls": "MtXdEcW3Eog",
  "Dumbbell Preacher Curls": "oHHNXMLvs1c",
  "Dumbbell Chest Fly": "Nhvz9EzdJ4U",
  "Dumbbell Floor Fly": "oQYjzNukkTY",
  "Dumbbell Lateral Raise": "z-kOn7flIZg",
  "Dumbbell Shoulder Press": "aI2hGzsAMXs",
  "EZ Bar Skull Crushers": "zR9gty7LUxE",
  "Face Pulls": "0Po47vvj9g4",
  "Farmer's Hand Walk Carry": "8OtwXwrJizk",
  "Flutter Kicks": "aZvT-UCo5lg",
  "Goblet Squat": "zBV3ceGyAxw",
  "Good Mornings": "7cpldMZjLOs",
  "Hack Squat": "scs5XcsZuc8",
  "Hammer Curls": "B4RznoFvTl4",
  "Hammer Preacher Curls": "oHbSWPo3swM",
  "Hanging Leg Raises": "Yrtvs-nEnk0",
  "Hex Bar Deadlift": "ZJPZQklCSLs",
  "High to Low Cable Flys": "hhruLxo9yZU",
  "Hip Abductor": "G_8LItOiZ0Q",
  "Hip Adductor": "CjAVezAggkI",
  "Incline Dumbbell Chest Fly": "JSDpq14vCZ8",
  "Incline Dumbbell Chest Press": "oZVCBM9f8Eo",
  "Incline Dumbbell Curls": "XVQBeug_9LU",
  "Incline Push Ups": "cfns5VDVVvk",
  "Incline Row (Chest Supported)": "Nx0TzjgsI-0",
  "Inverted Row": "0AsxBmXeOIo",
  "Jefferson Curls": "1dGnvWcwnR8",
  "Kettlebell Clean & Press": "eaQPi0LDoE0",
  "Kettlebell Goblet Squat": "zBV3ceGyAxw",
  "Kettlebell Swing": "6A0yJetx7hg",
  "Kettlebell Turkish Get-Up": "sgd8n917Zv0",
  "Lat Pulldowns": "JGeRYIZdojU",
  "Lateral Box Jumps": "bNHwR90FO0I",
  "Leg Extensions": "4ZDm5EbiFI8",
  "Low to High Cable Flys": "RjmR5IRNXmI",
  "Low to High Cable Row": "QelgBRgIsjY",
  "Lunges": "mAgbXQdd4LM",
  "Lying Hamstring Curl": "QjNFk4F5dAs",
  "Lying Leg Raises": "xJJu-WiROM8",
  "Machine Bicep Curl": "203zWtqJLMg",
  "Machine Chest Press": "sqNwDkUU_Ps",
  "Machine Fly": "eGjt4lk6g34",
  "Machine Incline Press": "sqNwDkUU_Ps",
  "Machine Row": "TeFo51Q_Nsc",
  "Machine Triceps Extension": "NNyuuN2sJb0",
  "Military Press": "43GSKivZnw4",
  "Overhead Ball Slam": "DMrxbUgoZTg",
  "Overhead Press": "-5MmFTKLC-0",
  "Overhead Tricep Extension": "9wxRhONFsRA",
  "Passive Dead Hang": "0Bx_Ap7-EwU",
  "Pendlay Row": "h4nkoayPFWw",
  "Plank": "q4rDeHYMcIg",
  "Plate Front Raise": "HN8HYJTOl8c",
  "Plate Ground to Overhead": "wkexXjIhnzQ",
  "Plate Halo": "jkc_qGAc5fE",
  "Plate Loaded Row": "XHcqJ4mNkh8",
  "Plate Overhead Lunge": "nZYZKQBEdm8",
  "Plate Pinch Carry": "jFTV3DQf3HE",
  "Preacher Curls": "Zbs3ko8ycyg",
  "Pull Ups": "PHdHnZcbsB8",
  "Pull-up Hold": "PtxPHXIcHo0",
  "Push Ups": "Env8gAr_QnE",
  "Rack Pulls": "9vYBWV5OeKg",
  "Rear Delt Flyes": "nlkF7_2O_Lw",
  "Reverse Barbell Curls": "2MnC2_WJKkA",
  "Reverse Crunches": "XY8KzdDcMFg",
  "Reverse Hyperextensions": "NAPMNd9RRxM",
  "Reverse Dumbbell Wrist Curls": "_tcLwn78rSw",
  "Romanian Deadlift": "zU-f6DMCdAI",
  "Russian Twists": "99T1EfpMwPA",
  "Seated Cable Fly": "x4JX_T5QAMM",
  "Seated Cable Row": "lJoozxC0Rns",
  "Seated Calf Raises": "BxfKOyI8sUg",
  "Seated Chest Press": "JsQd_KYl4w8",
  "Seated Leg Press": "p5dCqF7wWUw",
  "Shoulder Press Machine": "TnhIyp4kmO8",
  "Side Plank": "Oe9Tp9SvTCE",
  "Single Arm Bent Over Row": "ZRSGpBUVcNw",
  "Single Arm Cable Row": "YQlEqGP-7kc",
  "Single Arm Chest Fly": "E_mT1JWOp90",
  "Single Arm Chest Press": "u3dhC-FcRXc",
  "Single Arm Lat Pulldowns": "LPahgWM7eUU",
  "Sit Ups": "N7hf1_vcX5w",
  "Skull Crushers": "sDxcKjCqXAo",
  "Slam Ball Bear Hug Squat": "JzL0DPrNRhc",
  "Slam Ball Chest Pass": "LS75csmzdAE",
  "Slam Ball Russian Twist": "sBO5wQ2rE9U",
  "Sled Drag": "6xTrOgOkOG0",
  "Sled Row": "jHT2AAFpCwQ",
  "Spider Curls": "ivS3G35bapw",
  "Standing Calf Raises": "baEXLy09Ncc",
  "Step-Ups": "DxUNi119Qzs",
  "Straight Arm Lat Pulldowns": "ey9Fv3FGrRg",
  "Sumo Deadlift": "JbY72Him34Q",
  "Supermans": "kTMBsUwEGPM",
  "T Bar Row": "hYo72r8Ivso",
  "Towel Grip Pull-ups": "5e_ZbBDu-G8",
  "TRX Chest Fly": "1_NPa2gd28w",
  "TRX Pistol Squat": "sTtgBOMgAuE",
  "TRX Pushup": "OlUqeytSoxE",
  "TRX Suspension Row": "yCuSGoe1gjY",
  "Assisted Tricep Dips": "LH9iZNaO7oU",
  "Tricep Dip Machine": "QYktfOJRyfU",
  "Tricep Push Ups": "kZi0j-7rDe8",
  "Tricep Pushdowns": "LXkCrxn3caQ",
  "Single Arm - Tricep Pulldown": "9qupVR7pKtk",
  "Tricep Pulldown": "8_5YkuU38s4",
  "V Sit-Ups": "cSCyyfBti7U",
  "Weighted Chest Dips": "ZDOrGNvRdM0",
  "Weighted Tricep Dips": "Gz8NkGoNPkc",
  "Weighted Sled Pull": "BSJIKV7h5po",
  "Weighted Sled Push": "QwscR2BhdEg",
  "Dumbbell Wrist Curls": "3VLTzIrnb5g",
  "Wide Grip Lat Pulldowns": "7JnP8dFbS14",
  "Wood Chops (Mid)": "iWxTGXIViro",
  "Wood Chops (H2L)": "gcGNypjIQDo",
  "Wood Chops (L2H)": "mvvu8imyMFs",
  "Single Arm Overhead Tricep Extension": "https://www.youtube.com/watch?v=pLtjQNIKy40",
  "Single Arm Overhead Tricep Extensions": "https://www.youtube.com/watch?v=pLtjQNIKy40",
  "Single Arm Tricep Pushdown": "https://www.youtube.com/shorts/CsUQLMngO7w",
  "Single Arm Tricep Pushdowns": "https://www.youtube.com/shorts/CsUQLMngO7w",
  "Preacher Curl Machine": "https://www.youtube.com/shorts/S4dDLfp3e8w",
  "Machine Preacher Curl": "https://www.youtube.com/shorts/S4dDLfp3e8w",
  "Hip Thrust Machine": "https://www.youtube.com/watch?v=xzR8Pq_iaz4",
  "Machine Hip Thrust": "https://www.youtube.com/watch?v=xzR8Pq_iaz4"
};

const extractYoutubeIdFromUrlOrVal = (val: string): string => {
  if (!val) return "";
  if (val.length === 11 && !val.includes("/") && !val.includes(".")) return val;
  const match = val.match(/(?:v=|shorts\/|embed\/|youtu\.be\/|\/v\/)([^#&?]{11})/);
  return match ? match[1] : (val.startsWith("http") ? "" : val);
};

export const POOLS: Record<string, Exercise[]> = Object.keys(RAW_POOLS).reduce((acc, key) => {
  acc[key] = RAW_POOLS[key].map(ex => {
    const val = EXERCISE_YOUTUBE_MAP[ex.name] || "";
    const isUrl = val.startsWith("http://") || val.startsWith("https://");
    const youtubeId = extractYoutubeIdFromUrlOrVal(val);
    const youtubeUrl = isUrl 
      ? val 
      : (youtubeId 
          ? `https://www.youtube.com/watch?v=${youtubeId}` 
          : `https://www.youtube.com/results?search_query=${encodeURIComponent("PureGym " + ex.name + " how to")}`);
    return {
      ...ex,
      youtubeId,
      youtubeUrl,
      category: getExerciseCategory(ex.name, ex.pool)
    };
  });
  return acc;
}, {} as Record<string, Exercise[]>);

export const CARDIO_EXERCISES_NAMES = new Set([
  "treadmill hike",
  "hiit rowing",
  "elliptical interval sprint",
  "stairmaster climb",
  "jump rope sessions",
  "stationary cycling",
  "assault bike sprint",
  "burpee cardio intervals",
  "high-knee sprints",
  "mountain climbers"
]);

export const isCardioExercise = (exerciseName: string, pool?: string): boolean => {
  if (pool === "cardio") return true;
  if (!exerciseName) return false;
  const norm = exerciseName.toLowerCase().trim();
  
  if (CARDIO_EXERCISES_NAMES.has(norm)) return true;
  
  // Explicitly protect strength row & pull exercises (Cable Row, Seated Row, Barbell Row, etc.)
  if (norm.includes("row") && !norm.includes("hiit rowing")) {
    return false;
  }
  
  if (
    norm.includes("treadmill") ||
    norm.includes("stairmaster") ||
    norm.includes("elliptical") ||
    norm.includes("assault bike") ||
    norm.includes("burpee cardio") ||
    norm.includes("high-knee") ||
    norm.includes("jump rope") ||
    norm.includes("stationary cycling")
  ) {
    return true;
  }
  
  return false;
};

export const getSecondaryMusclesForExercise = (ex: Exercise): string[] => {
  if (ex.secondaryMuscles && ex.secondaryMuscles.length > 0) {
    return ex.secondaryMuscles;
  }
  
  const nameLower = (ex.name || "").toLowerCase();
  const poolLower = (ex.pool || "").toLowerCase();

  // Handcrafted specific rules as well as fallback mapping
  if (nameLower.includes("bench press") || nameLower.includes("chest press") || nameLower.includes("push up") || nameLower.includes("dips")) {
    return ["Triceps", "Shoulders"];
  }
  if (nameLower.includes("fly") || nameLower.includes("cable crossover")) {
    return ["Shoulders"];
  }
  if (nameLower.includes("squat") || nameLower.includes("leg press")) {
    return ["Glutes", "Hamstrings", "Calves", "Core"];
  }
  if (nameLower.includes("deadlift") || nameLower.includes("romanian")) {
    return ["Glutes", "Hamstrings", "Lower Back", "Forearms", "Core"];
  }
  if (nameLower.includes("lat pulldown") || nameLower.includes("row") || nameLower.includes("pull up") || nameLower.includes("chin up")) {
    return ["Biceps", "Forearms", "Rear Delts", "Upper Back"];
  }
  if (nameLower.includes("overhead press") || nameLower.includes("shoulder press") || nameLower.includes("military press")) {
    return ["Triceps", "Upper Chest", "Core"];
  }
  if (nameLower.includes("hip thrust")) {
    return ["Glutes", "Hamstrings", "Core"];
  }
  if (nameLower.includes("hip abductor") || nameLower.includes("hip abduction")) {
    return ["Glutes", "Outer Thighs"];
  }
  if (nameLower.includes("hip adductor") || nameLower.includes("hip adduction")) {
    return ["Inner Thighs", "Glutes"];
  }

  // General fallback mappings by pool
  if (poolLower.includes("chest")) return ["Triceps", "Shoulders"];
  if (poolLower.includes("back") || poolLower === "lats" || poolLower === "rhomboids_traps" || poolLower === "erector_spinae") {
    return ["Biceps", "Forearms", "Rear Delts"];
  }
  if (poolLower.includes("biceps") || poolLower === "brachialis" || poolLower === "forearms") {
    return ["Forearms"];
  }
  if (poolLower.includes("triceps")) return ["Chest", "Shoulders"];
  if (poolLower.includes("delts") || poolLower === "shoulders") return ["Triceps", "Core"];
  if (poolLower === "quads" || poolLower === "legs") return ["Glutes", "Hamstrings", "Core"];
  if (poolLower === "hamstrings") return ["Glutes", "Lower Back"];
  if (poolLower === "calves") return ["Ankles"];
  if (poolLower.includes("core") || poolLower === "obliques") return ["Lower Back"];
  
  return [];
};


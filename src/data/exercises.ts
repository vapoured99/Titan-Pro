export interface Exercise {
  name: string;
  icon: string;
  pool: 'chest' | 'back' | 'shoulders' | 'legs' | 'biceps' | 'triceps' | 'core';
  instructions?: string[];
  muscleGroup?: 'chest' | 'back' | 'shoulders' | 'quads' | 'hamstrings' | 'calves' | 'glutes' | 'biceps' | 'triceps' | 'core';
  legRegion?: 'upper' | 'lower';
  category?: 'compound' | 'isolation';
}

const RAW_POOLS: Record<string, Omit<Exercise, 'category'>[]> = {
  chest: [
    { 
      name: "Archer Push Ups", 
      icon: "Activity", 
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Lie flat on a bench with your feet firmly planted on the floor.",
        "Grip the barbell with hands slightly wider than shoulder-width apart.",
        "Lower the bar slowly to your mid-chest while keeping your elbows at a 45-degree angle.",
        "Press the bar back up until your arms are fully extended.",
        "Avoid arching your back excessively and maintain control throughout."
      ]
    },
    { 
      name: "Barbell Incline Bench Press", 
      icon: "ArrowUp", 
      pool: "chest",
      instructions: [
        "Set the bench to a 30-45 degree incline.",
        "Lie on the bench and grip the barbell with hands slightly wider than shoulder-width.",
        "Lower the bar to your upper chest in a controlled motion.",
        "Press the bar back up until your arms are fully extended.",
        "Ensure your feet remain flat on the floor throughout the lift."
      ]
    },
    { 
      name: "Cable Flyes", 
      icon: "ArrowLeftRight", 
      pool: "chest",
      instructions: [
        "Set the pulleys to chest height and attach D-handles.",
        "Stand in the center, grasp handles, and step forward into a staggered stance.",
        "Bring the handles together in front of you in a wide arc, squeezing your chest.",
        "Slowly return your arms to the sides in a controlled arc.",
        "Maintain a slight bend in your elbows throughout the movement."
      ]
    },
    { 
      name: "Chest Dips", 
      icon: "ArrowDown", 
      pool: "chest",
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
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Lie on a decline bench with your feet secured.",
        "Hold dumbbells above your chest with a slight bend in your elbows.",
        "Lower the weights in a wide arc until you feel a stretch in your chest.",
        "Bring the weights back together over your lower chest.",
        "Maintain a consistent elbow angle throughout."
      ]
    },
    { 
      name: "Decline Push Ups", 
      icon: "ArrowDown", 
      pool: "chest",
      instructions: [
        "Place your feet on a bench or elevated surface and hands on the floor.",
        "Position your hands slightly wider than shoulder-width apart.",
        "Lower your chest toward the floor while keeping your body in a straight line.",
        "Push back up to the starting position.",
        "This variant focuses more on the upper chest and shoulders."
      ]
    },
    { 
      name: "Dumbbell Bench Press", 
      icon: "Dumbbell", 
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Lie on a flat bench with a dumbbell in each hand, arms extended above your chest.",
        "Keep a slight bend in your elbows and lower your arms out to the sides in a wide arc.",
        "Stop when you feel a stretch in your chest, but before your elbows go below the bench line.",
        "Use your chest muscles to pull the dumbbells back to the starting position.",
        "Maintain the same elbow angle throughout the entire movement."
      ]
    },
    { 
      name: "Incline Dumbbell Chest Fly", 
      icon: "ArrowUp", 
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Sit on an incline bench and hold dumbbells at shoulder height.",
        "Press the weights up until your arms are fully extended over your upper chest.",
        "Lower the dumbbells slowly back to the starting position.",
        "Keep your elbows at a 45-degree angle to your body.",
        "Maintain a steady and controlled tempo."
      ]
    },
    { 
      name: "Incline Push Ups", 
      icon: "ArrowUp", 
      pool: "chest",
      instructions: [
        "Place your hands on a bench or elevated surface and feet on the floor.",
        "Position your hands slightly wider than shoulder-width.",
        "Lower your chest toward the bench while keeping your body straight.",
        "Push back up to the starting position.",
        "This variant is easier than standard push-ups and targets the lower chest."
      ]
    },
    { 
      name: "Machine Fly", 
      icon: "ArrowLeftRight", 
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Adjust the seat so the handles are at mid-chest height.",
        "Sit back and grip the handles firmly.",
        "Push the handles forward until your arms are extended.",
        "Slowly return to the starting position under control.",
        "Keep your shoulders back and chest out throughout."
      ]
    },
    { 
      name: "Machine Incline Press", 
      icon: "ArrowUp", 
      pool: "chest",
      instructions: [
        "Sit in the incline press machine and adjust the seat height.",
        "Grip the handles and push them upward along the machine's path.",
        "Extend your arms fully without locking your elbows.",
        "Lower the handles back to the starting position slowly.",
        "Targets the upper chest with added stability."
      ]
    },
    { 
      name: "Push Ups", 
      icon: "Activity", 
      pool: "chest",
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
      pool: "chest",
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
      pool: "chest",
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
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Lie on a bench or stand at a cable machine.",
        "Perform a fly motion with a single arm, moving in a wide arc.",
        "Focus on the isolation of the chest muscle.",
        "Stabilize your body to prevent swinging or rotating.",
        "Slowly return to the starting position."
      ]
    },
    { 
      name: "Weighted Chest Dips", 
      icon: "Plus", 
      pool: "chest",
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
      pool: "chest",
      instructions: [
        "Position the cable pulleys at the highest setting.",
        "Stand in the middle and pull the handles down and inward toward your waist.",
        "Cross your hands slightly at the bottom for extra contraction.",
        "Slowly bring the handles back up to the starting position.",
        "Targets the lower portion of the chest."
      ]
    },
    { 
      name: "Low to High Cable Flys", 
      icon: "ArrowUp", 
      pool: "chest",
      instructions: [
        "Position the cable pulleys at the lowest setting.",
        "Stand in the middle and pull the handles up and inward toward your chest.",
        "Bring your hands together at roughly shoulder height.",
        "Slowly lower the handles back to the starting position.",
        "Targets the upper portion of the chest."
      ]
    }
  ],
  back: [
    { 
      name: "Barbell Bent Over Row", 
      icon: "ArrowLeftRight", 
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
      instructions: [
        "Stand over a barbell with feet shoulder-width apart.",
        "Hinge forward until your torso is parallel to the floor.",
        "Grip the bar and pull it explosively toward your lower chest.",
        "Return the bar to the floor after each rep.",
        "Maintain a flat back and avoid using momentum from your legs."
      ]
    },
    { 
      name: "Rack Pulls", 
      icon: "ArrowUp", 
      pool: "back",
      instructions: [
        "Set a barbell on the safety pins of a power rack at or just below knee height.",
        "Grip the bar with hands shoulder-width apart and a flat back.",
        "Pull the bar up by extending your hips and knees to a standing position.",
        "Squeeze your back and glutes at the top.",
        "Slowly lower the bar back to the pins."
      ]
    },
    { 
      name: "Seated Cable Row", 
      icon: "ArrowLeftRight", 
      pool: "back",
      instructions: [
        "Sit at the rowing machine with your feet on the platforms and a slight bend in your knees.",
        "Grip the handle and sit upright with a neutral spine and shoulders back.",
        "Pull the handle toward your abdomen by driving your elbows back and squeezing your shoulder blades.",
        "Avoid leaning back excessively; keep your core engaged and torso stable.",
        "Slowly extend your arms back to the starting position without letting your shoulders round forward."
      ]
    },
    { 
      name: "Single Arm Bent Over Row", 
      icon: "ArrowLeftRight", 
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
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
      pool: "back",
      instructions: [
        "Select an appropriate counterweight on the machine and step onto the platform or place your knees/feet on the padded bar.",
        "Grasp the overhead handles with an overhand grip, hands slightly wider than shoulder-width apart.",
        "Slowly lower your body until your arms are fully extended, allowing the machine to support your weight.",
        "Pull yourself up by driving your elbows down, keeping your chest tall and core engaged.",
        "Slowly lower yourself back down to the starting position under control."
      ]
    }
  ],
  shoulders: [
    { 
      name: "Arnold Press", 
      icon: "ArrowUpCircle", 
      pool: "shoulders",
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
      pool: "shoulders",
      instructions: [
        "Stand with feet shoulder-width apart, holding a barbell in front of your thighs.",
        "With a slight bend in the elbows, lift the bar to shoulder height.",
        "Lower the bar slowly back to the starting position.",
        "Avoid using momentum or swinging your body.",
        "Focus on isolating the front deltoids."
      ]
    },
    { 
      name: "Cable Lateral Raise", 
      icon: "ArrowLeftRight", 
      pool: "shoulders",
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
      pool: "shoulders",
      instructions: [
        "Stand tall with a dumbbell in each hand, palms facing your body.",
        "With a slight bend in your elbows, raise the weights out to the sides until they are at shoulder height.",
        "Keep your torso still; do not swing the weights.",
        "Lower the dumbbells back down slowly to your sides.",
        "Focus on leading with your elbows to maximize shoulder engagement."
      ]
    },
    { 
      name: "Dumbbell Shoulder Press", 
      icon: "ArrowUpCircle", 
      pool: "shoulders",
      instructions: [
        "Sit on a bench with back support or stand tall, holding a dumbbell in each hand at shoulder height.",
        "Position your elbows out to the sides with palms facing forward.",
        "Press the dumbbells overhead until your arms are fully extended.",
        "Avoid letting the dumbbells touch at the top and keep your core braced.",
        "Lower the weights back to shoulder height with control."
      ]
    },
    { 
      name: "Face Pulls", 
      icon: "ArrowLeftRight", 
      pool: "shoulders",
      instructions: [
        "Set the cable machine to upper-chest height with a rope attachment.",
        "Hold the rope with an overhand grip, thumbs facing you.",
        "Pull the rope toward your face while pulling the ends apart, leading with your elbows.",
        "Squeeze your rear deltoids and upper back at the peak of the movement.",
        "Slowly return to the starting position, keeping tension on the cable."
      ]
    },
    { 
      name: "Military Press", 
      icon: "ArrowUpCircle", 
      pool: "shoulders",
      instructions: [
        "Stand with feet shoulder-width apart and grip a barbell with hands slightly wider than shoulders.",
        "Hold the bar at upper-chest level with elbows tucked forward.",
        "Press the bar overhead until your arms are fully locked out, keeping your core tight.",
        "Push your head forward slightly at the top to allow the bar to travel in a straight line.",
        "Slowly lower the bar back to your upper chest."
      ]
    },
    { 
      name: "Rear Delt Flyes", 
      icon: "ArrowLeftRight", 
      pool: "shoulders",
      instructions: [
        "Sit on the edge of a bench and lean forward, or stand and hinge at the hips.",
        "Hold dumbbells with palms facing each other and arms hanging down.",
        "Raise the weights out to the sides, focusing on the rear deltoids.",
        "Squeeze at the top and lower the weights slowly.",
        "Avoid using your traps; keep the movement in the shoulders."
      ]
    },
    { 
      name: "Shoulder Press Machine", 
      icon: "ArrowUpCircle", 
      pool: "shoulders",
      instructions: [
        "Sit in the machine and adjust the seat height.",
        "Grip the handles and press them upward until your arms are extended.",
        "Lower the handles slowly back to shoulder height.",
        "Ensure your back remains pressed against the seat pad.",
        "Focus on driving with your shoulders rather than your triceps."
      ]
    },
    { 
      name: "Machine Shoulder Press", 
      icon: "ArrowUpCircle", 
      pool: "shoulders",
      instructions: [
        "Another variant of the machine shoulder press, often with a different grip.",
        "Follow the same pressing motion as the standard machine press.",
        "Adjust the weight to a challenging but manageable level.",
        "Maintain a steady tempo for both the lift and the lower.",
        "Focus on the contraction of the deltoids."
      ]
    }
  ],
  legs: [
    { 
      name: "Barbell Back Squat", 
      icon: "ArrowDown", 
      pool: "legs",
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
      pool: "legs",
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
      name: "Conventional Deadlift", 
      icon: "ArrowUp", 
      pool: "legs",
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
      name: "Goblet Squat", 
      icon: "ArrowDown", 
      pool: "legs",
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
      pool: "legs",
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
      pool: "legs",
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
      pool: "legs",
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
      name: "Lying Hamstring Curl", 
      icon: "ArrowDown", 
      pool: "legs",
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
      pool: "legs",
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
      name: "Seated Leg Press", 
      icon: "ArrowDown", 
      pool: "legs",
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
      name: "Sumo Deadlift", 
      icon: "ArrowUp", 
      pool: "legs",
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
      name: "Standing Calf Raises", 
      icon: "ArrowUp", 
      pool: "legs",
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
      pool: "legs",
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
  biceps: [
    { 
      name: "Barbell Bicep Curl", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
      instructions: [
        "Stand with feet shoulder-width apart, holding a barbell with an underhand grip.",
        "Keep your elbows tucked into your sides and your torso stationary.",
        "Curl the bar toward your shoulders by contracting your biceps.",
        "Squeeze at the top, then slowly lower the bar back to the starting position.",
        "Avoid using momentum or swinging your body to lift the weight."
      ]
    },
    { 
      name: "Cable Bicep Curls", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
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
      pool: "biceps",
      instructions: [
        "Sit on a bench with your legs spread and lean forward.",
        "Hold a dumbbell in one hand and rest your elbow against your inner thigh.",
        "Curl the dumbbell toward your shoulder, focusing on the bicep peak.",
        "Lower the weight slowly under control.",
        "Finish all reps on one arm before switching."
      ]
    },
    { 
      name: "Dumbbell Bicep Curls", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
      instructions: [
        "Stand with a dumbbell in each hand, arms fully extended at your sides.",
        "Keep your elbows tucked close to your torso and palms facing forward.",
        "Curl the weights toward your shoulders while contracting your biceps.",
        "Hold the contraction shortly at the top.",
        "Lower the dumbbells back to the starting position with a controlled tempo."
      ]
    },
    { 
      name: "Hammer Curls", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
      instructions: [
        "Stand with a dumbbell in each hand, palms facing your torso.",
        "Curl the weights toward your shoulders while maintaining the neutral grip.",
        "Squeeze your biceps and brachialis at the top.",
        "Lower the dumbbells slowly to the starting position.",
        "Excellent for building thickness in the arms."
      ]
    },
    { 
      name: "Preacher Curls", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
      instructions: [
        "Sit at a preacher bench and rest your upper arms on the pad.",
        "Hold a barbell or EZ bar with an underhand grip.",
        "Curl the bar toward your chin while keeping your arms on the pad.",
        "Lower the bar slowly until your arms are fully extended.",
        "Focus on isolating the biceps without using momentum."
      ]
    },
    { 
      name: "Spider Curls", 
      icon: "ArrowUpCircle", 
      pool: "biceps",
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
      pool: "biceps",
      instructions: [
        "Sit in the machine and adjust the seat so your elbows align with the pivot point.",
        "Grip the handles and curl them toward your shoulders.",
        "Control the weight as you return to the starting position.",
        "Maintain a steady tempo throughout the exercise.",
        "Provides constant tension and stability for bicep isolation."
      ]
    },
    {
      name: "Incline Dumbbell Curls",
      icon: "Dumbbell",
      pool: "biceps",
      instructions: [
        "Sit on an incline bench set to a 45-degree angle, holding a dumbbell in each hand with arms hanging straight down, palms facing forward.",
        "Keep your elbows tucked close to your torso as you slowly curl the weights up toward your shoulders.",
        "Squeeze your biceps at the peak of the contraction, keeping your shoulders static.",
        "Slowly lower the dumbbells back to the starting position, maintaining control and a full stretch.",
        "Avoid swinging your arms or lifting your elbows forward during the movement."
      ]
    }
  ],
  triceps: [
    { 
      name: "Close Grip Bench Press", 
      icon: "Dumbbell", 
      pool: "triceps",
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
      pool: "triceps",
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
      pool: "triceps",
      instructions: [
        "Sit in the machine and place your elbows on the pads.",
        "Grip the handles and extend your arms fully.",
        "Squeeze the triceps at the peak of the extension.",
        "Slowly return to the starting position under control.",
        "Adjust the seat so your elbows are in a comfortable position."
      ]
    },
    { 
      name: "Overhead Tricep Extension", 
      icon: "ArrowUpCircle", 
      pool: "triceps",
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
      pool: "triceps",
      instructions: [
        "Lie on a flat bench holding an EZ bar or dumbbells with arms extended straight up.",
        "Keeping your upper arms stationary, bend your elbows to lower the weight toward your forehead.",
        "Stop just before the weight touches your head, then press back up using your triceps.",
        "Keep your elbows tucked in and avoid letting them flare out to the sides.",
        "Maintain a slow and controlled tempo throughout."
      ]
    },
    { 
      name: "Tricep Dips", 
      icon: "ArrowDown", 
      pool: "triceps",
      instructions: [
        "Grip the parallel bars and lift yourself up with locked elbows.",
        "Lower your body by bending your elbows until they are at 90 degrees.",
        "Push yourself back up to the starting position.",
        "Keep your torso upright to maximize tricep engagement.",
        "Avoid flaring your elbows; keep them tucked close to your body."
      ]
    },
    { 
      name: "Tricep Pushdowns", 
      icon: "ArrowDown", 
      pool: "triceps",
      instructions: [
        "Stand facing the cable machine with a straight bar or rope attachment at chest height.",
        "Grip the attachment with an overhand grip, elbows tucked into your sides.",
        "Push the bar down until your arms are fully extended at your sides.",
        "Focus on using only your triceps to move the weight; keep your shoulders still.",
        "Slowly bring the bar back up to the starting position."
      ]
    },
    { 
      name: "Tricep Push Ups", 
      icon: "Activity", 
      pool: "triceps",
      instructions: [
        "Start in a plank position with hands directly under your shoulders.",
        "Keep your elbows tucked in close to your ribs as you lower your body.",
        "Press back up using your triceps.",
        "Maintain a straight line from head to heels.",
        "This variant focuses heavily on the triceps compared to a standard push-up."
      ]
    }
  ],
  core: [
    { 
      name: "Ab Crunches", 
      icon: "Activity", 
      pool: "core",
      muscleGroup: "core",
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
      pool: "core",
      muscleGroup: "core",
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
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Kneel on the floor and hold the ab wheel handles.",
        "Roll the wheel forward as far as you can while maintaining a flat back.",
        "Use your core to pull the wheel back to the starting position.",
        "Avoid letting your hips sag or your back arch.",
        "Progress slowly to increase the range of motion."
      ]
    },
    { 
      name: "Bicycle Crunches", 
      icon: "Activity", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Lie on your back and bring your knees to a 90-degree angle.",
        "Perform a crunch motion while alternating bringing opposite elbows to knees.",
        "Straighten the other leg out as you twist.",
        "Maintain a steady rhythm and keep your core engaged.",
        "Excellent for targeting the obliques and overall core stability."
      ]
    },
    { 
      name: "Cable Crunches", 
      icon: "ArrowDown", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Kneel in front of a cable machine with a rope attachment set high.",
        "Grasp the rope and pull it down until your hands are next to your head.",
        "Contract your abs to bring your elbows toward your knees.",
        "Squeeze your core at the bottom of the movement.",
        "Slowly return to the starting position while keeping tension on the cables."
      ]
    },
    { 
      name: "Hanging Leg Raises", 
      icon: "ArrowUp", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Hang from a pull-up bar with an overhand grip and arms fully extended.",
        "Keeping your legs straight or slightly bent, lift them until they are parallel to the floor.",
        "Focus on using your lower abs to pull your legs up, avoiding excessive swinging.",
        "Slowly lower your legs back to the starting position with control.",
        "To increase difficulty, bring your toes all the way to the bar."
      ]
    },
    { 
      name: "Plank", 
      icon: "Activity", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Place your forearms on the floor with elbows directly under your shoulders.",
        "Extend your legs behind you, resting on your toes.",
        "Keep your body in a straight line from head to heels.",
        "Engage your core and glutes to prevent your hips from sagging.",
        "Hold this position for the target duration while breathing steadily."
      ]
    },
    { 
      name: "Russian Twists", 
      icon: "RotateCw", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Sit on the floor with your knees bent and feet slightly elevated.",
        "Lean back slightly and hold your hands together in front of you.",
        "Rotate your torso from side to side, touching the floor on each side.",
        "Keep your back straight and core braced.",
        "Can be performed with a weight for added difficulty."
      ]
    },
    { 
      name: "Sit Ups", 
      icon: "Activity", 
      pool: "core",
      muscleGroup: "core",
      instructions: [
        "Lie on your back with knees bent and feet anchored or flat on the floor.",
        "Curl your torso all the way up until your chest is near your knees.",
        "Slowly lower yourself back to the starting position.",
        "Engage your abs throughout the entire range of motion.",
        "Maintain a controlled pace to maximize muscle engagement."
      ]
    }
  ]
};

export function getExerciseCategory(name: string, pool: string): 'compound' | 'isolation' {
  const n = name.toLowerCase();
  
  if (pool === 'chest') {
    if (n.includes('press') || n.includes('push up') || n.includes('pushup') || n.includes('dip')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'back') {
    if (n.includes('straight arm')) {
      return 'isolation';
    }
    return 'compound'; 
  }
  
  if (pool === 'shoulders') {
    if (n.includes('press') || n.includes('military')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'legs') {
    if (n.includes('squat') || n.includes('deadlift') || n.includes('lunge') || n.includes('press')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'biceps') {
    return 'isolation';
  }
  
  if (pool === 'triceps') {
    if (n.includes('bench press') || n.includes('dip') || n.includes('push up') || n.includes('pushup')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  if (pool === 'core') {
    if (n.includes('plank') || n.includes('wheel') || n.includes('hanging') || n.includes('sit up')) {
      return 'compound';
    }
    return 'isolation';
  }
  
  return 'isolation';
}

export const POOLS: Record<string, Exercise[]> = Object.keys(RAW_POOLS).reduce((acc, key) => {
  acc[key] = RAW_POOLS[key].map(ex => ({
    ...ex,
    category: getExerciseCategory(ex.name, ex.pool)
  }));
  return acc;
}, {} as Record<string, Exercise[]>);


import fs from 'fs';
import path from 'path';

const exerciseQueries: Record<string, string> = {
  // Chest
  "Archer Push Ups": "Archer Push Ups tutorial",
  "Barbell Bench Press": "How To Do A Barbell Bench Press Correctly PureGym",
  "Barbell Incline Bench Press": "How To Do A Barbell Incline Bench Press PureGym",
  "Cable Flyes": "How To Do Cable Flyes PureGym",
  "Chest Dips": "How To Do Chest Dips PureGym",
  "Decline Dumbbell Bench Press": "Decline Dumbbell Bench Press PureGym",
  "Decline Dumbbell Fly": "Decline Dumbbell Fly tutorial",
  "Decline Push Ups": "Decline Push Ups tutorial",
  "Dumbbell Bench Press": "How To Do A Dumbbell Bench Press PureGym",
  "Dumbbell Chest Fly": "How To Do Dumbbell Chest Fly PureGym",
  "Incline Dumbbell Chest Press": "How To Do An Incline Dumbbell Bench Press PureGym",
  "Incline Push Ups": "Incline Push Ups tutorial",
  "Machine Fly": "How To Do Machine Fly PureGym",
  "Machine Chest Press": "How To Use The Chest Press Machine PureGym",
  "Machine Incline Press": "Machine Incline Chest Press PureGym",
  "Push Ups": "How To Do A Push Up Correctly PureGym",
  "Seated Cable Fly": "Seated Cable Fly tutorial",
  "Seated Chest Press": "Seated Chest Press tutorial",
  "Single Arm Chest Press": "Single Arm Chest Press tutorial",
  "Single Arm Chest Fly": "Single Arm Chest Fly tutorial",
  "Weighted Chest Dips": "Weighted Dips tutorial",
  "High to Low Cable Flys": "High to Low Cable Fly PureGym",
  "Low to High Cable Flys": "Low to High Cable Fly PureGym",

  // Back
  "Assisted Pull Ups": "How To Do Assisted Pull Ups PureGym",
  "Barbell Bent Over Row": "How To Do A Barbell Bent Over Row PureGym",
  "Close Grip Lat Pulldown": "How To Do A Close Grip Lat Pulldown PureGym",
  "Dumbbell Bent Over Row": "How To Do A Dumbbell Bent Over Row PureGym",
  "Incline Row (Chest Supported)": "Incline Row Chest Supported PureGym",
  "Inverted Row": "How To Do Inverted Rows PureGym",
  "Lat Pulldowns": "How To Do Lat Pulldowns Correctly PureGym",
  "Pendlay Row": "How To Do Pendlay Rows tutorial",
  "Pull Ups": "How To Do Pull Ups Correctly PureGym",
  "Rack Pulls": "How To Do Rack Pulls Correctly PureGym",
  "Seated Cable Row": "How To Do A Seated Cable Row PureGym",
  "Single Arm Bent Over Row": "Single Arm Dumbbell Row PureGym",
  "Single Arm Lat Pulldowns": "Single Arm Lat Pulldown PureGym",
  "Straight Arm Lat Pulldowns": "How To Do Straight Arm Lat Pulldown PureGym",
  "T Bar Row": "How To Do T Bar Row PureGym",
  "Wide Grip Lat Pulldowns": "Wide Grip Lat Pulldown PureGym",
  "Machine Row": "How To Use The Seated Row Machine PureGym",

  // Shoulders
  "Arnold Press": "How To Do Arnold Press PureGym",
  "Barbell Front Raise": "Barbell Front Raise tutorial",
  "Cable Lateral Raise": "Cable Lateral Raise PureGym",
  "Dumbbell Lateral Raise": "How To Do Dumbbell Lateral Raises Correctly PureGym",
  "Dumbbell Shoulder Press": "How To Do Dumbbell Shoulder Press PureGym",
  "Face Pulls": "How To Do Face Pulls PureGym",
  "Military Press": "How To Do A Military Press PureGym",
  "Rear Delt Flyes": "How To Do Dumbbell Rear Delt Flyes PureGym",
  "Shoulder Press Machine": "How To Use The Shoulder Press Machine PureGym",
  "Machine Shoulder Press": "How To Use The Shoulder Press Machine PureGym",

  // Legs
  "Barbell Back Squat": "How To Do A Barbell Back Squat Correctly PureGym",
  "Bulgarian Split Squats": "How To Do Bulgarian Split Squats PureGym",
  "Conventional Deadlift": "How To Do A Conventional Deadlift PureGym",
  "Sumo Deadlift": "How To Do Sumo Deadlift PureGym",
  "Romanian Deadlift": "How To Do Romanian Deadlifts Correctly PureGym",
  "Goblet Squat": "How To Do Goblet Squats PureGym",
  "Hack Squat": "How To Do Hack Squat PureGym",
  "Leg Extensions": "How To Use The Leg Extension Machine PureGym",
  "Lunges": "How To Do Lunges Correctly PureGym",
  "Lying Hamstring Curl": "How To Use Lying Hamstring Curl Machine PureGym",
  "Seated Leg Press": "How To Use Leg Press Machine PureGym",
  "Standing Calf Raises": "Standing Calf Raise tutorial",
  "Seated Calf Raises": "Seated Calf Raise tutorial",

  // Biceps
  "Barbell Bicep Curl": "How To Do Barbell Bicep Curls Correctly PureGym",
  "Cable Bicep Curls": "How To Do Cable Bicep Curls PureGym",
  "Concentration Curls": "How To Do Concentration Curls PureGym",
  "Dumbbell Bicep Curls": "How To Do Dumbbell Bicep Curls Correctly PureGym",
  "Hammer Curls": "How To Do Hammer Curls Correctly PureGym",
  "Preacher Curls": "How To Do Preacher Curls PureGym",
  "Spider Curls": "Spider Curls tutorial",
  "Machine Bicep Curl": "Machine Bicep Curl PureGym",
  "Incline Dumbbell Curls": "How To Do Incline Dumbbell Curls PureGym",
  "Crossbody Hammer Curls": "Crossbody Hammer Curls tutorial",

  // Triceps
  "Close Grip Bench Press": "How To Do A Close Grip Barbell Bench Press PureGym",
  "Dumbbell Floor Fly": "Dumbbell Floor Fly tutorial",
  "Machine Triceps Extension": "Machine Triceps Extension tutorial",
  "Overhead Tricep Extension": "How To Do Overhead Tricep Extensions PureGym",
  "Skull Crushers": "How To Do Skull Crushers Correctly PureGym",
  "Tricep Dips": "Tricep Dips tutorial",
  "Tricep Pushdowns": "How To Do Tricep Pushdowns Correctly PureGym",
  "Tricep Push Ups": "Tricep Push Up tutorial",
  "EZ Bar Skull Crushers": "EZ Bar Skull Crushers tutorial",

  // Core
  "Plank": "How To Do A Plank Correctly PureGym",
  "Side Plank": "How To Do Side Plank Correctly PureGym",
  "Ab Crunches": "How To Do Ab Crunches Correctly PureGym",
  "Ab Machine": "How To Use The Ab Machine PureGym",
  "Bicycle Crunches": "How To Do Bicycle Crunches Correctly PureGym",
  "Hanging Leg Raises": "How To Do Hanging Leg Raises Correctly PureGym",
  "Lying Leg Raises": "How To Do Lying Leg Raises Correctly PureGym",
  "Russian Twists": "How To Do Russian Twists Correctly PureGym",
  "Sit Ups": "How To Do Sit Ups Correctly PureGym",

  // Cardio & Equipment
  "Kettlebell Swing": "How To Do Kettlebell Swings Correctly PureGym",
  "Kettlebell Goblet Squat": "Kettlebell Goblet Squat PureGym",
  "Kettlebell Clean & Press": "Kettlebell Clean & Press tutorial",
  "TRX Suspension Row": "TRX Suspension Row PureGym",
  "TRX Pushup": "TRX Pushup tutorial",
  "Battle Rope Double Waves": "Battle Rope Double Waves PureGym",
  "Battle Rope Alternating Waves": "Battle Rope Alternating Waves PureGym",
  "Battle Rope Slams": "Battle Rope Slams PureGym",
  "Box Jumps": "How To Do Box Jumps PureGym"
};

async function fetchYouTubeSearch(query: string): Promise<string> {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0'
      }
    });
    if (!res.ok) return '';
    const html = await res.text();
    const dataMatch = html.match(/var ytInitialData\s*=\s*({[\s\S]*?});<\/script>/);
    if (dataMatch) {
      const dataStr = dataMatch[1];
      const regex = /"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/g;
      let match;
      const seen = new Set();
      while ((match = regex.exec(dataStr)) !== null) {
        const id = match[1];
        if (seen.has(id)) continue;
        seen.add(id);
        
        const index = match.index;
        const slice = dataStr.substring(index, index + 1000);
        const textMatch = slice.match(/"text"\s*:\s*"([^"]+)"/);
        const title = textMatch ? textMatch[1].toLowerCase() : '';
        
        if (query.toLowerCase().includes('puregym')) {
          if (title.includes('puregym') || title.includes('pure gym') || title.includes('how to')) {
            return id;
          }
        } else {
          return id;
        }
      }
      const firstMatch = dataStr.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
      if (firstMatch) return firstMatch[1];
    }
  } catch (err) {}
  return '';
}

async function run() {
  const finalMap: Record<string, string> = {};
  const filePath = path.join(process.cwd(), 'resolved_videos.json');
  console.log('Target File Path:', filePath);
  
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      Object.assign(finalMap, data);
      console.log(`Loaded ${Object.keys(finalMap).length} pre-resolved videos from ${filePath}`);
    } catch (e) {
      console.error('Error reading JSON:', e);
    }
  }

  const entries = Object.entries(exerciseQueries);
  const toResolve = entries.filter(([name]) => !finalMap[name]);
  console.log(`Remaining to resolve: ${toResolve.length}`);
  
  const count = Math.min(10, toResolve.length);
  for (let i = 0; i < count; i++) {
    const [exName, query] = toResolve[i];
    console.log(`[${i+1}/${count}] Fetching for "${exName}"`);
    const id = await fetchYouTubeSearch(query);
    if (id) {
      finalMap[exName] = id;
      console.log(`   -> "${id}"`);
    } else {
      console.log(`   -> Not found`);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(finalMap, null, 2));
    await new Promise(r => setTimeout(r, 500));
  }
}

run();

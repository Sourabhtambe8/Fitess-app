import { WorkoutDay, UserProfile, PostureHabitItem } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Sourabh",
  age: 25,
  height: "5'4\"",
  weightKg: 60,
  targetWeightKg: 64,
  programWeek: 1,
  totalWeeks: 4,
};

export const DEFAULT_POSTURE_HABITS: PostureHabitItem[] = [
  { id: 'h1', title: 'Chin Tucks', count: '10 reps', detail: 'Gentle neck control, restore cervical alignment', isCompleted: false },
  { id: 'h2', title: 'Wall Slides', count: '10 reps', detail: 'Shoulder & scapular retraction against wall', isCompleted: false },
  { id: 'h3', title: 'Thoracic Extensions', count: '8 reps', detail: 'Upper-back mobility and chest opener', isCompleted: false },
  { id: 'h4', title: 'Glute Bridges', count: '10-12 reps', detail: 'Posterior chain activation and pelvic alignment', isCompleted: false },
  { id: 'h5', title: 'Relaxed Walk', count: '5-10 mins', detail: 'Decompress spine after prolonged sitting', isCompleted: false },
];

export const DEFAULT_WORKOUT_PLAN: WorkoutDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    dayOfWeek: 'Monday',
    code: 'DAY 01',
    title: 'Full Body Strength A + Posture',
    subtitle: 'Build Strength • Improve Posture • Joint Friendly',
    durationMinutes: '60–75 Mins',
    level: 'Beginner – Intermediate',
    goal: 'Muscle + Strength + Posture',
    warmup: [
      { id: 'w1-1', name: 'Brisk Walk / Light Jog', prescription: '3–5 Mins', tip: 'Elevate core body temperature smoothly' },
      { id: 'w1-2', name: 'Dynamic Arm Circles', prescription: '20 reps each', tip: 'Loosen rotator cuffs & shoulders' },
      { id: 'w1-3', name: 'Neck Mobility & Tilts', prescription: '10 reps each', tip: 'Relieve cervical spine tension' },
      { id: 'w1-4', name: 'Cat Cow', prescription: '10 reps', tip: 'Synchronize breath with spinal flexion & extension' },
      { id: 'w1-5', name: 'Hip Opener (Dynamic)', prescription: '10 reps each', tip: 'Open tight hip flexors from sitting' },
      { id: 'w1-6', name: 'Bodyweight Squats', prescription: '15 reps', tip: 'Groove knee and hip hinge mechanics' },
      { id: 'w1-7', name: 'Glute Bridges', prescription: '15 reps', tip: 'Wake up dormant glutes' },
    ],
    exercises: [
      {
        id: 'ex-1-1',
        name: 'Goblet Squat / Box Squat',
        category: 'Legs',
        targetSets: 3,
        targetReps: '8–10',
        defaultWeightKg: 14,
        restSeconds: 90,
        techniqueTip: 'Comfortable depth; keep chest upright and knees tracking with toes.',
        targetsMuscle: 'Quads, Glutes, Core'
      },
      {
        id: 'ex-1-2',
        name: 'Neutral-Grip Dumbbell Row',
        category: 'Back',
        targetSets: 3,
        targetReps: '10–12',
        defaultWeightKg: 12,
        restSeconds: 90,
        techniqueTip: 'Chest supported if possible; squeeze shoulder blades at peak contraction.',
        targetsMuscle: 'Lats, Rhomboids, Biceps'
      },
      {
        id: 'ex-1-3',
        name: 'Dumbbell Romanian Deadlift',
        category: 'Legs',
        targetSets: 3,
        targetReps: '8–10',
        defaultWeightKg: 16,
        restSeconds: 120,
        techniqueTip: 'Neutral spine throughout; push hips straight backward until hamstrings stretch.',
        targetsMuscle: 'Hamstrings, Glutes, Lower Back'
      },
      {
        id: 'ex-1-4',
        name: 'Incline Push-up / Machine Chest Press',
        category: 'Chest',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 20,
        restSeconds: 90,
        techniqueTip: 'Use a pain-free hand/elbow angle; control the eccentric descent.',
        targetsMuscle: 'Chest, Anterior Delts, Triceps'
      },
      {
        id: 'ex-1-5',
        name: 'Supported Split Squat / Lunges',
        category: 'Legs',
        targetSets: 2,
        targetReps: '8 each leg',
        defaultWeightKg: 8,
        restSeconds: 90,
        techniqueTip: 'Keep front knee aligned over midfoot; hold rack or rail for balance if needed.',
        targetsMuscle: 'Quads, Glutes, Stabilizers'
      },
      {
        id: 'ex-1-6',
        name: 'Dead Bug',
        category: 'Core',
        targetSets: 3,
        targetReps: '8 each side',
        defaultWeightKg: 0,
        restSeconds: 60,
        techniqueTip: 'Keep ribcage down and lower back pressed firmly into the mat.',
        targetsMuscle: 'Deep Core, Pelvic Stability'
      },
      {
        id: 'ex-1-7',
        name: 'Chin Tuck + Wall Slide',
        category: 'Posture',
        targetSets: 2,
        targetReps: '10 reps each',
        defaultWeightKg: 0,
        restSeconds: 60,
        techniqueTip: 'Gentle range, no neck strain; pull head back creating a double chin.',
        targetsMuscle: 'Cervical Flexors, Lower Traps'
      }
    ],
    corePosture: [
      { id: 'cp1-1', name: 'Plank Hold', prescription: '3 sets × 30–45 sec', focus: 'Straight line from crown to heels' },
      { id: 'cp1-2', name: 'Face Pull (Posture Cues)', prescription: '3 sets × 12–15 reps', focus: 'Elbows high, external rotation' }
    ],
    coolDown: [
      { id: 'cd1-1', name: "Child's Pose", prescription: '30–45 sec hold' },
      { id: 'cd1-2', name: 'Doorway Chest Stretch', prescription: '30 sec each side' },
      { id: 'cd1-3', name: 'Hamstring Stretch', prescription: '30 sec each leg' },
      { id: 'cd1-4', name: 'Deep Diaphragmatic Breathing', prescription: '1–2 mins' }
    ],
    importantTips: [
      'Use weights you can control comfortably with zero joint pinching.',
      'Maintain proper form over heavy weight.',
      'Stop if you feel sharp or increasing pain.',
      'Stay hydrated (aim for 2.5–3.0 liters daily).'
    ]
  },
  {
    id: 'day-2',
    dayNumber: 2,
    dayOfWeek: 'Tuesday',
    code: 'DAY 02',
    title: 'Aerobic Base Run / Walk 1',
    subtitle: 'Low Impact Cardio • Aerobic Health • Calorie Burn',
    durationMinutes: '25–30 Mins',
    level: 'All Levels',
    goal: 'Easy Aerobic Base & Active Recovery',
    isCardioOrMobilityOnly: true,
    warmup: [
      { id: 'w2-1', name: 'Gentle Leg Swings', prescription: '10 front/back, 10 side-to-side' },
      { id: 'w2-2', name: 'Ankle Rotations & Calf Bounces', prescription: '1 min' }
    ],
    exercises: [
      {
        id: 'ex-2-1',
        name: 'Brisk Warmup Walk',
        category: 'Cardio',
        targetSets: 1,
        targetReps: '5 Mins',
        defaultWeightKg: 0,
        restSeconds: 0,
        techniqueTip: 'Easy pace, relaxed shoulders, steady rhythmic breathing.'
      },
      {
        id: 'ex-2-2',
        name: 'Run / Walk Intervals (Conversational)',
        category: 'Cardio',
        targetSets: 5,
        targetReps: '3 Mins run / 1 Min walk',
        defaultWeightKg: 0,
        restSeconds: 60,
        techniqueTip: 'Keep pace easy enough to speak short sentences without gasping for air.'
      },
      {
        id: 'ex-2-3',
        name: 'Cool Down Walk',
        category: 'Cardio',
        targetSets: 1,
        targetReps: '5 Mins',
        defaultWeightKg: 0,
        restSeconds: 0,
        techniqueTip: 'Gradually lower heart rate back to resting levels.'
      }
    ],
    corePosture: [
      { id: 'cp2-1', name: 'Standing Calf Stretch', prescription: '45 sec per leg' },
      { id: 'cp2-2', name: 'Standing Quad Stretch', prescription: '45 sec per leg' }
    ],
    coolDown: [
      { id: 'cd2-1', name: 'Hip Flexor Kneeling Stretch', prescription: '30 sec per side' },
      { id: 'cd2-2', name: 'Seated Forward Fold', prescription: '45 sec' }
    ],
    importantTips: [
      'Conversational pace is the golden rule: you should be able to talk.',
      'Natural, quiet foot strikes without pounding.',
      'Switch to easy walking if knee or back discomfort appears.'
    ]
  },
  {
    id: 'day-3',
    dayNumber: 3,
    dayOfWeek: 'Wednesday',
    code: 'DAY 03',
    title: 'Full Body Strength B + Core',
    subtitle: 'Posterior Chain • Core Stability • Posture Correction',
    durationMinutes: '60–70 Mins',
    level: 'Beginner – Intermediate',
    goal: 'Strength + Core + Posture',
    warmup: [
      { id: 'w3-1', name: 'Light Jog / Brisk Walk', prescription: '3–5 Mins' },
      { id: 'w3-2', name: 'Dynamic Arm Swings & Hugs', prescription: '20 reps' },
      { id: 'w3-3', name: 'Hip Circles (Standing)', prescription: '10 reps each direction' },
      { id: 'w3-4', name: 'Leg Swings Front & Side', prescription: '10 reps each' },
      { id: 'w3-5', name: "World's Greatest Stretch", prescription: '5 reps each side', tip: 'Thoracic rotation with lunge' },
      { id: 'w3-6', name: 'Bodyweight Squats', prescription: '15 reps' },
      { id: 'w3-7', name: 'Cat Cow', prescription: '10 reps' }
    ],
    exercises: [
      {
        id: 'ex-3-1',
        name: 'Romanian Deadlift (Barbell / DB)',
        category: 'Legs',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 20,
        restSeconds: 90,
        techniqueTip: 'Keep back flat; hinge from hips and feel hamstrings load.',
        targetsMuscle: 'Hamstrings, Glutes, Spinal Erectors'
      },
      {
        id: 'ex-3-2',
        name: 'Incline Dumbbell Chest Press',
        category: 'Chest',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 14,
        restSeconds: 90,
        techniqueTip: 'Keep shoulder blades pulled back & depressed; full range of motion.',
        targetsMuscle: 'Upper Chest, Anterior Delts, Triceps'
      },
      {
        id: 'ex-3-3',
        name: 'Assisted Pull Up / Lat Pulldown',
        category: 'Back',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 30,
        restSeconds: 90,
        techniqueTip: 'Pull elbows down toward back pockets; avoid excessive torso swing.',
        targetsMuscle: 'Lats, Upper Back, Biceps'
      },
      {
        id: 'ex-3-4',
        name: 'Bulgarian Split Squat',
        category: 'Legs',
        targetSets: 3,
        targetReps: '10–12 each leg',
        defaultWeightKg: 10,
        restSeconds: 90,
        techniqueTip: 'Front knee stays aligned; drop back knee straight down with control.',
        targetsMuscle: 'Quads, Glute Medius, Balance'
      },
      {
        id: 'ex-3-5',
        name: 'Seated Dumbbell Shoulder Press',
        category: 'Shoulders',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 10,
        restSeconds: 90,
        techniqueTip: 'Brace abdominal core; avoid over-arching the lumbar spine.',
        targetsMuscle: 'Anterior & Lateral Delts, Triceps'
      },
      {
        id: 'ex-3-6',
        name: 'Cable Row / Seated Cable Row',
        category: 'Back',
        targetSets: 3,
        targetReps: '10–12',
        defaultWeightKg: 25,
        restSeconds: 90,
        techniqueTip: 'Upright torso; lead pull with elbows and squeeze mid-back.',
        targetsMuscle: 'Mid-Back, Rhomboids, Biceps'
      },
      {
        id: 'ex-3-7',
        name: 'Dumbbell Lateral Raise',
        category: 'Shoulders',
        targetSets: 3,
        targetReps: '12–15',
        defaultWeightKg: 6,
        restSeconds: 60,
        techniqueTip: 'Slight bend in elbows; raise in scapular plane (30° forward), no swinging.',
        targetsMuscle: 'Side Delts (Shoulder Width)'
      },
      {
        id: 'ex-3-8',
        name: 'Hamstring Curl (Machine / Slider)',
        category: 'Legs',
        targetSets: 3,
        targetReps: '10–12',
        defaultWeightKg: 25,
        restSeconds: 90,
        techniqueTip: 'Squeeze hamstrings at contraction; don’t allow hips to rise off pad.',
        targetsMuscle: 'Hamstrings'
      }
    ],
    corePosture: [
      { id: 'cp3-1', name: 'Plank Hold', prescription: '3 sets × 30–45 sec', focus: 'Solid core tension' },
      { id: 'cp3-2', name: 'Dead Bug', prescription: '3 sets × 12 reps each', focus: 'Opposite arm & leg reach' },
      { id: 'cp3-3', name: 'Side Plank', prescription: '3 sets × 30 sec each side', focus: 'Obliques & hip abductors' },
      { id: 'cp3-4', name: 'Chin Tuck (Neck Alignment)', prescription: '3 sets × 15 reps', focus: 'Gentle double chin' },
      { id: 'cp3-5', name: 'Wall Slide', prescription: '3 sets × 12 reps', focus: 'Forearms sliding up wall' }
    ],
    coolDown: [
      { id: 'cd3-1', name: "Child's Pose", prescription: '30 sec' },
      { id: 'cd3-2', name: 'Quad Stretch', prescription: '30 sec each' },
      { id: 'cd3-3', name: 'Chest Wall Stretch', prescription: '30 sec each' },
      { id: 'cd3-4', name: 'Neck Back & Lateral Stretch', prescription: '30 sec each' }
    ],
    importantTips: [
      'Focus on controlled form, not ego lifting.',
      'Maintain stable neutral posture throughout every set.',
      'Progress reps first, then add micro-weights.'
    ]
  },
  {
    id: 'day-4',
    dayNumber: 4,
    dayOfWeek: 'Thursday',
    code: 'DAY 04',
    title: 'Mobility & Posture Reset',
    subtitle: 'Joint Decompression • Active Recovery • Tissue Repair',
    durationMinutes: '35–45 Mins',
    level: 'All Levels',
    goal: 'Mobility + Posture + Recovery',
    isCardioOrMobilityOnly: true,
    warmup: [
      { id: 'w4-1', name: 'Joint Circles (Wrists, Ankles, Neck)', prescription: '3 Mins' },
      { id: 'w4-2', name: 'Cat Cow Spinal Waves', prescription: '12 reps' }
    ],
    exercises: [
      {
        id: 'ex-4-1',
        name: '90/90 Hip Switch',
        category: 'Mobility',
        targetSets: 2,
        targetReps: '8 reps each side',
        defaultWeightKg: 0,
        restSeconds: 45,
        techniqueTip: 'Control hip internal and external rotation without leaning back excessively.'
      },
      {
        id: 'ex-4-2',
        name: 'Half-Kneeling Hip Flexor Stretch',
        category: 'Mobility',
        targetSets: 2,
        targetReps: '30 sec each side',
        defaultWeightKg: 0,
        restSeconds: 30,
        techniqueTip: 'Tuck pelvis under (posterior tilt) and squeeze back glute.'
      },
      {
        id: 'ex-4-3',
        name: 'Thoracic Spine Extensions (Foam Roller / Chair)',
        category: 'Posture',
        targetSets: 2,
        targetReps: '8 slow reps',
        defaultWeightKg: 0,
        restSeconds: 45,
        techniqueTip: 'Support neck with hands; extend upper back over roller without arching lower back.'
      },
      {
        id: 'ex-4-4',
        name: 'Wall Slide with Lift-Off',
        category: 'Posture',
        targetSets: 2,
        targetReps: '10 reps',
        defaultWeightKg: 0,
        restSeconds: 45,
        techniqueTip: 'Activate lower trapezius and serratus anterior; keep ribs down.'
      },
      {
        id: 'ex-4-5',
        name: 'Chin Tuck Isometric Hold',
        category: 'Posture',
        targetSets: 2,
        targetReps: '10 reps (5s hold)',
        defaultWeightKg: 0,
        restSeconds: 30,
        techniqueTip: 'Glide chin straight back; strengthens deep neck flexors.'
      },
      {
        id: 'ex-4-6',
        name: 'Bird Dog',
        category: 'Core',
        targetSets: 2,
        targetReps: '8 reps each side',
        defaultWeightKg: 0,
        restSeconds: 45,
        techniqueTip: 'Kick heel straight back without rotating hips or arching back.'
      },
      {
        id: 'ex-4-7',
        name: 'Glute Bridge with 2-Second Squeeze',
        category: 'Glutes',
        targetSets: 2,
        targetReps: '12 reps',
        defaultWeightKg: 0,
        restSeconds: 45,
        techniqueTip: 'Drive through heels; peak squeeze at the top.'
      }
    ],
    corePosture: [
      { id: 'cp4-1', name: 'Diaphragmatic Box Breathing', prescription: '3 Mins', focus: '4s inhale, 4s hold, 4s exhale, 4s hold' }
    ],
    coolDown: [
      { id: 'cd4-1', name: 'Relaxed Outdoor / Treadmill Walk', prescription: '10–15 Mins' }
    ],
    importantTips: [
      'Recovery is when muscles rebuild and posture resets.',
      'Do not force any stretch into a painful pinch.',
      'Stay relaxed and breathe through your nose.'
    ]
  },
  {
    id: 'day-5',
    dayNumber: 5,
    dayOfWeek: 'Friday',
    code: 'DAY 05',
    title: 'Full Body Strength C + Glutes & Posterior',
    subtitle: 'Build Strength • Glutes Activation • Posterior Chain',
    durationMinutes: '60–75 Mins',
    level: 'Beginner – Intermediate',
    goal: 'Full Body + Glutes + Core + Posture',
    warmup: [
      { id: 'w5-1', name: 'Treadmill Walk / Light Jog', prescription: '3–5 Mins' },
      { id: 'w5-2', name: 'Dynamic Arm Swings', prescription: '20 reps each' },
      { id: 'w5-3', name: 'Leg Swings (Front/Side)', prescription: '10 reps each' },
      { id: 'w5-4', name: 'Hip Circles', prescription: '10 reps each' },
      { id: 'w5-5', name: 'Bodyweight Squat', prescription: '15 reps' },
      { id: 'w5-6', name: "World's Greatest Stretch", prescription: '5 reps each side' },
      { id: 'w5-7', name: 'Cat Cow', prescription: '10 reps' }
    ],
    exercises: [
      {
        id: 'ex-5-1',
        name: 'Barbell / DB Hip Thrust (Glutes Focus)',
        category: 'Glutes',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 30,
        restSeconds: 90,
        techniqueTip: 'Squeeze glutes hard at the top; keep chin tucked down toward chest.',
        targetsMuscle: 'Glutes, Hamstrings, Core'
      },
      {
        id: 'ex-5-2',
        name: 'Goblet Squat (Heels Elevated Optional)',
        category: 'Legs',
        targetSets: 3,
        targetReps: '10–12',
        defaultWeightKg: 16,
        restSeconds: 90,
        techniqueTip: 'Keep chest high; knees track outward in line with toes.',
        targetsMuscle: 'Quads, Glutes, Core'
      },
      {
        id: 'ex-5-3',
        name: 'Dumbbell Incline Chest Press',
        category: 'Chest',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 14,
        restSeconds: 90,
        techniqueTip: 'Lock shoulder blades against the bench; control the 2-second lowering phase.',
        targetsMuscle: 'Upper Chest, Shoulders, Triceps'
      },
      {
        id: 'ex-5-4',
        name: 'Single Arm Dumbbell Row',
        category: 'Back',
        targetSets: 3,
        targetReps: '8–12 each arm',
        defaultWeightKg: 12,
        restSeconds: 90,
        techniqueTip: 'Keep flat spine; pull dumbbell to hip pocket without twisting torso.',
        targetsMuscle: 'Lats, Rhomboids, Core'
      },
      {
        id: 'ex-5-5',
        name: 'Dumbbell Shoulder Press (Seated / Standing)',
        category: 'Shoulders',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 10,
        restSeconds: 90,
        techniqueTip: 'Brace core tight; do not arch lower back when pressing overhead.',
        targetsMuscle: 'Shoulders, Triceps, Core'
      },
      {
        id: 'ex-5-6',
        name: 'Romanian Deadlift (Dumbbell / Barbell)',
        category: 'Legs',
        targetSets: 3,
        targetReps: '8–12',
        defaultWeightKg: 20,
        restSeconds: 90,
        techniqueTip: 'Hinge hips backwards; feel stretch along hamstrings with flat back.',
        targetsMuscle: 'Hamstrings, Glutes, Lower Back'
      },
      {
        id: 'ex-5-7',
        name: 'Walking Lunges (Dumbbell Optional)',
        category: 'Legs',
        targetSets: 3,
        targetReps: '10 each leg',
        defaultWeightKg: 8,
        restSeconds: 90,
        techniqueTip: 'Take controlled steps with upright posture; helps knee stability.',
        targetsMuscle: 'Legs, Glutes, Balance'
      },
      {
        id: 'ex-5-8',
        name: 'Face Pull (Posture Exercise)',
        category: 'Posture',
        targetSets: 3,
        targetReps: '12–15',
        defaultWeightKg: 15,
        restSeconds: 60,
        techniqueTip: 'Keep elbows high; externally rotate wrists to ears; squeeze scapulae.',
        targetsMuscle: 'Rear Delts, Upper Back, Rotator Cuff'
      },
      {
        id: 'ex-5-9',
        name: "Farmer's Carry (Core + Grip + Posture)",
        category: 'Core',
        targetSets: 3,
        targetReps: '20–30 sec carry',
        defaultWeightKg: 16,
        restSeconds: 90,
        techniqueTip: 'Walk tall with proud chest; do not lean forward or sway.',
        targetsMuscle: 'Full Body, Core, Grip, Traps'
      }
    ],
    corePosture: [
      { id: 'cp5-1', name: 'Plank', prescription: '3 sets × 30–45 sec', focus: 'Tight abs and glutes' },
      { id: 'cp5-2', name: 'Side Plank', prescription: '3 sets × 30 sec each side', focus: 'Lateral core' },
      { id: 'cp5-3', name: 'Dead Bug', prescription: '3 sets × 12 reps each', focus: 'Posterior pelvic tilt' },
      { id: 'cp5-4', name: 'Bird Dog', prescription: '3 sets × 12 reps each', focus: 'Anti-rotational core' }
    ],
    coolDown: [
      { id: 'cd5-1', name: "Child's Pose", prescription: '30 sec' },
      { id: 'cd5-2', name: 'Hamstring Stretch', prescription: '30 sec each' },
      { id: 'cd5-3', name: 'Hip Flexor Stretch', prescription: '30 sec each' },
      { id: 'cd5-4', name: 'Chest Stretch', prescription: '30 sec each' },
      { id: 'cd5-5', name: 'Upper Back Stretch', prescription: '30 sec' },
      { id: 'cd5-6', name: 'Neck Lateral Stretch', prescription: '30 sec each' }
    ],
    importantTips: [
      'Maintain proper form over heavy weight.',
      'Control eccentric (lowering) tempo on all lifts.',
      'Focus on mind-muscle glute connection during hip thrusts.'
    ]
  },
  {
    id: 'day-6',
    dayNumber: 6,
    dayOfWeek: 'Saturday',
    code: 'DAY 06',
    title: 'Aerobic Base Run / Walk 2',
    subtitle: 'Aerobic Consistency • Stress Relief • Cardiovascular Endurance',
    durationMinutes: '25–30 Mins',
    level: 'All Levels',
    goal: 'Aerobic Base & Consistency',
    isCardioOrMobilityOnly: true,
    warmup: [
      { id: 'w6-1', name: 'Dynamic Hamstring & Calf Sweeps', prescription: '10 reps each' },
      { id: 'w6-2', name: 'Torso Twists & Arm Swings', prescription: '1 min' }
    ],
    exercises: [
      {
        id: 'ex-6-1',
        name: 'Warmup Walk',
        category: 'Cardio',
        targetSets: 1,
        targetReps: '5 Mins',
        defaultWeightKg: 0,
        restSeconds: 0,
        techniqueTip: 'Brisk walk to get feet & calves ready.'
      },
      {
        id: 'ex-6-2',
        name: 'Conversational Run / Walk (20 Mins)',
        category: 'Cardio',
        targetSets: 1,
        targetReps: '18–20 Mins',
        defaultWeightKg: 0,
        restSeconds: 60,
        techniqueTip: 'Keep breathing controlled and conversational throughout.'
      },
      {
        id: 'ex-6-3',
        name: 'Cool Down Walk & Recovery',
        category: 'Cardio',
        targetSets: 1,
        targetReps: '5 Mins',
        defaultWeightKg: 0,
        restSeconds: 0,
        techniqueTip: 'Deep belly breaths, lowering heart rate.'
      }
    ],
    corePosture: [
      { id: 'cp6-1', name: 'Standing Quad & Hamstring Stretch', prescription: '45 sec each leg' }
    ],
    coolDown: [
      { id: 'cd6-1', name: 'Full Body Standing Reach', prescription: '1 min' },
      { id: 'cd6-2', name: 'Calf & Achilles Stretch', prescription: '45 sec each leg' }
    ],
    importantTips: [
      'Consistent easy aerobic running builds mitochondrial density.',
      'Do not chase speed or sprint in this block.',
      'Stay well hydrated with electrolytes if sweating.'
    ]
  },
  {
    id: 'day-7',
    dayNumber: 7,
    dayOfWeek: 'Sunday',
    code: 'DAY 07',
    title: 'Rest & Full Recovery',
    subtitle: 'Sleep • Nutrition • Mental Decompression • Next Week Prep',
    durationMinutes: 'All Day',
    level: 'All Levels',
    goal: 'Total Recovery & Muscle Repair',
    isRestDay: true,
    warmup: [],
    exercises: [],
    corePosture: [
      { id: 'cp7-1', name: '5-Minute Posture Habit', prescription: '1 round during day', focus: 'Neck & thoracic reset' }
    ],
    coolDown: [
      { id: 'cd7-1', name: 'Optional 20-min gentle leisure walk in nature / park', prescription: '20 mins' }
    ],
    importantTips: [
      'Muscles grow while resting, sleeping, and feeding!',
      'Prioritize protein intake (95–120g) even on rest days.',
      'Aim for 7.5 to 8.5 hours of quality sleep.'
    ]
  }
];

export const INITIAL_WEIGHT_LOGS = [
  { id: 'wl-1', dateStr: '2026-09-01', weightKg: 59.4, note: 'Baseline start' },
  { id: 'wl-2', dateStr: '2026-09-08', weightKg: 59.8, note: 'Week 1 check' },
  { id: 'wl-3', dateStr: '2026-09-15', weightKg: 60.1, note: 'Clean surplus' },
  { id: 'wl-4', dateStr: '2026-09-22', weightKg: 60.4, note: 'Strength feeling solid' },
  { id: 'wl-5', dateStr: '2026-09-28', weightKg: 60.6, note: 'Today weigh-in' },
];

export const SAMPLE_HISTORICAL_SESSIONS = [
  {
    id: 'hist-1',
    dayId: 'day-1',
    dayTitle: 'Full Body Strength A + Posture',
    timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
    dateStr: '2026-09-22',
    durationSeconds: 3840,
    totalVolumeKg: 2850,
    totalSetsCompleted: 19,
    notes: 'Great workout, felt strong on Goblet Squats!'
  },
  {
    id: 'hist-2',
    dayId: 'day-3',
    dayTitle: 'Full Body Strength B + Core',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    dateStr: '2026-09-24',
    durationSeconds: 4120,
    totalVolumeKg: 3420,
    totalSetsCompleted: 22,
    notes: 'RDLs felt smooth, good hamstring stretch.'
  },
  {
    id: 'hist-3',
    dayId: 'day-5',
    dayTitle: 'Full Body Strength C + Glutes & Posterior',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    dateStr: '2026-09-26',
    durationSeconds: 3950,
    totalVolumeKg: 3880,
    totalSetsCompleted: 24,
    notes: 'Hit 35kg on Hip Thrust! Posture feeling upright.'
  }
];

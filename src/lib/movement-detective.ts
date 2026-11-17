import type { Lang, Muscle } from "./types";

export type ExerciseCategory = "chest" | "back" | "shoulders" | "arms" | "legs" | "core";

export interface CategoryMeta {
  id: ExerciseCategory;
  zh: string;
  en: string;
  emoji: string;
}

export const DETECTIVE_CATEGORIES: CategoryMeta[] = [
  { id: "chest", zh: "胸 Chest", en: "Chest", emoji: "💗" },
  { id: "back", zh: "背 Back", en: "Back", emoji: "🦋" },
  { id: "shoulders", zh: "肩 Shoulders", en: "Shoulders", emoji: "🤸" },
  { id: "arms", zh: "手臂 Arms", en: "Arms", emoji: "💪" },
  { id: "legs", zh: "腿臀 Legs", en: "Legs", emoji: "🦵" },
  { id: "core", zh: "核心 Core", en: "Core", emoji: "🔥" },
];

export interface BodyLocationEntry {
  id: string;
  phraseEn: string;
  phraseZh: string;
  muscles: Muscle[];
  possibleStructuresEn: string;
  possibleStructuresZh: string;
  beginnerNoteEn: string;
  beginnerNoteZh: string;
}

/** Part 2: Everyday body-location descriptions mapped to anatomical possibilities. */
export const BODY_LOCATIONS: BodyLocationEntry[] = [
  {
    id: "sides-of-neck",
    phraseEn: "The sides of my neck",
    phraseZh: "脖子两侧",
    muscles: ["trapezius"],
    possibleStructuresEn: "Upper trapezius, levator scapulae",
    possibleStructuresZh: "上斜方肌、肩胛提肌",
    beginnerNoteEn:
      "The muscles running from the sides of your neck down to the tops of your shoulders. They often tighten when shoulders lift toward the ears or neck tenses.",
    beginnerNoteZh:
      "从脖子两侧连到肩膀顶部的肌肉。只要不自觉耸肩、把肩膀往耳朵顶，或者抬头咬牙用力，这里就会很累。",
  },
  {
    id: "near-shoulder",
    phraseEn: "The area near my shoulder",
    phraseZh: "肩膀附近",
    muscles: ["front-deltoids", "back-deltoids"],
    possibleStructuresEn: "Deltoid (front/side/rear), rotator cuff, shoulder joint capsule",
    possibleStructuresZh: "三角肌（前/中/后束）、肩袖肌群或肩关节周围",
    beginnerNoteEn:
      "Several muscles wrap around the shoulder joint like a cap. Deep pinching inside the joint feels very different from muscle fatigue on the outside.",
    beginnerNoteZh:
      "肩膀周围包着一圈肌肉和深层小肌群。外侧肌肉酸胀和关节里面被夹住、卡住的感觉是完全不同的。",
  },
  {
    id: "between-shoulder-blades",
    phraseEn: "Between my shoulder blades",
    phraseZh: "两边肩胛骨中间",
    muscles: ["upper-back", "trapezius"],
    possibleStructuresEn: "Rhomboids, middle trapezius",
    possibleStructuresZh: "菱形肌、中斜方肌",
    beginnerNoteEn:
      "The muscles between the two flat wing-like bones on your upper back. They pull your shoulder blades together.",
    beginnerNoteZh:
      "后背上方两块像翅膀一样的骨头（肩胛骨）中间的肌肉，负责把肩膀往后夹紧。",
  },
  {
    id: "front-of-shoulder",
    phraseEn: "The front of my shoulder",
    phraseZh: "肩膀前侧",
    muscles: ["front-deltoids"],
    possibleStructuresEn: "Anterior deltoid, upper chest insertion, biceps long-head tendon",
    possibleStructuresZh: "三角肌前束、胸大肌与肩连接处、二头长头肌腱",
    beginnerNoteEn:
      "Often takes over during pushing moves if your shoulders roll forward, your elbows flare too wide, or the seat is too low.",
    beginnerNoteZh:
      "做推胸、俯卧撑时如果含胸、肩膀往前顶或手肘抬得跟肩膀一样高，这个位置最容易抢活。",
  },
  {
    id: "under-armpit",
    phraseEn: "Under my armpit",
    phraseZh: "腋下下方与后侧",
    muscles: ["upper-back"],
    possibleStructuresEn: "Upper latissimus dorsi, teres major, serratus anterior",
    possibleStructuresZh: "背阔肌上段、大圆肌、前锯肌",
    beginnerNoteEn:
      "Actually a classic spot to feel your back working during pulldowns or pullovers—many beginners don't realize the back muscle wraps right up under the armpit!",
    beginnerNoteZh:
      "高位下拉或直臂下压时，腋窝后下方发酸发紧其实是练到背（背阔肌）的正确信号，很多新手一开始以为是腋下练错了。",
  },
  {
    id: "side-of-back",
    phraseEn: "The side of my back",
    phraseZh: "背部两侧（背阔区域）",
    muscles: ["upper-back"],
    possibleStructuresEn: "Latissimus dorsi, teres major",
    possibleStructuresZh: "背阔肌、大圆肌",
    beginnerNoteEn:
      "The wide wing-shaped muscle along the outer sides of your mid-to-upper back, responsible for pulling your arms down and back.",
    beginnerNoteZh:
      "背部外侧像扇子一样的大肌肉（背阔肌），负责把手臂往下、往腰部方向拉。",
  },
  {
    id: "middle-of-back",
    phraseEn: "The middle of my back",
    phraseZh: "背部正中间",
    muscles: ["upper-back"],
    possibleStructuresEn: "Middle/lower trapezius, rhomboids, mid-thoracic erectors",
    possibleStructuresZh: "中下斜方肌、菱形肌、中段竖脊肌",
    beginnerNoteEn:
      "Works during rowing movements when you keep your chest tall and draw your elbows back without leaning far backward.",
    beginnerNoteZh:
      "坐姿划船时保持挺胸、手肘贴身往后拉，背部正中会有充实发力的感觉。",
  },
  {
    id: "lower-back",
    phraseEn: "The area near my lower back",
    phraseZh: "后腰 / 下背部",
    muscles: ["lower-back"],
    possibleStructuresEn: "Lumbar erector spinae, quadratus lumborum, hip flexors/pelvic tilt tension",
    possibleStructuresZh: "腰部竖脊肌、腰方肌，或骨盆过度前倾引起的下背紧绷",
    beginnerNoteEn:
      "Mild tension during squats or deadlifts can be normal stabilizing work, but sharp arching, pinching, or lower-back takeover during ab/glute work signals compensation.",
    beginnerNoteZh:
      "深蹲、硬拉时轻微酸胀可能是核心在稳定；但练臀或练腹时腰先酸，或腰部刺痛，通常是塌腰借力或核心没收紧。",
  },
  {
    id: "front-of-thigh",
    phraseEn: "The front of my thigh",
    phraseZh: "大腿前侧",
    muscles: ["quadriceps"],
    possibleStructuresEn: "Quadriceps (rectus femoris, vastus lateralis/medialis)",
    possibleStructuresZh: "股四头肌（大腿前侧肌群）",
    beginnerNoteEn:
      "Expected during squats, lunges, and leg extensions. If it dominates during glute bridges or leg raises, foot position or hip flexors may be taking over.",
    beginnerNoteZh:
      "深蹲、腿屈伸时这里酸是正常的；但如果做臀桥、练腹抬腿时主要是大腿前侧或大腿根酸，多半是脚踩的位置或发力方式跑偏了。",
  },
  {
    id: "behind-thigh",
    phraseEn: "Behind my thigh",
    phraseZh: "大腿后侧",
    muscles: ["hamstring"],
    possibleStructuresEn: "Hamstrings (biceps femoris, semitendinosus, semimembranosus)",
    possibleStructuresZh: "腘绳肌（大腿后侧肌群）",
    beginnerNoteEn:
      "Main target in leg curls and Romanian deadlifts. If it cramps during glute bridges, feet are often placed too far away from your hips.",
    beginnerNoteZh:
      "腿弯举、罗马尼亚硬拉时主要是这里拉伸发酸；但做臀桥如果这里抽筋，常是因为脚跟离屁股太远了。",
  },
  {
    id: "buttocks",
    phraseEn: "My buttocks",
    phraseZh: "臀部 / 屁股",
    muscles: ["gluteal", "abductors"],
    possibleStructuresEn: "Gluteus maximus, gluteus medius, deep hip rotators",
    possibleStructuresZh: "臀大肌、臀中肌（臀外侧）、深层髋外旋肌",
    beginnerNoteEn:
      "Target area for glute bridges, hip thrusts, and abductions; also assists squats, lunges, and Romanian deadlifts.",
    beginnerNoteZh:
      "臀桥、臀推的主要目标部位，也是深蹲、弓步蹲、硬拉时的重要发力助手。",
  },
  {
    id: "sides-of-knees",
    phraseEn: "The sides of my knees",
    phraseZh: "膝盖两侧或周围",
    muscles: ["quadriceps", "abductors"],
    possibleStructuresEn: "IT band / tensor fasciae latae tension, quad tracking, pes anserinus",
    possibleStructuresZh: "髂胫束张力、股四头肌内外侧牵拉或膝关节周围韧带",
    beginnerNoteEn:
      "Often related to knees caving inward, feet misaligned with knee direction, or locking the knees out hard on leg press/squats.",
    beginnerNoteZh:
      "通常和深蹲/腿举时膝盖内扣、膝盖方向没对准脚尖，或蹬直时膝盖完全锁死有关。若出现刺痛需停下排查。",
  },
];

export type SafetyLevel = "safe" | "caution" | "stop" | "emergency";

export interface SensationType {
  code: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  level: SafetyLevel;
  labelEn: string;
  labelZh: string;
  descEn: string;
  descZh: string;
  guidanceEn: string;
  guidanceZh: string;
}

/** Part 11: Pain & Safety Protocol */
export const SENSATION_TYPES: SensationType[] = [
  {
    code: "A",
    level: "safe",
    labelEn: "Normal muscle fatigue",
    labelZh: "A. 正常肌肉疲劳（没力气、发沉）",
    descEn: "Muscles feel heavy, tired, or slow down near the end of a set.",
    descZh: "做到后面觉得肌肉沉、慢下来或拉不动，放下重量就很快恢复。",
    guidanceEn: "Normal training response. We will check if the fatigue is in the expected target muscle or a helper muscle.",
    guidanceZh: "这是正常训练反应，我们来排查是目标肌肉在累，还是其他肌肉在代偿。",
  },
  {
    code: "B",
    level: "safe",
    labelEn: "Muscle burning during exercise",
    labelZh: "B. 动作中肌肉酸胀 / 灼热感",
    descEn: "Warm, tight, or burning sensation inside the belly of a muscle while lifting.",
    descZh: "动作过程中肌肉中间有发胀、发热、发酸的感觉。",
    guidanceEn: "Safe in the target muscle, though not required for muscle growth. If felt in the neck or lower back instead, it points to compensation.",
    guidanceZh: "如果是目标肌肉发胀是安全的（但没感觉不代表没练到）；如果出现在脖子或腰，说明可能有代偿。",
  },
  {
    code: "C",
    level: "safe",
    labelEn: "Delayed onset muscle soreness (DOMS)",
    labelZh: "C. 练后 1–2 天肌肉酸痛",
    descEn: "Dull muscle soreness 24–48 hours after a workout.",
    descZh: "训练结束第二天、第三天按压或活动时肌肉整体酸酸的。",
    guidanceEn: "Common after new exercises or higher volume. Soreness is not a requirement for progress.",
    guidanceZh: "换新动作或刚入门很常见，但肌肉酸痛不是训练有效的唯一标准。",
  },
  {
    code: "D",
    level: "caution",
    labelEn: "Joint discomfort / pinching",
    labelZh: "D. 关节不适 / 卡顿 / 挤压感",
    descEn: "Tightness, clicking, or pressure right inside the shoulder, elbow, wrist, knee, or hip joint.",
    descZh: "肩膀、手肘、手腕、膝盖或髋关节深处有卡着、别扭或挤压感。",
    guidanceEn: "Pause and reduce weight immediately. Adjust seat height, grip, or range of motion. Do not force through joint discomfort.",
    guidanceZh: "请先减重或停下调整：检查座椅高度、握距、手肘或膝盖方向，不要硬顶着关节不适继续做。",
  },
  {
    code: "E",
    level: "stop",
    labelEn: "Sharp or sudden pain",
    labelZh: "E. 尖锐刺痛 / 突然剧痛",
    descEn: "Sudden stabbing, pinching, tearing, or sharp pain during a rep.",
    descZh: "动作中突然出现针扎、撕裂、刀割一样的尖锐痛感。",
    guidanceEn: "STOP this exercise immediately. Do not push through sharp pain. Rest and consider consulting a doctor or physical therapist if it persists.",
    guidanceZh: "请立刻停止该动作！绝对不要硬撑。如果休息后仍持续疼痛，请咨询医生或物理治疗师。",
  },
  {
    code: "F",
    level: "stop",
    labelEn: "Numbness or tingling",
    labelZh: "F. 发麻 / 针刺麻木 / 过电感",
    descEn: "Pins-and-needles, numbness, or electric tingling radiating down the arm, hand, leg, or foot.",
    descZh: "手臂、手指、腿或脚出现发麻、刺麻或像过电一样的感觉。",
    guidanceEn: "STOP immediately. Numbness or tingling can involve nerve irritation. Seek professional medical assessment before resuming.",
    guidanceZh: "请立刻停止动作！麻木或过电感可能涉及神经受压或刺激，建议先请医生或专业物理治疗师评估。",
  },
  {
    code: "G",
    level: "emergency",
    labelEn: "Dizziness / chest pain / faintness",
    labelZh: "G. 头晕 / 胸闷 / 眼前发黑 / 心慌",
    descEn: "Lightheadedness, chest pressure/pain, shortness of breath out of proportion, or feeling faint.",
    descZh: "头晕恶心、胸口发闷或疼痛、喘不上气、感觉要晕倒。",
    guidanceEn: "STOP immediately, sit or lie down safely, breathe calmly, and seek urgent medical help right away if chest pain or fainting occurs.",
    guidanceZh: "请立刻停止一切训练，安全坐下或躺下休息并保持呼吸；若出现胸痛、持续头晕或晕厥征兆，请立即寻求紧急医疗救助。",
  },
];

export interface CompensationCase {
  id: string;
  symptomEn: string;
  symptomZh: string;
  compensatedMuscles: Muscle[];
  investigateEn: string[];
  investigateZh: string[];
  causesEn: string[];
  causesZh: string[];
  correctionsEn: string[];
  correctionsZh: string[];
  practiceEn: string;
  practiceZh: string;
  retestEn: string[];
  retestZh: string[];
}

export interface DetectiveExercise {
  id: string;
  libraryId: string;
  category: ExerciseCategory;
  nameEn: string;
  nameZh: string;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  primaryLabelEn: string;
  primaryLabelZh: string;
  secondaryLabelEn: string;
  secondaryLabelZh: string;
  stabilizersEn: string;
  stabilizersZh: string;
  normalFeelEn: string;
  normalFeelZh: string;
  beginnerTensionEn: string;
  beginnerTensionZh: string;
  burnNoteEn: string;
  burnNoteZh: string;
  warningSignsEn: string;
  warningSignsZh: string;
  techniqueRulesEn: string[];
  techniqueRulesZh: string[];
  compensations: CompensationCase[];
}

const ex = (e: DetectiveExercise): DetectiveExercise => e;

/** Part 3, 8 & 12: Complete 32-Exercise Biomechanics & Compensation Knowledge Base */
export const DETECTIVE_EXERCISES: DetectiveExercise[] = [
  // ═══════════════ CHEST (5) ═══════════════
  ex({
    id: "chest-press",
    libraryId: "chest-press",
    category: "chest",
    nameEn: "Chest Press",
    nameZh: "坐姿推胸",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front-deltoids", "triceps"],
    primaryLabelEn: "Pectoralis major (chest)",
    primaryLabelZh: "胸大肌",
    secondaryLabelEn: "Anterior deltoids (front shoulder) & triceps (back of arm)",
    secondaryLabelZh: "三角肌前束（前肩）、肱三头肌（大臂后侧）",
    stabilizersEn: "Scapular stabilizers (middle/lower traps, serratus anterior) & core",
    stabilizersZh: "肩胛稳定肌群（中下斜方肌、前锯肌）与核心",
    normalFeelEn: "Pressure and tightening across the middle of the chest as you press forward, with mild helper effort in the front shoulders and back of the arms.",
    normalFeelZh: "往前推时胸口中间有发紧、收缩发力的感觉；前肩和大臂后侧会轻微帮忙，但不该抢走主角。",
    beginnerTensionEn: "Front of the shoulders, sides of the neck (upper traps), or wrists bending backward.",
    beginnerTensionZh: "肩膀前侧、脖子两侧（上斜方肌）发酸，或手腕向后折导致酸痛。",
    burnNoteEn: "Chest muscles often feel stretch and tension rather than an intense 'burn' at first—especially for beginners.",
    burnNoteZh: "新手刚开始练胸往往只觉得胸口被拉开和发紧，不一定有强烈灼热感，这完全正常。",
    warningSignsEn: "Sharp pinching in the front of the shoulder joint or elbow pain.",
    warningSignsZh: "肩膀前侧关节深处刺痛、卡顿，或手肘明显刺痛。",
    techniqueRulesEn: [
      "Adjust seat so handles line up with mid-chest (nipple line), not collarbone.",
      "Draw shoulder blades back and down against the pad before pressing.",
      "Keep elbows slightly below shoulder height (~45–60° arrow shape, not a T).",
      "Keep wrists straight and push with controlled lowering (2–3 seconds).",
    ],
    techniqueRulesZh: [
      "座椅调到把手与胸口中段（乳头连线）齐平，不要高到锁骨。",
      "推之前先把肩膀往后贴靠垫、往下沉，全程别让肩膀往前顶离开垫子。",
      "手肘比肩膀低一点（从上看像箭头 ↑，不要张成 T 字）。",
      "手腕保持挺直不后折，收回时用 2–3 秒控制住。",
    ],
    compensations: [
      {
        id: "chest-press-shoulder",
        symptomEn: "Feel front of shoulders more than chest",
        symptomZh: "胸没感觉，肩膀前侧特别酸",
        compensatedMuscles: ["front-deltoids", "trapezius"],
        investigateEn: [
          "Seat height (handles sitting near collarbone instead of mid-chest)",
          "Elbows flaring wide at 90° (T-shape)",
          "Shoulders rolling forward off the backrest during the push",
          "Excessive load or going too far back into shoulder stretch",
        ],
        investigateZh: [
          "座椅太低导致把手偏高（靠近锁骨）",
          "手肘抬太高张成 T 字型",
          "推的时候肩膀往前耸、背离开靠垫",
          "重量太重或往后放得太深",
        ],
        causesEn: ["Seat too low or elbows flared out, shifting leverage onto the front shoulder.", "Shoulders protracting forward off the pad instead of staying anchored back."],
        causesZh: ["座椅太低或手肘太高，力线直接压到前肩。", "推的时候含胸耸肩，肩胛骨没有贴住靠垫稳定。"],
        correctionsEn: [
          "Raise the seat so handles align with mid-chest (nipple line).",
          "Drop elbows slightly down into a 45° arrow angle.",
          "Pin shoulder blades gently back and down onto the pad—don't chase the handle with your shoulders.",
          "Lower weight by 20–30% and pause smoothly at the bottom.",
        ],
        correctionsZh: [
          "把座椅调高一点，让把手对准胸口中段（乳头连线）。",
          "手肘往身体斜下方降一个拳头，呈箭头 ↑ 姿势。",
          "肩膀后收下沉贴死靠垫，推到底时胸往前迎、肩膀别往前追把手。",
          "先降重 20–30%，用 2 秒慢放找胸口拉伸感。",
        ],
        practiceEn: "Try 10 light reps pausing 1 second near the chest while keeping shoulders glued to the pad.",
        practiceZh: "用很轻的重量做 10 次慢动作，每次收回停 1 秒，检查肩膀有没有离开靠垫。",
        retestEn: ["Does your front shoulder feel less strained?", "Do you feel more tension across the center of your chest?"],
        retestZh: ["前肩紧张感有没有减轻？", "推起来时胸口中间有没有更踏实的发力感？"],
      },
    ],
  }),
  ex({
    id: "incline-chest-press",
    libraryId: "incline-db-press",
    category: "chest",
    nameEn: "Incline Chest Press",
    nameZh: "上斜推胸",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front-deltoids", "triceps"],
    primaryLabelEn: "Upper pectoralis major (upper chest)",
    primaryLabelZh: "上胸（胸大肌锁骨部）",
    secondaryLabelEn: "Anterior deltoids & triceps",
    secondaryLabelZh: "三角肌前束、肱三头肌",
    stabilizersEn: "Scapular stabilizers, rotator cuff, core",
    stabilizersZh: "肩胛稳定肌群、肩袖、核心",
    normalFeelEn: "Tension just below the collarbone across the upper chest.",
    normalFeelZh: "锁骨下方一点点的上胸位置感到收紧发酸。",
    beginnerTensionEn: "Front shoulder takeover if the bench angle is too steep (>45°).",
    beginnerTensionZh: "靠背调太直（超过 45 度）时几乎全靠前肩推，上胸没感觉。",
    burnNoteEn: "Upper chest recruits the front delts naturally; feeling some shoulder work is normal, just shouldn't overpower chest.",
    burnNoteZh: "上斜角度本身就会带到一部分前肩，只要胸口上方也能同时发力就正常。",
    warningSignsEn: "Sharp front-shoulder pinching at the bottom or excessive lower-back arching.",
    warningSignsZh: "下放到底时前肩刺痛，或腰部过度悬空弓起。",
    techniqueRulesEn: [
      "Set bench angle to 30° (about two notches up from flat), avoid 60°+.",
      "Lower dumbbells/handles toward the upper chest just below the collarbone.",
      "Keep elbows tucked ~45° from torso, forearms vertical.",
    ],
    techniqueRulesZh: [
      "靠背调在 30–45 度之间即可，不要调得像坐着推肩那么陡。",
      "哑铃或把手落到锁骨下方两侧，小臂始终垂直地面。",
      "手肘稍微内收呈斜箭头，不耸肩。",
    ],
    compensations: [
      {
        id: "incline-steep",
        symptomEn: "Feels like a shoulder press instead of upper chest",
        symptomZh: "感觉完全像在练推肩，上胸没感觉",
        compensatedMuscles: ["front-deltoids", "trapezius"],
        investigateEn: ["Bench angle (>45°)", "Elbows flared toward ears", "Shrugging at the top"],
        investigateZh: ["靠背太直（超过 45°）", "手肘向外打开太多", "推到顶端习惯性耸肩"],
        causesEn: ["Steep bench angle shifts mechanical demand directly to the anterior deltoids."],
        causesZh: ["靠背太陡时发力方向变成向上推举，主角就从上胸变成三角肌前束。"],
        correctionsEn: ["Lower the bench to 30°.", "Keep chest lifted and shoulders down away from ears.", "Touch near upper chest, elbows tucked 45°."],
        correctionsZh: ["把靠背放低一到两格（约 30°）。", "先沉肩再推，推到顶端不要刻意把肩膀顶上去。", "小臂垂直地面，手肘微内收。"],
        practiceEn: "Perform 8 slow reps at 30° incline with lighter dumbbells, 3-second lowering.",
        practiceZh: "把凳子降到 30°，换轻一对的哑铃，用 3 秒慢下做 8 次感受锁骨下方发力。",
        retestEn: ["Does the tension shift downward from the front shoulder to just below your collarbone?"],
        retestZh: ["发力感有没有从肩膀尖往下移到锁骨下方？"],
      },
    ],
  }),
  ex({
    id: "pec-deck",
    libraryId: "pec-fly",
    category: "chest",
    nameEn: "Pec Deck (Chest Fly)",
    nameZh: "蝴蝶机夹胸",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front-deltoids"],
    primaryLabelEn: "Pectoralis major",
    primaryLabelZh: "胸大肌",
    secondaryLabelEn: "Anterior deltoids (stabilizing)",
    secondaryLabelZh: "三角肌前束（协助稳定）",
    stabilizersEn: "Biceps (isometric), scapular retractors",
    stabilizersZh: "肱二头肌（保持微弯）、肩胛稳定肌",
    normalFeelEn: "Deep stretch across the chest when opening, squeezing tension across inner chest when closing.",
    normalFeelZh: "打开时胸口外侧被拉开，合拢时像用大臂夹抱一棵大树，胸口中间挤紧。",
    beginnerTensionEn: "Front of the shoulder or inside of the elbow/bicep if arms swing too far back or stay completely locked straight.",
    beginnerTensionZh: "手肘伸太直或往后打开过头，导致肩膀前侧或手肘内侧拉扯酸痛。",
    burnNoteEn: "Focusing on moving the elbows toward each other—not the hands—creates much clearer chest activation without needing heavy weight.",
    burnNoteZh: "想着「用两只手肘往中间靠拢」而不是用手硬拽把手，胸口会立刻清楚很多。",
    warningSignsEn: "Sharp pull at the front shoulder crease when arms travel behind the torso.",
    warningSignsZh: "手臂往后打开到超过身体平面时，肩膀前侧出现尖锐拉扯痛。",
    techniqueRulesEn: [
      "Seat height: handles at mid-chest level.",
      "Keep a soft, fixed bend in the elbows (like hugging a big tree).",
      "Stop opening once arms align with your torso—do not over-stretch backward.",
    ],
    techniqueRulesZh: [
      "座椅调到把手和乳头连线一样高。",
      "手肘保持固定微弯（像抱大树），全程角度不变。",
      "往后打开到跟身体差不多平就够了，不要拼命往后掰。",
    ],
    compensations: [
      {
        id: "pec-deck-bicep-shoulder",
        symptomEn: "Front shoulder or inner arm hurts/tires instead of chest",
        symptomZh: "手臂内侧或前肩发紧，胸口夹不到",
        compensatedMuscles: ["front-deltoids", "biceps"],
        investigateEn: ["Range of motion going too far behind torso", "Seat height too low", "Shrugging shoulders forward during squeeze"],
        investigateZh: ["往后打开幅度过大", "座椅太低导致把手偏高", "夹到前面时顺便含胸耸肩"],
        causesEn: ["Over-stretching behind the torso places high load on the shoulder capsule and biceps tendon."],
        causesZh: ["手臂过度后伸会把压力全集中到肩前侧和二头肌腱，推合时又含胸导致肩膀代偿。"],
        correctionsEn: ["Move the pin one notch forward to limit backward stretch.", "Keep shoulders pressed back into the pad.", "Think 'squeeze elbows together', not hands."],
        correctionsZh: ["把机器限位销往前调一格，别打开到身体后面去。", "背和肩膀贴稳靠垫，不要耸肩。", "意念集中在用大臂内侧和手肘往胸前合拢。"],
        practiceEn: "Try 10 light reps opening only to shoulder line and holding the squeeze for 2 seconds.",
        practiceZh: "调轻一档重量，打开到与身体齐平就停，向前合拢顶峰夹紧停 2 秒，试 10 次。",
        retestEn: ["Is the pull in the front shoulder crease gone?", "Can you feel the chest tighten in front?"],
        retestZh: ["前肩拉扯感有没有消失？", "合拢时胸口有没有明显变紧？"],
      },
    ],
  }),
  ex({
    id: "db-bench-press",
    libraryId: "db-bench",
    category: "chest",
    nameEn: "Dumbbell Bench Press",
    nameZh: "哑铃卧推",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front-deltoids", "triceps"],
    primaryLabelEn: "Pectoralis major",
    primaryLabelZh: "胸大肌",
    secondaryLabelEn: "Anterior deltoids & triceps",
    secondaryLabelZh: "三角肌前束、肱三头肌",
    stabilizersEn: "Rotator cuff, forearms, core",
    stabilizersZh: "肩袖肌群、小臂稳定、核心",
    normalFeelEn: "Chest stretching at the bottom and contracting as dumbbells press together toward mid-chest.",
    normalFeelZh: "下放到底胸口有拉开感，往上推时胸口发力、三头辅助。",
    beginnerTensionEn: "Shaking arms, sore wrists, or front-shoulder strain from flaring elbows straight out.",
    beginnerTensionZh: "手腕翻折酸、手臂左右乱晃，或手肘外张像 T 字导致肩前侧酸。",
    burnNoteEn: "Early wobbling is your stabilizers learning the path—lighter dumbbells build smoother control fast.",
    burnNoteZh: "新手刚开始推会发抖是稳定肌在学习控制平衡，先用轻哑铃练稳比硬加重更重要。",
    warningSignsEn: "Wrist pain, shoulder pinching at bottom, or losing balance sideways.",
    warningSignsZh: "手腕疼、放到底时肩膀卡痛，或哑铃向一侧失控倾斜。",
    techniqueRulesEn: [
      "Plant feet flat on the floor and keep shoulder blades gently tucked onto the bench.",
      "Lower dumbbells to the sides of mid-chest with elbows at ~45° (arrow shape).",
      "Keep forearms vertical over wrists and press smoothly upward.",
    ],
    techniqueRulesZh: [
      "双脚踩稳地面，肩胛骨微微往后下收贴紧凳面。",
      "下放时哑铃在乳头连线两侧，手肘指向斜下方（箭头 ↑，不是 T 字）。",
      "小臂保持垂直地面，不要向内或向外歪。",
    ],
    compensations: [
      {
        id: "db-bench-shoulder",
        symptomEn: "Shoulder pain or front-delt fatigue; wobbly path",
        symptomZh: "肩膀酸痛或哑铃总是往前/外晃",
        compensatedMuscles: ["front-deltoids", "triceps"],
        investigateEn: ["Elbow flare angle (90° T-shape)", "Lowering dumbbells toward neck instead of mid-chest", "Load too heavy to control descent"],
        investigateZh: ["手肘外张成 90°", "哑铃落点太靠近脖子/肩膀", "重量太重导致下放失控"],
        causesEn: ["Dumbbells drifting toward the shoulders puts the arm in a risky flared position."],
        causesZh: ["哑铃落得太靠上、手肘外翻，会把重量直接压在肩关节前侧。"],
        correctionsEn: ["Touch down beside mid-chest, keeping elbows angled ~45° toward your hips.", "Keep wrists stacked directly over elbows.", "Use a lighter dumbbell pair until every rep descends smoothly in 2–3 seconds."],
        correctionsZh: ["让哑铃落点稍微往下移到胸口中段两侧，手肘往腰方向收一点。", "保证从侧面看手腕和手肘垂直对齐。", "换轻一级的哑铃，用 2–3 秒控制下放。"],
        practiceEn: "Do 8 slow reps with light dumbbells, pausing 1 second just outside chest level.",
        practiceZh: "换轻哑铃做 8 次，每次在最低点停 1 秒确认手肘方向和肩膀放松。",
        retestEn: ["Does the bar/dumbbell path feel steady without front-shoulder pinching?"],
        retestZh: ["哑铃轨迹有没有更稳，肩膀前侧还酸痛吗？"],
      },
    ],
  }),
  ex({
    id: "push-up",
    libraryId: "knee-pushup",
    category: "chest",
    nameEn: "Push-up",
    nameZh: "俯卧撑（含跪姿/上斜）",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["front-deltoids", "triceps"],
    primaryLabelEn: "Pectoralis major",
    primaryLabelZh: "胸大肌",
    secondaryLabelEn: "Anterior deltoids, triceps & core (abs)",
    secondaryLabelZh: "三角肌前束、肱三头肌、核心腹肌",
    stabilizersEn: "Serratus anterior, glutes, quadriceps",
    stabilizersZh: "前锯肌、臀部与核心稳定",
    normalFeelEn: "Chest and back of arms working together while your body stays stiff like a plank.",
    normalFeelZh: "胸口和大臂后侧一起发力推起身体，同时肚子收紧像一块平板。",
    beginnerTensionEn: "Lower back sagging, neck craning up, or wrists hurting.",
    beginnerTensionZh: "塌腰导致后腰酸、抬头看前方脖子酸，或手腕撑得疼。",
    burnNoteEn: "Doing incline push-ups (hands on a bench) or knee push-ups is smart scaling so your chest works instead of your lower back sagging.",
    burnNoteZh: "做不起来标准俯卧撑时，先做手撑高凳的上斜俯卧撑或跪姿俯卧撑完全不丢人，反而能真正练到胸。",
    warningSignsEn: "Lower back pinching from hip sag, or sharp wrist/shoulder pain.",
    warningSignsZh: "塌腰引起腰部刺痛，或手腕、肩关节尖锐疼痛。",
    techniqueRulesEn: [
      "Hands slightly wider than shoulders, aligned under chest (not face).",
      "Squeeze abs and glutes so head-to-heels (or knees) forms one straight line.",
      "Elbows track back at ~45° like an arrow ↑.",
    ],
    techniqueRulesZh: [
      "双手放在胸口两侧下方，不要放到脸前面去。",
      "收紧肚子和屁股，身体从头到脚/膝成一条直线，不塌腰不撅屁股。",
      "下放时手肘指向斜后方 45°。",
    ],
    compensations: [
      {
        id: "pushup-back-neck",
        symptomEn: "Lower back aches or neck/shoulders feel tight",
        symptomZh: "腰酸或者脖子、肩膀前侧很累",
        compensatedMuscles: ["lower-back", "front-deltoids", "trapezius"],
        investigateEn: ["Hips sagging down before chest", "Hands placed too far forward", "Head dropping or looking straight up"],
        investigateZh: ["核心没收紧导致塌腰", "手撑得太靠前（超过肩膀）", "脖子往前伸着低头或抬头"],
        causesEn: ["Bodyweight is too heavy for current chest/core strength, causing the lower back to sag and shoulders to shrug."],
        causesZh: ["地面水平自重对当前力量偏重，导致核心掉线塌腰、身体靠耸肩和顶腰完成动作。"],
        correctionsEn: ["Elevate hands onto a sturdy bench or wall (incline push-up).", "Brace abs like expecting a gentle poke and squeeze glutes.", "Look at the floor slightly ahead of your fingertips."],
        correctionsZh: ["把手撑到高一点的卧推凳或桌面上做上斜俯卧撑（最有效降阶）。", "全程收紧肚子和屁股，让胸口和胯同时起落。", "眼睛看两手前方地面，保持脖子后侧放长。"],
        practiceEn: "Try 8 reps with hands elevated on a bench, lowering chest cleanly between your hands.",
        practiceZh: "改用双手撑卧推凳做 8 次上斜俯卧撑，胸口落到两手之间再推起。",
        retestEn: ["Does your lower back stay pain-free?", "Can you keep your hips and chest moving as one unit?"],
        retestZh: ["腰还酸吗？", "上下时胸口和屁股是不是能一起平稳移动？"],
      },
    ],
  }),

  // ═══════════════ BACK (7) ═══════════════
  ex({
    id: "lat-pulldown",
    libraryId: "lat-pulldown",
    category: "back",
    nameEn: "Lat Pulldown",
    nameZh: "高位下拉",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["biceps", "back-deltoids"],
    primaryLabelEn: "Latissimus dorsi (side of back)",
    primaryLabelZh: "背阔肌（背部两侧 / 腋下后方）",
    secondaryLabelEn: "Biceps, brachialis, brachioradialis, teres major, scapular stabilizers",
    secondaryLabelZh: "肱二头肌、肱肌、肱桡肌、大圆肌与肩胛稳定肌",
    stabilizersEn: "Forearms (grip), lower traps, core",
    stabilizersZh: "前臂（握力）、下斜方肌、核心",
    normalFeelEn: "Muscles under the armpit and along the outer sides of the back tightening as elbows drive down; mild arm fatigue is normal.",
    normalFeelZh: "手肘往下拉时腋下后方到背部两侧收紧发酸；手臂有轻微帮忙是正常的，但主力应该在背。",
    beginnerTensionEn: "Biceps/forearms burning out before the back, or upper traps tightening around the neck.",
    beginnerTensionZh: "还没觉得背累，二头肌和小臂先酸爆，或者脖子两侧耸肩发紧。",
    burnNoteEn: "Lats are large muscles and beginners often feel only a gentle squeeze near the armpit at first—lack of a strong burn does not mean the back isn't working.",
    burnNoteZh: "背阔肌面积很大且平时少用，新手一开始常常只感觉腋下微微发酸，没有强烈灼热感也完全练到了。",
    warningSignsEn: "Pinching on top of the shoulder when pulling behind the neck, or lower-back pain from swinging backward.",
    warningSignsZh: "拉到脖子后面引起的肩峰卡痛，或大幅度往后甩腰导致的腰痛。",
    techniqueRulesEn: [
      "Lock thighs under pads; slight 10–15° torso lean back.",
      "Depress shoulders away from ears BEFORE bending elbows.",
      "Drive elbows down toward your hips, pulling the bar to upper chest/collarbone.",
      "Control the return upward for 2–3 seconds without slamming the stack.",
    ],
    techniqueRulesZh: [
      "挡垫压紧大腿；上半身坐稳后微后倾 10–15 度即可。",
      "每次拉之前先「沉肩」（把肩膀从耳朵旁往下拉），再弯手肘。",
      "想着把两个手肘往下压向屁股/裤兜，横杆拉到锁骨前，不要拉到脖子后。",
      "放回时慢放 2–3 秒，让背部拉长。",
    ],
    compensations: [
      {
        id: "lat-pulldown-biceps",
        symptomEn: "Biceps or forearms get tired first; can't feel back",
        symptomZh: "手臂二头和小臂先酸，背完全没感觉",
        compensatedMuscles: ["biceps", "forearm"],
        investigateEn: [
          "Grip selection (too narrow/underhand or death-gripping with fingers)",
          "Elbow movement (pulling elbows backward like a curl instead of straight down)",
          "Excessive arm pulling / turning the movement into an arm curl",
          "Load selection & poor control (too heavy or rushing)",
        ],
        investigateZh: [
          "握法/握距（握太窄、反手或手掌死命抓杆）",
          "手肘走向（手肘往前甩或向内弯成弯举动作）",
          "用小臂手腕硬拽横杆，把下拉做成了手臂弯举",
          "重量太大或动作太快失去控制",
        ],
        causesEn: [
          "When you focus on pulling the bar with your hands, the biceps flex aggressively and take over.",
          "Failing to drop the shoulders down first leaves the back unengaged while arms do the work.",
        ],
        causesZh: [
          "注意力放在「用手把杆拽下来」时，二头肌会立刻抢先发力变成弯举。",
          "没有先做「沉肩」启动背阔肌，肩膀耸着直接弯手肘，压力就全在手臂上。",
        ],
        correctionsEn: [
          "Think about bringing your elbows down toward your hips instead of pulling the bar with your hands.",
          "Hook fingers over the bar like hooks (thumbs on top / relaxed grip) so forearms relax.",
          "Start every rep by dropping shoulders down 1 inch, then pull elbows down.",
          "Lower weight slightly and pause 1 second at collarbone level.",
        ],
        correctionsZh: [
          "核心口令：「不要用手去拽横杆，把双手当成钩子，想着把两只手肘往下压向髋部（裤兜）」。",
          "试着用大拇指和四指同侧虚握（无名指和小指略微挂住），减轻前臂和二头抢力。",
          "每一下先沉肩 2 厘米，再拉手肘；下巴微收，横杆只拉到锁骨位置。",
          "适当减轻 1–2 格配重，在胸前停顿 1 秒感受腋下后方收紧。",
        ],
        practiceEn: "Do 10 slow reps at lighter weight: 1) drop shoulders down, 2) pull elbows toward hips, 3) hold 1 second.",
        practiceZh: "降一两格配重做 10 次慢速练习：先沉肩 → 手肘压向髋部 → 胸前停 1 秒。",
        retestEn: ["Do your biceps fatigue less early?", "Can you feel tightening right under your armpits or along the sides of your back?"],
        retestZh: ["手臂二头是不是没那么快酸了？", "腋下后方或背部两侧有没有开始发紧的感觉？"],
      },
      {
        id: "lat-pulldown-neck",
        symptomEn: "Sides of neck / upper traps feel tight",
        symptomZh: "脖子两侧（上斜方肌）很紧很酸",
        compensatedMuscles: ["trapezius"],
        investigateEn: ["Shrugging shoulders up toward ears at top or bottom", "Pulling bar behind the head", "Craning chin forward to meet the bar"],
        investigateZh: ["拉到底或放回时耸肩", "把横杆拉到脖子后面", "脖子前探去迎合横杆"],
        causesEn: ["Neck muscles tighten when shoulders elevate or the chin juts forward to finish the rep."],
        causesZh: ["拉不下去了就仰头伸脖子去凑横杆，或者肩膀没沉住往上顶，都会让斜方肌僵硬。"],
        correctionsEn: ["Pull strictly in front of your face to upper chest.", "Keep neck tall and chin tucked slightly.", "Stop lowering once shoulders start rolling forward/up."],
        correctionsZh: ["只拉到胸前锁骨，绝不拉到头后面。", "头保持中立，不要伸脖子去够杆。", "感觉到肩膀要往前翻或往上顶时就停住，别硬拉太低。"],
        practiceEn: "Try 8 light reps stopping cleanly at chin/collarbone height with neck relaxed.",
        practiceZh: "用轻重量做 8 次，只拉到下巴下方锁骨高度就停，保持脖子完全放松。",
        retestEn: ["Is your neck noticeably looser during the pull?"],
        retestZh: ["下拉过程中脖子两侧是不是放松很多？"],
      },
    ],
  }),
  ex({
    id: "seated-cable-row",
    libraryId: "seated-row",
    category: "back",
    nameEn: "Seated Cable Row",
    nameZh: "坐姿划船",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["trapezius", "biceps", "back-deltoids"],
    primaryLabelEn: "Lats & middle back (rhomboids, mid-traps)",
    primaryLabelZh: "背阔肌与中背部（菱形肌、中斜方肌）",
    secondaryLabelEn: "Biceps, forearms, rear deltoids",
    secondaryLabelZh: "肱二头肌、前臂、三角肌后束",
    stabilizersEn: "Spinal erectors, core, hip stabilizers",
    stabilizersZh: "竖脊肌、核心、髋部稳定",
    normalFeelEn: "Depending on elbow angle: elbows tucked close works lats/side-back; elbows slightly wider works between shoulder blades.",
    normalFeelZh: "手肘贴身拉向肚脐偏练背阔（中背两侧）；手肘稍张开 45° 拉向胸下偏练肩胛骨中间。",
    beginnerTensionEn: "Lower back aching from rocking back and forth, or upper neck tightening from shrugging.",
    beginnerTensionZh: "身体前后像划龙舟一样大幅晃动导致腰酸，或者耸肩拉导致脖子紧。",
    burnNoteEn: "Different handles and elbow paths shift emphasis between lats and mid-back—both are valid back work.",
    burnNoteZh: "不同把手和手肘路径会改变背阔肌和中背的发力比例，不用强求所有划船都只在一个点酸。",
    warningSignsEn: "Lower back sharp pain from rounding spine or leaning far back.",
    warningSignsZh: "弓背或大幅后仰引起的腰部尖锐疼痛。",
    techniqueRulesEn: [
      "Sit tall with knees slightly bent; keep torso upright with minimal sway.",
      "Keep shoulders relaxed down away from ears.",
      "Pull elbows past your ribs toward belly button/lower ribs; pause 1 sec.",
      "Let shoulder blades glide gently forward on the return without rounding lower back.",
    ],
    techniqueRulesZh: [
      "坐直挺胸，膝盖微弯不锁死，上身稳住不要前后大幅甩动。",
      "全程沉肩，不要耸着肩膀往后拉。",
      "手肘贴近身体往后拉向肚脐方向，终点把两边肩胛骨轻夹一下停 1 秒。",
      "放回时手臂和肩胛骨往前送出，但腰背保持直立不弓腰。",
    ],
    compensations: [
      {
        id: "seated-row-swing-shrug",
        symptomEn: "Lower back tires, torso swings, or shoulders shrug",
        symptomZh: "腰先酸、身体跟着前后晃，或总是耸肩",
        compensatedMuscles: ["lower-back", "trapezius", "biceps"],
        investigateEn: [
          "Whether the shoulders are shrugging",
          "Whether the torso is swinging backward to use momentum",
          "Whether elbows are moving smoothly or over-retracting shoulder blades into a shrug",
          "Excessive weight",
        ],
        investigateZh: [
          "拉的时候有没有耸肩",
          "上半身有没有往后甩借力",
          "是否过度用力往后挤肩胛骨导致顺带耸肩",
          "配重是否过重",
        ],
        causesEn: [
          "Heavy weight forces the hips and lower back to swing backward to start the pull.",
          "Trying to squeeze the shoulder blades up instead of back/down triggers upper-trap shrugging.",
        ],
        causesZh: [
          "重量太大拉不动时，身体本能用后仰摆腰来把重量甩起来。",
          "为了夹背而把肩膀一起往上提，导致上斜方肌和脖子代偿。",
        ],
        correctionsEn: [
          "Reduce weight so your torso stays nearly vertical throughout.",
          "Lead with the elbows gliding past your waist, not pulling with your hands.",
          "Think 'pull shoulder blades back toward your pockets', not up toward your ears.",
        ],
        correctionsZh: [
          "减重到上身不用往后仰也能稳稳拉回来。",
          "想象用两只手肘去撞身后的墙，手臂当挂钩。",
          "夹背时想着「把肩胛骨往后下方（裤袋）收」，不要往上耸。",
        ],
        practiceEn: "Try 10 light reps keeping your torso frozen upright like a statue.",
        practiceZh: "调轻一档，把上身想象成一根固定在垫子上的柱子完全不动，慢拉 10 次。",
        retestEn: ["Did the lower-back ache disappear?", "Are your shoulders staying low and relaxed?"],
        retestZh: ["腰部酸胀感有没有消失？", "拉到后面时肩膀是不是能保持放低？"],
      },
    ],
  }),
  ex({
    id: "chest-supported-row",
    libraryId: "chest-supported-row",
    category: "back",
    nameEn: "Chest Supported Row",
    nameZh: "俯身胸靠垫划船",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["back-deltoids", "biceps", "trapezius"],
    primaryLabelEn: "Mid-back (rhomboids, mid-traps) & lats",
    primaryLabelZh: "中背肌群与背阔肌",
    secondaryLabelEn: "Rear deltoids, biceps, forearms",
    secondaryLabelZh: "三角肌后束、二头肌、前臂",
    stabilizersEn: "Lower traps, core against bench",
    stabilizersZh: "下斜方肌、核心贴垫稳定",
    normalFeelEn: "Pure upper- and mid-back contraction without lower back stress.",
    normalFeelZh: "因为胸口被凳子撑住，能非常干净地感觉到背部中间和两侧发力，腰几乎不累。",
    beginnerTensionEn: "Upper neck tightening if lifting chest off the pad or shrugging.",
    beginnerTensionZh: "拉的时候胸口抬离靠垫仰头，导致脖子后侧和上斜方肌发紧。",
    burnNoteEn: "One of the best beginner back movements because the pad removes lower-back momentum.",
    burnNoteZh: "对新手最友好的练背动作之一，靠垫帮腰部省去了一半稳定负担。",
    warningSignsEn: "Rib/sternum discomfort from pressing too hard, or neck stiffness.",
    warningSignsZh: "胸口压太死呼吸不畅，或抬头仰脖导致脖子僵硬。",
    techniqueRulesEn: [
      "Keep chest glued to the 30–45° incline pad.",
      "Keep neck neutral (look slightly down along the bench).",
      "Pull elbows toward hips and pause 1 second at top.",
    ],
    techniqueRulesZh: [
      "全程把胸口贴在 30–45° 斜凳垫子上，不要借力抬胸。",
      "眼睛斜看地面，脖子别仰起来。",
      "先沉肩，手肘往裤兜方向拉，顶端夹背停 1 秒。",
    ],
    compensations: [
      {
        id: "csr-chest-lift",
        symptomEn: "Chest lifts off pad, neck tightens, or arms tire first",
        symptomZh: "拉的时候胸离开靠垫、脖子紧，或者手臂先酸",
        compensatedMuscles: ["trapezius", "biceps", "lower-back"],
        investigateEn: ["Chest lifting off pad at peak", "Pulling dumbbells straight toward chest/armpits instead of hips", "Too heavy"],
        investigateZh: ["拉起来时胸口离开垫子借力", "哑铃直直往胸口拉导致手肘外张耸肩", "重量过大"],
        causesEn: ["Excessive load makes you extend your spine off the pad and curl with the arms."],
        causesZh: ["哑铃太重时，身体会用挺腰抬胸和猛弯手肘来硬扯上去。"],
        correctionsEn: ["Keep sternum touching the bench the whole set.", "Drive elbows back toward your pockets.", "Lighten dumbbells and slow down the lowering phase."],
        correctionsZh: ["规定自己胸骨全程不能离开垫子。", "把哑铃向着腰部两侧画弧线拉，而不是直上直下往腋窝拉。", "降轻哑铃，慢放 2–3 秒。"],
        practiceEn: "10 slow reps with light dumbbells keeping chin tucked and chest glued to pad.",
        practiceZh: "用轻哑铃做 10 次，下巴微收、胸口全程贴紧垫子不离开。",
        retestEn: ["Do you feel stronger engagement between your shoulder blades or side back?"],
        retestZh: ["肩胛骨中间或背两侧是不是更容易找准发力感了？"],
      },
    ],
  }),
  ex({
    id: "db-row",
    libraryId: "db-row",
    category: "back",
    nameEn: "Dumbbell Row",
    nameZh: "单臂哑铃划船",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["biceps", "back-deltoids", "trapezius"],
    primaryLabelEn: "Latissimus dorsi & mid-back (unilateral)",
    primaryLabelZh: "单侧背阔肌与中背",
    secondaryLabelEn: "Biceps, rear deltoids, rhomboids",
    secondaryLabelZh: "二头肌、后肩、菱形肌",
    stabilizersEn: "Core anti-rotation muscles, glutes, supporting arm/shoulder",
    stabilizersZh: "核心抗旋转肌群、臀部、支撑侧手臂与肩部",
    normalFeelEn: "Clear squeeze along the side of the working back; great for noticing left vs. right differences.",
    normalFeelZh: "拉的那一侧腋下后方到背部侧面发力非常明显，非常适合排查左右背力量的差距。",
    beginnerTensionEn: "Twisting torso to heave the weight, or supporting wrist/shoulder getting tired.",
    beginnerTensionZh: "拉的时候像拧麻花一样扭转上半身，或者支撑手腕/肩膀比拉的那边还累。",
    burnNoteEn: "Feeling mild stretch on the working side when reaching slightly forward at the bottom is good—avoid rounding the lower back.",
    burnNoteZh: "放到底时同侧背部有被拉长感是好事，但下背要保持像桌面一样平。",
    warningSignsEn: "Lower back twisting pain or pinching in the supporting shoulder.",
    warningSignsZh: "扭腰引起的下背刺痛，或支撑手那一侧肩膀顶着疼。",
    techniqueRulesEn: [
      "Support with one hand and knee on bench (or tripod stance); keep back flat like a table.",
      "Pull dumbbell in a slight arc back toward your hip pocket, not straight up to your chest.",
      "Keep hips and shoulders square to the floor—don't twist open.",
    ],
    techniqueRulesZh: [
      "一手一膝撑凳（或俯身扶凳），背部放平像一张桌子。",
      "哑铃往「裤子口袋」方向画小弧线拉，不要垂直往上拉向胸口。",
      "肩膀和胯保持平行地面，不要为了拉更高而扭身子。",
    ],
    compensations: [
      {
        id: "db-row-twist",
        symptomEn: "Twisting torso, pulling into biceps, or one side feels much weaker",
        symptomZh: "身体跟着扭转、手臂弯举借力，或左右背感觉差很多",
        compensatedMuscles: ["biceps", "lower-back", "trapezius"],
        investigateEn: ["Pulling path (toward chest vs hip)", "Torso rotation", "Left vs right rep/ROM comparison"],
        investigateZh: ["拉铃路径（往胸口拉还是往裤兜拉）", "躯干有没有跟着转", "左右手行程与控制力对比"],
        causesEn: ["Pulling vertically toward the chest bends the elbow tightly and forces bicep dominance.", "Rotating the chest open uses momentum instead of lats."],
        causesZh: ["垂直往胸口拉会让手肘夹太死变成二头弯举。", "甩肩扭身借力会掩盖真实背力，也容易造成左右发力不均。"],
        correctionsEn: ["Sweep the dumbbell back toward your hip/pocket.", "Start every set with your weaker/less-connected side and match reps on the stronger side.", "Keep chest parallel to the floor throughout."],
        correctionsZh: ["把动作想象成「把手肘往屁股后方扫过去」。", "总是先练感觉更弱、更难找发力的那一侧，较强侧只做相同的次数（Part 9 左右平衡原则）。", "胸口全程朝向正下方，不翻身。"],
        practiceEn: "Start with the weaker side for 10 slow reps with a lighter dumbbell, pausing 1 second near the hip.",
        practiceZh: "先用较弱那一侧拿轻一点的哑铃做 10 次，拉到裤兜旁停 1 秒，再做强侧相同次数。",
        retestEn: ["Can you keep your torso level without twisting?", "Do both sides feel more evenly matched?"],
        retestZh: ["躯干能不能稳住不扭？", "先练弱侧后左右两边的发力感有没有更接近？"],
      },
    ],
  }),
  ex({
    id: "straight-arm-pulldown",
    libraryId: "straight-arm-pulldown",
    category: "back",
    nameEn: "Straight Arm Pulldown",
    nameZh: "直臂下压",
    primaryMuscles: ["upper-back"],
    secondaryMuscles: ["triceps", "back-deltoids"],
    primaryLabelEn: "Latissimus dorsi (isolates lats without biceps)",
    primaryLabelZh: "背阔肌（隔离二头肌、专注练背）",
    secondaryLabelEn: "Triceps long head, rear delts, abs",
    secondaryLabelZh: "三头肌长头、后肩、核心腹肌",
    stabilizersEn: "Core, lower traps, serratus",
    stabilizersZh: "核心、下斜方肌、前锯肌",
    normalFeelEn: "Clean tension under the armpit and down the side of the back while arms stay nearly straight.",
    normalFeelZh: "因为手肘几乎不弯，二头肌帮不上忙，腋下后方到背部两侧会立刻有非常清晰的发力感。",
    beginnerTensionEn: "Back of arms (triceps) working hard if pushing down by bending/unbending elbows, or upper traps if shoulders lift up.",
    beginnerTensionZh: "手肘一弯一伸就变成三头下压；肩膀没沉住往上抬就会觉得脖子紧。",
    burnNoteEn: "Fantastic teaching drill before Lat Pulldown to learn what engaging the side of your back actually feels like.",
    burnNoteZh: "非常适合放在高位下拉前当热身，帮你先认识「背阔肌收缩到底是什么感觉」。",
    warningSignsEn: "Lower back arching at the bottom or shoulder pinching when reaching too high.",
    warningSignsZh: "压到底时跟着挺肚子塌腰，或手臂抬太高超过头顶引起肩卡痛。",
    techniqueRulesEn: [
      "Hinge slightly at the hips (about 20–30°), keep back flat.",
      "Lock a tiny 10–15° bend in your elbows—do not bend and straighten during the rep.",
      "Sweep the bar/rope in an arc down to your thighs, squeezing under the armpits.",
    ],
    techniqueRulesZh: [
      "髋部微微后推前倾 20–30°，腰背打直、核心收紧。",
      "手肘保持微微弯曲 10–15° 锁住角度，全程不屈伸。",
      "像把水往大腿方向扫一样画弧线压到大腿前侧，夹紧腋下。",
    ],
    compensations: [
      {
        id: "sap-triceps",
        symptomEn: "Feel back of arms (triceps) or abs more than lats",
        symptomZh: "感觉大臂后侧（三头）或肚子在用力，背没感觉",
        compensatedMuscles: ["triceps", "abs", "trapezius"],
        investigateEn: ["Elbows bending at the top and straightening at the bottom", "Standing too close to the pulley", "Too heavy causing crunching with abs"],
        investigateZh: ["手肘在上半段弯曲、压下来时才伸直（变成了三头下压）", "站得离龙门架太近", "太重导致用弯腰收腹往下砸"],
        causesEn: ["Changing elbow angle turns the movement into a triceps pushdown."],
        causesZh: ["只要手肘角度在变，发力就会立刻变成肱三头肌下压。"],
        correctionsEn: ["Step one foot back so tension exists at the top.", "Freeze your elbow angle from start to finish.", "Lighten the stack and think 'squeeze armpits down'."],
        correctionsZh: ["往后退一大步，让手臂在斜前方就开始受力。", "全程锁死手肘的微弯角度，把它当成木棍。", "调轻重量，想着把腋窝往下夹紧。"],
        practiceEn: "12 slow light reps holding a 1-second armpit squeeze when the bar touches your thighs.",
        practiceZh: "调轻重量做 12 次，杆碰到大腿时停 1 秒用力夹紧腋下。",
        retestEn: ["Did triceps tension drop?", "Can you feel the area right under your armpits working?"],
        retestZh: ["大臂后侧还抢戏吗？", "腋窝后下方是不是明显发紧了？"],
      },
    ],
  }),
  ex({
    id: "rear-delt-fly",
    libraryId: "rear-delt-fly",
    category: "back",
    nameEn: "Rear Delt Fly",
    nameZh: "俯身/器械后束飞鸟",
    primaryMuscles: ["back-deltoids"],
    secondaryMuscles: ["trapezius", "upper-back"],
    primaryLabelEn: "Posterior deltoids (rear shoulder)",
    primaryLabelZh: "三角肌后束（肩膀后侧）",
    secondaryLabelEn: "Middle trapezius, rhomboids",
    secondaryLabelZh: "中斜方肌、菱形肌",
    stabilizersEn: "Rotator cuff, core/hip hinge",
    stabilizersZh: "肩袖肌群、核心稳定",
    normalFeelEn: "Localized fatigue on the back edge of the shoulders (behind the shoulder cap).",
    normalFeelZh: "肩膀后方外缘（后肩）局部发酸，不会连累脖子。",
    beginnerTensionEn: "Upper traps (neck) or mid-back taking over when using heavy weights and squeezing shoulder blades aggressively.",
    beginnerTensionZh: "重量太重或拼命往后夹肩胛骨，变成整片上背和脖子在硬扛。",
    burnNoteEn: "Rear delts are small muscles—very light weights (1–3 kg dumbbells or lowest machine pin) often work much better than heavy weights.",
    burnNoteZh: "后束是很小的肌肉，拿 1–3 公斤小哑铃或机器最轻一格往往比大重量练得准得多。",
    warningSignsEn: "Neck stiffness or sharp pinching inside the shoulder.",
    warningSignsZh: "脖子僵硬疼痛，或肩关节里面刺痛。",
    techniqueRulesEn: [
      "Use very light weight so you don't have to swing.",
      "Push hands outward toward opposite walls rather than pulling straight backward.",
      "Keep shoulders down away from ears; stop arms at torso line.",
    ],
    techniqueRulesZh: [
      "一定用很轻的重量，绝不用甩。",
      "想着「把双手向左右两边远处的墙推开」，而不是往后上方硬拉。",
      "全程沉肩放松脖子，手臂打开到与身体成一字就停。",
    ],
    compensations: [
      {
        id: "rear-delt-traps",
        symptomEn: "Neck/upper traps hurt or mid-back takes all the load",
        symptomZh: "脖子两侧和斜方肌酸，后肩没感觉",
        compensatedMuscles: ["trapezius", "upper-back"],
        investigateEn: ["Weight too heavy", "Shrugging upward", "Excessively pinching shoulder blades together instead of sweeping arms wide"],
        investigateZh: ["重量偏重", "发力时耸肩", "过度夹紧肩胛骨而不是把手臂向两侧画弧推开"],
        causesEn: ["Heavy resistance recruits the stronger upper traps and rhomboids to move the arm."],
        causesZh: ["重量一旦超过后束能承受的范围，大肌肉斜方肌和菱形肌就会立刻接管动作。"],
        correctionsEn: ["Drop weight by half.", "Think 'sweep knuckles outward to the walls', not 'pinch shoulder blades'.", "Keep neck relaxed and chin tucked."],
        correctionsZh: ["重量直接减半（甚至用 1–2 kg 哑铃）。", "把意念改成「把手背往左右两侧墙壁延伸画大弧线」，先别拼命往中间夹肩胛骨。", "沉肩、放松脖子。"],
        practiceEn: "Try 12 ultra-light reps pushing hands outward without shrugging.",
        practiceZh: "换极轻的重量，做 12 次，只想着把手臂向左右画弧打开，脖子完全不用力。",
        retestEn: ["Do you feel small localized fatigue right behind the shoulder cap?"],
        retestZh: ["肩膀后外侧那块小肌肉有没有开始单独发酸了？"],
      },
    ],
  }),
  ex({
    id: "y-raise",
    libraryId: "prone-ytw",
    category: "back",
    nameEn: "Y Raise",
    nameZh: "俯卧 Y 字平举",
    primaryMuscles: ["upper-back", "back-deltoids"],
    secondaryMuscles: ["trapezius"],
    primaryLabelEn: "Lower trapezius, rear deltoids & rotator cuff",
    primaryLabelZh: "下斜方肌、三角肌后束与肩袖稳定肌",
    secondaryLabelEn: "Mid-trapezius, spinal stabilizers",
    secondaryLabelZh: "中斜方肌、竖脊肌稳定",
    stabilizersEn: "Core, glutes",
    stabilizersZh: "核心、臀肌",
    normalFeelEn: "Warm activation between and slightly below the shoulder blades (mid-to-lower upper back), NOT at the sides of the neck.",
    normalFeelZh: "两片肩胛骨偏下方的中上背有温热发紧感，用来对抗圆肩非常有效。",
    beginnerTensionEn: "Sides of the neck (upper traps) cramping up if trying to lift arms too high or using heavy dumbbells.",
    beginnerTensionZh: "重量太重或拼命往高处抬，导致脖子两侧斜方肌抽紧。",
    burnNoteEn: "Bodyweight or 1 kg is plenty! Lower traps are endurance posture muscles, not max-strength muscles.",
    burnNoteZh: "徒手或 1 公斤就已经足够，这是调整体态和肩胛控制的精准动作，不需要追求大重量。",
    warningSignsEn: "Pinching at top of shoulder joint or lower-back arching.",
    warningSignsZh: "肩膀顶端挤压刺痛，或靠猛挺腰来抬高手臂。",
    techniqueRulesEn: [
      "Lie chest-down on mat or 30° incline bench; thumbs pointing up.",
      "Slide shoulder blades down toward pockets before lifting arms into a Y shape (~135°).",
      "Lift smoothly a few inches, hold 1–2 seconds without shrugging.",
    ],
    techniqueRulesZh: [
      "趴在垫子或 30° 上斜凳上，大拇指朝天花板。",
      "抬手前先把肩膀远离耳朵往下沉，再把双臂斜向前上方举成 Y 字。",
      "抬到差不多和躯干成一条斜线就停 1–2 秒，绝不借腰和耸肩。",
    ],
    compensations: [
      {
        id: "y-raise-neck",
        symptomEn: "Neck/upper traps get tight or lower back aches",
        symptomZh: "脖子两侧紧绷或者后腰代偿发酸",
        compensatedMuscles: ["trapezius", "lower-back"],
        investigateEn: ["Using dumbbells that are too heavy", "Arms lifting straight overhead instead of 45° Y angle", "Arching chest off bench/mat"],
        investigateZh: ["拿了太重的哑铃", "手臂举太窄靠耳朵太近", "靠仰头挺腰抬起来"],
        causesEn: ["Heavy weight or tight shoulders makes the upper traps shrug up to gain clearance."],
        causesZh: ["重量过重或肩膀活动度不够时，身体会用耸肩和挺腰强行抬高手臂。"],
        correctionsEn: ["Drop dumbbells completely and practice bodyweight first.", "Keep forehead resting on a rolled towel or bench top.", "Raise arms only to ear level, pausing 2 seconds."],
        correctionsZh: ["先把哑铃放下来，纯粹徒手练。", "额头轻抵毛巾或看正下方，不要抬头。", "抬到和耳朵差不多高停住 2 秒即可，感受肩胛骨下方微酸。"],
        practiceEn: "10 bodyweight Y-raises with thumbs up and forehead relaxed on the floor/bench.",
        practiceZh: "徒手做 10 次慢速 Y 字抬起，大拇指朝上、脖子完全放松。",
        retestEn: ["Does the neck stay relaxed while the lower shoulder-blade area engages?"],
        retestZh: ["脖子是不是彻底松下来了，肩胛骨中下方有轻微发力感？"],
      },
    ],
  }),

  // ═══════════════ SHOULDERS (4) ═══════════════
  ex({
    id: "lateral-raise",
    libraryId: "lateral-raise",
    category: "shoulders",
    nameEn: "Lateral Raise",
    nameZh: "哑铃侧平举",
    primaryMuscles: ["front-deltoids"],
    secondaryMuscles: ["trapezius"],
    primaryLabelEn: "Lateral deltoid (outer shoulder)",
    primaryLabelZh: "三角肌中束（肩膀外侧）",
    secondaryLabelEn: "Supraspinatus, upper trapezius & shoulder stabilizers",
    secondaryLabelZh: "冈上肌、上斜方肌及肩袖稳定肌群",
    stabilizersEn: "Forearms, core, serratus anterior",
    stabilizersZh: "前臂、核心、前锯肌",
    normalFeelEn: "Targeted tightening or mild burning right on the outer cap of the shoulder.",
    normalFeelZh: "肩膀最外侧的圆弧位置（三角肌中束）感到发酸发胀。",
    beginnerTensionEn: "Sides of the neck (upper trapezius) burning out first when shrugging or swinging heavy dumbbells.",
    beginnerTensionZh: "脖子两侧（上斜方肌）先酸爆——新手最常见的代偿问题。",
    burnNoteEn: "Lateral delts are small; 2–5 kg dumbbells lifted cleanly with control stimulate them effectively even without extreme burn.",
    burnNoteZh: "中束不需要大重量，拿 2–5 kg 控制好轨迹就能练得非常充分。",
    warningSignsEn: "Pinching or clicking inside the top of the shoulder joint (especially with thumbs pointing down).",
    warningSignsZh: "抬起时肩膀深处卡顿或刺痛（特别是做成「倒水动作」大拇指朝下时）。",
    techniqueRulesEn: [
      "Relax neck and keep shoulders down before starting.",
      "Raise arms in a slightly forward plane (~20–30° forward of your torso, the scapular plane), not straight behind.",
      "Lead gently with elbows/pinkies slightly neutral—avoid pouring-water internal rotation.",
      "Stop at shoulder height and lower slowly (2–3 seconds).",
    ],
    techniqueRulesZh: [
      "开始前先放松脖子、把肩膀自然往下沉。",
      "手臂不是纯正侧面，而是「往斜前方大约 20–30 度」的方向抬起，肩关节最舒服。",
      "小拇指不要刻意高过头顶像倒水一样内旋，保持手心大致朝下或微前倾。",
      "抬到跟肩膀差不多高就停，用 2–3 秒慢慢放下来。",
    ],
    compensations: [
      {
        id: "lateral-raise-neck",
        symptomEn: "Sides of neck / upper traps become very tired",
        symptomZh: "脖子两侧（上斜方肌）特别累、特别酸",
        compensatedMuscles: ["trapezius"],
        investigateEn: [
          "Are they shrugging their shoulders?",
          "Is the dumbbell too heavy?",
          "Are they raising their arms too high?",
          "Are they losing control of the movement?",
          "Are they initiating the movement by elevating their shoulders?",
        ],
        investigateZh: [
          "抬哑铃时肩膀有没有跟着往上顶（耸肩）？",
          "哑铃是不是太重了？",
          "是不是举得太高（超过肩膀）？",
          "是不是在用惯性甩、下放没控制住？",
          "是不是起步第一下先耸肩再抬手臂？",
        ],
        causesEn: [
          "The upper trapezius assists scapular elevation and takes over when you initiate with a shrug, swing heavy weights, or lift arms above shoulder height.",
        ],
        causesZh: [
          "上斜方肌负责把肩膀往上提。一旦重量太重、起步先耸肩，或者抬得高于肩膀，它就会主动接管发力导致脖子酸。",
        ],
        correctionsEn: [
          "Reduce the dumbbell weight.",
          "Keep the neck relaxed and avoid intentionally shrugging.",
          "Raise the arms in a comfortable slightly forward plane (about 20–30° in front of your body).",
          "Lead by pushing your hands outward toward the walls—not upward toward the ceiling—and control the lowering phase.",
        ],
        correctionsZh: [
          "换更轻的哑铃（比如降到 2–4 kg 先找感觉）。",
          "放松脖子，全程提醒自己「肩膀离耳朵远一点」，起步不许耸肩。",
          "把手臂抬在身体斜前方 20–30° 的舒适平面，想着「把手往左右两边远处的墙推开」，而不是往上举。",
          "只抬到肩膀高度（或稍微低一点的舒适范围），用 2–3 秒慢慢放下。",
        ],
        practiceEn: "Try 10 slow repetitions with very light dumbbells (or even water bottles), pausing 1 second at shoulder height without shrugging.",
        practiceZh: "换非常轻的哑铃（甚至两瓶矿泉水）做 10 次慢速侧平举，举到肩高停 1 秒，检查肩膀有没有往上耸。",
        retestEn: [
          "Does the movement feel more controlled?",
          "Is the neck less tense?",
          "Can you perform the movement without shrugging?",
        ],
        retestZh: [
          "动作是不是感觉更受控制了？",
          "脖子两侧是不是没那么紧了？",
          "全程能不能在不耸肩的情况下抬起来？",
        ],
      },
    ],
  }),
  ex({
    id: "front-raise",
    libraryId: "front-raise",
    category: "shoulders",
    nameEn: "Front Raise",
    nameZh: "哑铃前平举",
    primaryMuscles: ["front-deltoids"],
    secondaryMuscles: ["chest", "trapezius"],
    primaryLabelEn: "Anterior deltoid (front shoulder)",
    primaryLabelZh: "三角肌前束（肩膀前侧）",
    secondaryLabelEn: "Upper chest (clavicular pecs), upper traps (stabilizing)",
    secondaryLabelZh: "上胸、上斜方肌（稳定）",
    stabilizersEn: "Core, forearms",
    stabilizersZh: "核心、前臂",
    normalFeelEn: "Fatigue right across the front of the shoulder without lower-back swing.",
    normalFeelZh: "肩膀正前侧发酸，身体站稳不晃。",
    beginnerTensionEn: "Lower back arching/leaning back to heave the weights up, or neck tensing.",
    beginnerTensionZh: "太重导致身体往后仰着甩起来，腰和脖子跟着累。",
    burnNoteEn: "Front delts already get lots of work in chest presses and shoulder presses—keep front raises light and controlled.",
    burnNoteZh: "前束平时推胸和推举都会练到，做前平举不需要太重，动作稳比重量重要。",
    warningSignsEn: "Pinching inside front shoulder joint or lower back pain from leaning backward.",
    warningSignsZh: "肩前侧关节里面卡痛，或后仰借力导致的腰痛。",
    techniqueRulesEn: [
      "Stand tall with abs braced; no hip thrust or back lean.",
      "Raise dumbbells in front to shoulder height—no higher.",
      "Lower slowly without letting weights bounce off thighs.",
    ],
    techniqueRulesZh: [
      "站直收紧肚子，身体不要往后仰借力。",
      "向正前方抬到与肩同高即可，不用抬太高。",
      "慢慢放回大腿前方，不要往下砸。",
    ],
    compensations: [
      {
        id: "front-raise-lean",
        symptomEn: "Lower back aches or neck gets tight when lifting",
        symptomZh: "腰部发酸或者脖子很紧",
        compensatedMuscles: ["lower-back", "trapezius"],
        investigateEn: ["Torso leaning backward on lift", "Weight too heavy", "Raising above shoulder height"],
        investigateZh: ["抬起来时身体有没有往后仰", "重量是不是太重", "手臂是否举过头顶"],
        causesEn: ["Excessive dumbbell weight forces hip/lumbar extension momentum and shoulder shrugging."],
        causesZh: ["重量太重时只能靠后仰挺腰甩上去，同时肩膀耸起拉扯脖子。"],
        correctionsEn: ["Drop dumbbell weight or alternate one arm at a time.", "Stand with back gently touching a wall to prevent leaning.", "Stop right at shoulder height."],
        correctionsZh: ["减轻哑铃重量，或改成左右手交替抬起。", "试着背轻轻靠墙站着做，防止身体后仰借力。", "抬到肩膀高度就停下慢放。"],
        practiceEn: "Try 10 alternating slow reps with lighter dumbbells while keeping ribs stacked over hips.",
        practiceZh: "用轻哑铃左右交替各做 10 次，保持肋骨对准骨盆不后仰。",
        retestEn: ["Does your lower back stay neutral and calm?"],
        retestZh: ["腰部是不是不再跟着酸了？"],
      },
    ],
  }),
  ex({
    id: "shoulder-press",
    libraryId: "db-shoulder-press",
    category: "shoulders",
    nameEn: "Shoulder Press",
    nameZh: "坐姿哑铃/器械推举",
    primaryMuscles: ["front-deltoids"],
    secondaryMuscles: ["triceps", "trapezius"],
    primaryLabelEn: "Anterior & lateral deltoids",
    primaryLabelZh: "三角肌前束与中束",
    secondaryLabelEn: "Triceps, upper chest, trapezius (upward rotation)",
    secondaryLabelZh: "肱三头肌、上胸、斜方肌（辅助肩胛上回旋）",
    stabilizersEn: "Rotator cuff, core, spinal erectors",
    stabilizersZh: "肩袖肌群、核心、竖脊肌",
    normalFeelEn: "Front and side of the shoulders plus back of the arms working smoothly overhead.",
    normalFeelZh: "肩膀前外侧和大臂后侧一起发力往上推起，核心稳住背贴靠垫。",
    beginnerTensionEn: "Lower back arching forcefully off the backrest, or elbows flaring straight out behind the ears.",
    beginnerTensionZh: "推不动时下腰大幅弓起离开靠背，或手肘向正两侧掰得太靠后。",
    burnNoteEn: "Upper traps naturally help rotate the shoulder blade overhead—mild upper-back work is normal, cramping in the neck is not.",
    burnNoteZh: "手臂举过头时斜方肌本就会正常协助稳定肩胛骨，轻微发紧正常，但不应该像耸肩那样脖子抽筋。",
    warningSignsEn: "Sharp shoulder pinching overhead or lower-back pain.",
    warningSignsZh: "举过头时肩关节里面刺痛，或腰椎挤压疼痛。",
    techniqueRulesEn: [
      "Keep elbows slightly in front of your body (~30° forward of torso, not pulled straight back).",
      "Keep lower back neutral against the backrest with abs braced.",
      "Press smoothly upward from ear level without slamming weights together.",
    ],
    techniqueRulesZh: [
      "手肘不要掰到身体正侧面一字排开，而是略微朝前收约 30 度（看余光能看到手肘）。",
      "背贴靠垫、肚子微收，不大幅挺腰。",
      "从耳朵旁平稳推向正上方，顶端不锁死手肘。",
    ],
    compensations: [
      {
        id: "shoulder-press-arch",
        symptomEn: "Lower back hurts or shoulder clicks/pinches overhead",
        symptomZh: "推举时腰疼，或者肩膀上方卡住不舒服",
        compensatedMuscles: ["lower-back", "trapezius"],
        investigateEn: ["Lower back arching off bench", "Elbows flared behind torso plane", "Stiff upper back/shoulder overhead mobility"],
        investigateZh: ["腰有没有拱起来离开靠背", "手肘是否掰到耳后平面", "举手过头时是否原本就卡顿"],
        causesEn: ["Tight shoulders/thoracic spine or heavy weights cause lumbar hyperextension to push vertically."],
        causesZh: ["重量太重或胸椎/肩关节较紧时，身体会靠大幅挺腰变成「斜卧推」来借力。"],
        correctionsEn: ["Slightly lower backrest one notch (~75–80°) instead of rigid 90°.", "Tuck elbows slightly forward (scapular plane) so shoulders move smoothly.", "Keep ribs down and feet planted firmly."],
        correctionsZh: ["把靠背稍微往后放一格（约 75–80°）而不是死垂直 90°，肩膀和腰会舒服很多。", "手肘往身体前侧收一点（余光能看到哑铃）。", "脚踩实地面、微收肋骨不挺腰。"],
        practiceEn: "Try 8 light reps at a 75–80° bench angle with elbows slightly forward.",
        practiceZh: "把凳背放斜一格（约 75–80°），换轻哑铃把手肘往前收一点做 8 次。",
        retestEn: ["Did the shoulder pinch and lower-back arch ease up?"],
        retestZh: ["肩膀卡顿感和腰部拱起的感觉有没有明显改善？"],
      },
    ],
  }),
  ex({
    id: "reverse-fly",
    libraryId: "rear-delt-fly",
    category: "shoulders",
    nameEn: "Reverse Fly (Machine/Dumbbell)",
    nameZh: "反向飞鸟（器械/哑铃）",
    primaryMuscles: ["back-deltoids"],
    secondaryMuscles: ["upper-back", "trapezius"],
    primaryLabelEn: "Posterior deltoid",
    primaryLabelZh: "三角肌后束（后肩）",
    secondaryLabelEn: "Rhomboids, middle trapezius",
    secondaryLabelZh: "菱形肌、中斜方肌",
    stabilizersEn: "Rotator cuff, core",
    stabilizersZh: "肩袖肌群、核心",
    normalFeelEn: "Crisp burn/fatigue at the back of the shoulder cap.",
    normalFeelZh: "肩膀后侧局部发酸，体态更挺拔。",
    beginnerTensionEn: "Neck/traps taking over or elbows bending aggressively into a row.",
    beginnerTensionZh: "手肘越弯越多做成了划船，或者耸肩导致脖子累。",
    burnNoteEn: "Focusing on pushing the hands outward in an arc (not pulling back with elbows) isolates the rear delts cleanly.",
    burnNoteZh: "想着把手背向两侧划圆推开，比往后猛扯更容易找到后肩发力。",
    warningSignsEn: "Neck strain or front-shoulder pinching if machine seat/handles are too high.",
    warningSignsZh: "座椅太低导致把手偏高，容易拉扯脖子或前肩。",
    techniqueRulesEn: [
      "Adjust seat so handles are at shoulder height or slightly lower.",
      "Keep chest gently against pad without leaning back.",
      "Sweep arms wide with soft elbows—stop in line with torso.",
    ],
    techniqueRulesZh: [
      "蝴蝶机反坐时，把手调到和肩膀一样高或略低一点。",
      "胸口轻靠垫子，身体不往后仰。",
      "手肘微弯固定，把双手向两边打开到和身体成一字即可。",
    ],
    compensations: [
      {
        id: "reverse-fly-neck",
        symptomEn: "Neck gets tired or only mid-back/traps feel it",
        symptomZh: "脖子或斜方肌很累，后肩没感觉",
        compensatedMuscles: ["trapezius", "upper-back"],
        investigateEn: ["Seat height too low (arms raised too high)", "Shrugging shoulders", "Heavy stack"],
        investigateZh: ["座椅是不是太低（手抬得比肩高）", "动作中有没有耸肩", "重量是否过重"],
        causesEn: ["Hands positioned above shoulder level directly recruits the upper trapezius."],
        causesZh: ["把手高度高于肩膀时，每一把都在带动上斜方肌发力。"],
        correctionsEn: ["Raise the seat so handles align slightly below shoulder level.", "Relax neck and push handles wide rather than pinching shoulder blades.", "Use lighter weight for 12–15 controlled reps."],
        correctionsZh: ["调高座椅，让把手与肩膀平齐或略低一点。", "沉肩放松脖子，意念放在向左右两侧推开把手。", "降到能轻松控制 12–15 次的重量。"],
        practiceEn: "12 controlled light reps focusing on pushing hands outward at shoulder-or-lower height.",
        practiceZh: "调高座椅并降重，做 12 次慢速反飞鸟，保持手臂略低于肩。",
        retestEn: ["Is the neck strain gone and rear-shoulder sensation clearer?"],
        retestZh: ["脖子还紧吗？肩膀后侧是不是更容易找到酸胀感？"],
      },
    ],
  }),

  // ═══════════════ ARMS (4) ═══════════════
  ex({
    id: "bicep-curl",
    libraryId: "db-curl",
    category: "arms",
    nameEn: "Bicep Curl",
    nameZh: "哑铃弯举",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearm"],
    primaryLabelEn: "Biceps brachii (front of upper arm)",
    primaryLabelZh: "肱二头肌（大臂前侧）",
    secondaryLabelEn: "Brachialis & brachioradialis (forearm)",
    secondaryLabelZh: "肱肌、肱桡肌（小臂协助）",
    stabilizersEn: "Anterior deltoid, upper traps (postural), core",
    stabilizersZh: "前肩与斜方肌（保持体态）、核心",
    normalFeelEn: "Tightening and fatigue squarely on the front of the upper arm.",
    normalFeelZh: "大臂正前侧收紧发酸，手肘稳在身旁不动。",
    beginnerTensionEn: "Upper trapezius/neck fatigue from shrugging, forearms burning out from death-gripping, or lower back aching from swinging.",
    beginnerTensionZh: "肩膀耸起导致脖子两侧（上斜方肌）酸，或身体晃动腰酸、小臂先累。",
    burnNoteEn: "Forearms naturally feel some effort holding the weight, especially early on, while grip strength catches up.",
    burnNoteZh: "刚开始做时小臂握哑铃有点酸是正常的，抓握耐力很快会跟上来。",
    warningSignsEn: "Sharp pain inside the front of the shoulder or wrist joint pain.",
    warningSignsZh: "肩膀前侧肌腱刺痛或手腕弯折疼痛。",
    techniqueRulesEn: [
      "Pin elbows gently near your ribs—do not swing them forward/up excessively.",
      "Keep shoulders relaxed down; avoid elevating shoulders at the top.",
      "Keep wrists neutral (don't curl wrists inward) and stand tall without swinging.",
    ],
    techniqueRulesZh: [
      "大臂和手肘贴在身体两侧不动，像钉在肋骨旁。",
      "肩膀全程放松往下沉，举到顶端也别耸肩。",
      "手腕保持平直不要往内折，站稳不前后甩腰。",
    ],
    compensations: [
      {
        id: "bicep-curl-traps",
        symptomEn: "Upper trapezius (neck sides) or front shoulders get tired",
        symptomZh: "脖子两侧（上斜方肌）或肩膀前侧发酸",
        compensatedMuscles: ["trapezius", "front-deltoids", "lower-back"],
        investigateEn: [
          "Shoulder elevation (shrugging as you curl)",
          "Elbow movement (swinging elbows forward and lifting upper arm)",
          "Body swinging / hip momentum",
          "Excessive weight",
          "Unnecessary shoulder tension",
        ],
        investigateZh: [
          "弯举时肩膀有没有往上耸起",
          "手肘有没有离开身体往前上方抬起",
          "身体有没有前后晃动借力",
          "哑铃重量是不是偏重",
          "肩膀是否一直紧绷着没放松",
        ],
        causesEn: [
          "Excessive weight causes you to shrug the shoulders and swing the elbows forward so the front shoulder and upper traps help lift the weight.",
        ],
        causesZh: [
          "重量太重时，身体会不自觉先耸肩、甩手肘往前抬，用上斜方肌和前肩把哑铃「端」上去。",
        ],
        correctionsEn: [
          "Reduce dumbbell weight until you can curl with zero body swing.",
          "Relax shoulders down away from your ears before rep 1.",
          "Keep upper arms pinned along your ribs; bend only at the elbow.",
          "Try standing with your upper back lightly against a wall to stop swinging.",
        ],
        correctionsZh: [
          "换轻一级的哑铃，直到身体完全不用晃也能举起。",
          "做之前先刻意沉肩放松脖子。",
          "把大臂夹在肋骨两侧不动，只靠手肘弯曲把哑铃举起来。",
          "可以试试靠墙站立做弯举，防止甩腰借力。",
        ],
        practiceEn: "Stand with back against a wall and do 10 light curls keeping elbows touching your sides.",
        practiceZh: "背靠墙站好，用轻哑铃做 10 次慢速弯举，手肘全程贴住身体两侧不前移。",
        retestEn: ["Are your neck and shoulders staying relaxed?", "Do you feel more direct work in the front of your upper arms?"],
        retestZh: ["脖子和肩膀有没有放松下来？", "大臂前侧的发力感是不是更集中了？"],
      },
    ],
  }),
  ex({
    id: "hammer-curl",
    libraryId: "hammer-curl",
    category: "arms",
    nameEn: "Hammer Curl",
    nameZh: "锤式弯举",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearm"],
    primaryLabelEn: "Biceps, brachialis & brachioradialis",
    primaryLabelZh: "肱二头肌外侧、肱肌与前臂（肱桡肌）",
    secondaryLabelEn: "Forearm flexors",
    secondaryLabelZh: "前臂肌群",
    stabilizersEn: "Core, shoulder stabilizers",
    stabilizersZh: "核心、肩部稳定",
    normalFeelEn: "Work spread evenly across the outer upper arm and upper forearm—very comfortable on the wrists.",
    normalFeelZh: "大臂前外侧和小臂靠近手肘的一段同时发酸，手腕非常舒服。",
    beginnerTensionEn: "Swinging torso or shrugging shoulders when using too much weight.",
    beginnerTensionZh: "重量太重导致左右甩腰借力或耸肩。",
    burnNoteEn: "Feeling the outer forearm near the elbow is completely expected in hammer curls—that's the brachioradialis doing its job.",
    burnNoteZh: "做锤式弯举时小臂上段有点酸是很正常的，因为掌心相对本来就会练到小臂的肱桡肌。",
    warningSignsEn: "Elbow tendon pain or neck stiffness.",
    warningSignsZh: "手肘外侧肌腱刺痛或脖子僵硬。",
    techniqueRulesEn: [
      "Palms face each other like holding two hammers.",
      "Keep elbows fixed at sides, wrists straight.",
      "Lower all the way down slowly without bouncing.",
    ],
    techniqueRulesZh: [
      "掌心相对（像双手握着锤子），全程手腕不歪。",
      "手肘夹稳在身体两侧不动。",
      "放到底部时慢速控制，不要弹起。",
    ],
    compensations: [
      {
        id: "hammer-swing",
        symptomEn: "Body swinging or shoulders shrugging",
        symptomZh: "身体摇晃借力或肩膀发紧",
        compensatedMuscles: ["trapezius", "lower-back", "front-deltoids"],
        investigateEn: ["Heavy weight", "Alternating momentum twist", "Shrugging at top"],
        investigateZh: ["哑铃太重", "身体左右扭着甩上去", "举起时耸肩"],
        causesEn: ["Using momentum bypasses elbow flexors and stresses lower back and neck."],
        causesZh: ["哑铃过重时身体自然前后晃、耸肩甩铃。"],
        correctionsEn: ["Lighten dumbbells.", "Pause 1 second at the bottom before each rep so momentum can't help."],
        correctionsZh: ["减轻重量。", "每次放到最低点停顿 1 秒消掉惯性，再平稳弯举起来。"],
        practiceEn: "10 controlled reps with a 1-second dead-stop at the bottom.",
        practiceZh: "用轻重量做 10 次，每次放到底停 1 秒再举。",
        retestEn: ["Can you complete all reps with an upright, still torso?"],
        retestZh: ["身体能不能完全站稳不晃地做完？"],
      },
    ],
  }),
  ex({
    id: "triceps-pushdown",
    libraryId: "triceps-pushdown",
    category: "arms",
    nameEn: "Triceps Pushdown",
    nameZh: "绳索三头下压",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["forearm"],
    primaryLabelEn: "Triceps brachii (back of upper arm)",
    primaryLabelZh: "肱三头肌（大臂后侧）",
    secondaryLabelEn: "Forearms & core (stabilizing)",
    secondaryLabelZh: "前臂握力、核心稳定",
    stabilizersEn: "Latissimus dorsi & lower traps (keeping shoulders down)",
    stabilizersZh: "背阔肌与下斜方肌（保持沉肩稳定）",
    normalFeelEn: "Clear tightening along the back of the upper arm as elbows straighten.",
    normalFeelZh: "手肘伸直时大臂后侧明显收紧发酸。",
    beginnerTensionEn: "Front of shoulders or chest pushing down if elbows flare forward/back and you lean over the bar.",
    beginnerTensionZh: "手肘跟着前后跑、整个人压上去，导致肩膀前侧或肚子累，大臂后侧没感觉。",
    burnNoteEn: "Triceps responds well to clean elbow lockout control without snapping the joint.",
    burnNoteZh: "下压时在底部伸直停半秒感受收紧，不需要大重量猛压。",
    warningSignsEn: "Sharp pain right inside the tip of the elbow or wrist bending.",
    warningSignsZh: "手肘关节尖锐刺痛或手腕压折疼痛。",
    techniqueRulesEn: [
      "Pin elbows right by your ribs like hinges—only forearms move.",
      "Keep shoulders pressed down, torso slightly leaned forward (10°).",
      "Let hands come up only to chest height so tension stays on triceps.",
    ],
    techniqueRulesZh: [
      "大臂和手肘紧紧夹在身体两侧当「铰链」，只动小臂。",
      "沉肩、身体微前倾一点点稳住。",
      "放回时小臂回到胸口高度就好，不要让手肘跟着抬高。",
    ],
    compensations: [
      {
        id: "pushdown-shoulder",
        symptomEn: "Feel shoulders/chest or elbows hurting instead of back of arms",
        symptomZh: "感觉肩膀在压、或者手肘不舒服，大臂后侧没感觉",
        compensatedMuscles: ["front-deltoids", "chest", "trapezius"],
        investigateEn: ["Elbows flaring out or moving back and forth", "Leaning bodyweight over the cable", "Weight too heavy"],
        investigateZh: ["手肘有没有前后滑动或往外张", "是不是靠身体往下压借力", "重量是否过重"],
        causesEn: ["Moving the elbows turns the exercise into a shoulder-assisted press rather than elbow extension."],
        causesZh: ["只要手肘在移动，动作就变成了用肩膀和体重往下「按」重物，三头肌就偷懒了。"],
        correctionsEn: ["Drop 1–2 pins on the stack.", "Pin upper arms firmly to your sides—imagine squeezing a rolled towel under each armpit.", "Let rope/bar rise only to chest height."],
        correctionsZh: ["调轻 1–2 格重量。", "想象腋下各夹着一张纸不能掉，全程锁死大臂不动，只弯伸手肘。", "放回时手回到胸口高度就停，马上再往下压。"],
        practiceEn: "Try 12 light reps keeping upper arms glued to your ribs, pausing 1 second at lockout.",
        practiceZh: "调轻重量做 12 次，大臂全程贴死肋骨，压到底停 1 秒。",
        retestEn: ["Do elbows stay quiet while the back of the upper arms heats up?"],
        retestZh: ["手肘是不是稳住了，大臂后侧发力感变明显了吗？"],
      },
    ],
  }),
  ex({
    id: "overhead-triceps",
    libraryId: "overhead-triceps",
    category: "arms",
    nameEn: "Overhead Triceps Extension",
    nameZh: "过顶三头臂屈伸",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["abs"],
    primaryLabelEn: "Triceps (especially the long head on back of arm)",
    primaryLabelZh: "肱三头肌（尤其大臂后侧深处长头）",
    secondaryLabelEn: "Core & shoulder stabilizers",
    secondaryLabelZh: "核心与肩稳定肌",
    stabilizersEn: "Serratus anterior, lower traps",
    stabilizersZh: "前锯肌、下斜方肌",
    normalFeelEn: "Deep stretch along the back of the upper arm behind the head, then clean straightening overhead.",
    normalFeelZh: "哑铃降到头后时大臂后侧有明显拉伸感，伸直时后侧收紧。",
    beginnerTensionEn: "Lower back arching hard or elbows flaring wide and irritating the elbow joint.",
    beginnerTensionZh: "举过头时大幅挺腰，或者手肘往两边张开太多导致手肘别扭。",
    burnNoteEn: "Feeling a deep stretch near the armpit/back of arm at the bottom is great—that targets the long head of the triceps.",
    burnNoteZh: "降到头后面时大臂后侧靠腋下那一段有被拉开的感觉很正常，正是这个动作的优势。",
    warningSignsEn: "Sharp elbow joint pain or neck/shoulder impingement overhead.",
    warningSignsZh: "手肘关节尖锐痛，或双手举过头时脖子/肩膀卡痛。",
    techniqueRulesEn: [
      "Brace abs so ribs stay down and back doesn't arch.",
      "Keep elbows pointing roughly forward/upward near head—don't flare wide.",
      "Use a lighter dumbbell or cable so you don't hit your head or strain elbows.",
    ],
    techniqueRulesZh: [
      "坐稳后收紧肚子、肋骨下沉，不挺腰。",
      "大臂尽量靠近耳朵两侧朝上指，不要往左右张开太多。",
      "选轻一点的重量慢下慢上，控制好路径别碰头。",
    ],
    compensations: [
      {
        id: "overhead-tri-elbow",
        symptomEn: "Elbow discomfort, shoulder tightness, or lower back arching",
        symptomZh: "手肘不舒服、肩膀卡着，或腰一直在反弓",
        compensatedMuscles: ["lower-back", "trapezius", "front-deltoids"],
        investigateEn: ["Elbows flaring wide", "Tight overhead shoulder mobility", "Lower back arching to help press"],
        investigateZh: ["手肘是不是往左右撇开了", "手举过头原本就觉得紧", "是否挺着腰在做"],
        causesEn: ["Flaring elbows twists the elbow joint; stiff shoulders force lumbar arching."],
        causesZh: ["手肘外撇会给肘关节施加侧向剪切力；肩紧时挺腰借力会让下背酸。"],
        correctionsEn: ["Point elbows slightly forward (in your line of sight) rather than straight behind your ears.", "Use a seated backrest or lean slightly forward on a cable rope overhead extension.", "Reduce load or switch to cable rope pushdown if elbows still bother you."],
        correctionsZh: ["手肘稍微朝斜前方指一点（余光看得到），不必硬往后掰。", "使用有靠背的矮凳坐着做，或用龙门架绳索背对滑轮做过顶伸展。", "先降重慢做；若肘关节依然不适，可先换回绳索下压。"],
        practiceEn: "Try 10 light seated reps with elbows angled slightly forward and abs braced.",
        practiceZh: "靠背坐好、收紧肚子，拿轻哑铃让手肘略朝前做 10 次慢速屈伸。",
        retestEn: ["Did the elbow discomfort ease up?"],
        retestZh: ["手肘别扭的感觉有没有消退？"],
      },
    ],
  }),

  // ═══════════════ LEGS (8) ═══════════════
  ex({
    id: "squat",
    libraryId: "goblet-squat",
    category: "legs",
    nameEn: "Squat (Goblet / Bodyweight)",
    nameZh: "深蹲（高脚杯/徒手）",
    primaryMuscles: ["quadriceps", "gluteal"],
    secondaryMuscles: ["hamstring", "abs", "lower-back"],
    primaryLabelEn: "Quadriceps (front thigh) & glutes (buttocks)",
    primaryLabelZh: "股四头肌（大腿前侧）与臀大肌",
    secondaryLabelEn: "Adductors, hamstrings, core & spinal stabilizers",
    secondaryLabelZh: "大腿内侧、腘绳肌、核心与竖脊肌",
    stabilizersEn: "Ankle/foot muscles, gluteus medius",
    stabilizersZh: "足踝稳定肌、臀中肌",
    normalFeelEn: "Front of thighs and buttocks working hard as you sit down between your heels and stand tall.",
    normalFeelZh: "蹲下站起时大腿前侧和屁股一起发力，核心收紧稳住躯干。",
    beginnerTensionEn: "Heels lifting off floor, knees caving inward, or lower back rounding/aching.",
    beginnerTensionZh: "脚跟抬起、膝盖往里扣、膝盖周围发紧，或下腰弯着酸。",
    burnNoteEn: "Squats use many muscles at once—you may feel steady effort across thighs, glutes, and breathing rather than a localized burn in just one spot.",
    burnNoteZh: "深蹲是多肌群协作动作，通常是大腿和屁股一起觉得累并伴随着喘气，不一定只有某一点烧灼感。",
    warningSignsEn: "Sharp pain inside knees, hip crease pinching, or sharp lower-back pain.",
    warningSignsZh: "膝盖里面刺痛、大腿根（髋前）夹痛，或腰椎尖锐痛。",
    techniqueRulesEn: [
      "Stand slightly wider than hips, toes turned out slightly (15–30°).",
      "Keep entire foot (especially heels and big toe base) flat on the ground.",
      "Push knees gently out so they track directly over your middle toes—never cave inward.",
      "Sit hips down and back while keeping chest proud.",
    ],
    techniqueRulesZh: [
      "双脚略宽于肩，脚尖自然外展约 15–30 度。",
      "整个脚掌（尤其脚后跟）踩死地面，绝不垫脚尖。",
      "蹲下时膝盖始终顺着脚尖方向打开，绝不向内扣。",
      "屁股往后往下坐，挺胸保持背部平直。",
    ],
    compensations: [
      {
        id: "squat-knee-back",
        symptomEn: "Sides/front of knees feel uncomfortable or lower back aches",
        symptomZh: "膝盖周围不舒服或腰酸",
        compensatedMuscles: ["lower-back", "quadriceps"],
        investigateEn: [
          "Knees caving inward on descent or standing up",
          "Heels lifting off the ground (tight ankles)",
          "Leaning torso far forward instead of sitting hips down",
          "Going deeper than back/ankle mobility currently allows",
        ],
        investigateZh: [
          "膝盖在蹲下或站起时有没有往内扣？",
          "脚后跟有没有离开地面？",
          "是不是上半身往前趴太多、屁股没往下坐？",
          "是不是蹲到底时出现了骨盆翻转弯腰？",
        ],
        causesEn: [
          "Ankle stiffness lifts the heels and shifts pressure straight onto the knees.",
          "Knees caving inward puts uneven stress on the sides of the knees.",
          "Dropping chest forward shifts work from legs to lower back.",
        ],
        causesZh: [
          "脚踝太紧会让脚跟离地、重心前冲压迫膝盖。",
          "膝盖内扣会直接拉扯膝盖内外侧结构。",
          "上身过度前倾或蹲太深弯腰，压力就转到了下背部。",
        ],
        correctionsEn: [
          "Widen stance slightly and turn toes out 20–30°.",
          "Place small 1–2 cm plates/wedges under your heels if heels lift.",
          "Actively track knees outward over your 2nd/3rd toes.",
          "Squat down only as deep as your back stays flat—even sitting down onto a bench (box squat) is great practice.",
        ],
        correctionsZh: [
          "双脚站得稍宽一点，脚尖外展 20–30°，给髋部留出下蹲空间。",
          "如果脚跟会翘起，先在脚跟下垫两片薄杠铃片，并同时多做脚踝活动度练习。",
          "蹲起全程想着「把膝盖稍微往外撑开，对准第二三根脚趾」。",
          "先蹲到背能保持直立的深度（或在身后放个卧推凳轻触即起）。",
        ],
        practiceEn: "Try 8 bodyweight squats holding onto a rack or sitting lightly onto a bench, watching knees stay over toes.",
        practiceZh: "身后放一张卧推凳做 8 次徒手碰凳深蹲，确认脚跟踩稳、膝盖始终对准脚尖。",
        retestEn: ["Do knees track cleanly without side pressure?", "Does lower back stay comfortable?"],
        retestZh: ["膝盖两侧是不是舒服很多？", "腰还酸吗？"],
      },
    ],
  }),
  ex({
    id: "leg-press",
    libraryId: "leg-press",
    category: "legs",
    nameEn: "Leg Press",
    nameZh: "倒蹬腿举机",
    primaryMuscles: ["quadriceps", "gluteal"],
    secondaryMuscles: ["hamstring"],
    primaryLabelEn: "Quadriceps & glutes",
    primaryLabelZh: "股四头肌（大腿前侧）与臀部",
    secondaryLabelEn: "Hamstrings, adductors",
    secondaryLabelZh: "大腿后侧、内侧",
    stabilizersEn: "Core braced against seat",
    stabilizersZh: "核心稳住骨盆贴靠垫",
    normalFeelEn: "Strong leg burn in front thighs (lower foot placement) or thighs + glutes (slightly higher foot placement).",
    normalFeelZh: "脚踩低一点大腿前侧酸，脚踩高一点、宽一点臀部和前侧一起酸。",
    beginnerTensionEn: "Lower back curling off the seat pad at the bottom, or knees shaking inward/locking out hard.",
    beginnerTensionZh: "放到最下面时屁股和下腰卷起来离开靠垫导致腰酸，或蹬直时猛锁膝盖。",
    burnNoteEn: "Leg press supports your torso so it's great for focusing safely on leg strength—no need to slam into maximum depth if your pelvis curls.",
    burnNoteZh: "腿举有靠背保护，只要不把屁股卷离靠垫、不锁死膝盖，对新手非常安全。",
    warningSignsEn: "Lower back pinching when hips curl up, or knee joint pain.",
    warningSignsZh: "屁股卷起引起腰疼，或膝盖关节内侧刺痛。",
    techniqueRulesEn: [
      "Keep back and tailbone glued flat to the seat pad the ENTIRE rep.",
      "Feet shoulder-width apart, knees aligned with toes.",
      "Stop pressing just before knees lock out completely.",
      "Stop lowering right before your butt lifts off the seat.",
    ],
    techniqueRulesZh: [
      "全程把后背和屁股死死贴在靠垫上，一毫米都不能翘起来。",
      "双脚与肩同宽踩稳踏板，膝盖始终对准脚尖方向。",
      "蹬起来时留一点微弯，绝不把膝盖完全锁死打直。",
      "放到觉得屁股快要翘起前就停住往上蹬。",
    ],
    compensations: [
      {
        id: "leg-press-butt-lift",
        symptomEn: "Lower back hurts or knees feel strained",
        symptomZh: "腰部发酸不舒服，或膝盖卡痛",
        compensatedMuscles: ["lower-back"],
        investigateEn: ["Tailbone lifting off seat at bottom", "Locking knees straight at top", "Feet placed too low/narrow"],
        investigateZh: ["下放时屁股有没有离开垫子卷起来", "蹬直时膝盖有没有锁死", "脚是不是踩得太低或太窄"],
        causesEn: ["Lowering past hip flexibility curls the pelvis off the pad and rounds the lumbar spine under heavy load."],
        causesZh: ["下放太深超过了髋关节活动度，骨盆卷离靠垫，所有重量就会折到腰椎上。"],
        correctionsEn: ["Move feet slightly higher on the platform.", "Shorten lowering depth so tailbone stays 100% glued to the pad.", "Keep a soft knee bend at the top; never lock out."],
        correctionsZh: ["把双脚在踏板上往上挪半个脚掌，并稍微加宽一点。", "不要放那么深——只要觉得屁股快要卷离垫子就停住蹬回。", "蹬到底时留一点微弯不锁膝。"],
        practiceEn: "Try 10 light reps stopping 2 inches higher at the bottom and watching your tailbone stay pressed down.",
        practiceZh: "调轻配重做 10 次，刻意少下放几厘米，确保屁股全程贴死垫子。",
        retestEn: ["Does your lower back stay flat and pain-free?"],
        retestZh: ["腰背还疼吗？大腿发力是不是更专一了？"],
      },
    ],
  }),
  ex({
    id: "leg-extension",
    libraryId: "leg-extension",
    category: "legs",
    nameEn: "Leg Extension",
    nameZh: "坐姿腿屈伸",
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: [],
    primaryLabelEn: "Quadriceps (front of thigh)",
    primaryLabelZh: "股四头肌（大腿前侧）",
    secondaryLabelEn: "Minimal secondary muscles (isolation exercise)",
    secondaryLabelZh: "单关节孤立动作，几乎全靠股四头肌",
    stabilizersEn: "Hip flexors, grip on side handles",
    stabilizersZh: "髋屈肌、双手扶稳把手稳定",
    normalFeelEn: "Very noticeable burn right in the front of the thighs.",
    normalFeelZh: "大腿正前侧很快会有明显酸胀充血感。",
    beginnerTensionEn: "Shin pad digging into ankle/foot or knee discomfort if the seat pivot doesn't line up with your knee joint.",
    beginnerTensionZh: "海绵滚筒压在脚背太低或膝盖没对准机器转轴，导致膝盖卡着不舒服。",
    burnNoteEn: "One of the easiest machines for beginners to feel the target muscle clearly.",
    burnNoteZh: "新手最容易立刻找到目标肌肉发力感的器械之一。",
    warningSignsEn: "Sharp pain under the kneecap or twisting discomfort in the knee.",
    warningSignsZh: "髌骨（膝盖骨）下方尖锐刺痛。",
    techniqueRulesEn: [
      "Align the machine's pivot axis right beside your knee joint.",
      "Place the ankle pad just above your shoe laces (not on toes, not mid-shin).",
      "Lift smoothly, hold 1 second at top, and lower for 2–3 seconds without kicking.",
    ],
    techniqueRulesZh: [
      "调靠背前后位置，让你的膝盖侧面刚好对准机器的红色/金属圆形转轴。",
      "滚筒卡在脚踝上方一点点（鞋带上方），不要踩在脚趾上。",
      "稳稳抬起伸直停 1 秒，再 2–3 秒慢放，不要用甩的。",
    ],
    compensations: [
      {
        id: "leg-ext-knee",
        symptomEn: "Kneecap or sides of knee feel uncomfortable",
        symptomZh: "膝盖骨周围或膝盖侧面不舒服",
        compensatedMuscles: ["quadriceps"],
        investigateEn: ["Backrest depth (knee aligned with machine pivot?)", "Ankle pad height", "Heavy load kicked violently"],
        investigateZh: ["靠背前后距离（膝盖有没有对准转轴）", "脚踝垫高度", "是不是太重靠猛甩上去"],
        causesEn: ["Misaligned pivot creates shear force on the knee joint; heavy momentum strains the patellar tendon."],
        causesZh: ["膝盖没对准机器转轴会让轨迹和关节打架；重量太大猛踢会猛拉髌腱。"],
        correctionsEn: ["Adjust backrest so the crease behind your knee sits comfortably on the edge of the seat and aligns with the machine pivot.", "Reduce weight and move smoothly without snapping at the top.", "Adjust starting range one notch forward if deep bending hurts the knee."],
        correctionsZh: ["重新调整靠背前后，让膝盖刚好对准机器转轴中心。", "调轻重量，匀速抬起不猛踢。", "如果最开始弯曲太深膝盖不舒服，把起始角度限位往外调一格。"],
        practiceEn: "Re-align seat pivot, drop weight 20%, and perform 10 smooth reps with a 1-second pause at the top.",
        practiceZh: "重新对准转轴并减重 20%，匀速做 10 次。",
        retestEn: ["Is the front of the knee pain-free now?"],
        retestZh: ["膝盖前面是不是不再卡痛了？"],
      },
    ],
  }),
  ex({
    id: "leg-curl",
    libraryId: "leg-curl",
    category: "legs",
    nameEn: "Leg Curl",
    nameZh: "俯卧/坐姿腿弯举",
    primaryMuscles: ["hamstring"],
    secondaryMuscles: ["calves"],
    primaryLabelEn: "Hamstrings (back of thigh)",
    primaryLabelZh: "腘绳肌（大腿后侧）",
    secondaryLabelEn: "Gastrocnemius (calves), glutes (stabilizing)",
    secondaryLabelZh: "小腿腓肠肌、臀部协助稳定",
    stabilizersEn: "Lower back/core keeping hips down",
    stabilizersZh: "核心贴垫保持骨盆不动",
    normalFeelEn: "Strong squeeze along the back of the thigh as heels pull toward glutes.",
    normalFeelZh: "勾腿时大腿后侧中间明显收紧发酸。",
    beginnerTensionEn: "Lower back arching/butt popping up on lying leg curl, or calf cramping.",
    beginnerTensionZh: "趴着做时屁股翘起来腰代偿，或者小腿肚比大腿后侧还容易抽筋。",
    burnNoteEn: "Pointing toes slightly or keeping ankles relaxed reduces calf takeover so the hamstrings do more work.",
    burnNoteZh: "如果小腿总先抽筋，可以把脚尖稍微放松（别死命往回勾脚尖），大腿后侧会立刻更明显。",
    warningSignsEn: "Lower back pinching on lying curl or sharp knee-back pull.",
    warningSignsZh: "翘屁股引发的腰痛，或膝盖正后方肌腱拉痛。",
    techniqueRulesEn: [
      "Align knees with machine pivot; pad sits just above heels (Achilles area).",
      "Keep hips pressed flat onto the bench/pad—do not lift butt as you curl.",
      "Control the return slowly.",
    ],
    techniqueRulesZh: [
      "膝盖对准机器转轴，滚筒卡在脚后跟上方一点点。",
      "做俯卧腿弯举时屁股和胯全程贴紧垫子不许翘起；坐姿版压紧大腿挡垫。",
      "慢慢放回，不砸配重片。",
    ],
    compensations: [
      {
        id: "leg-curl-calf-back",
        symptomEn: "Calves cramp first or lower back arches/hurts",
        symptomZh: "小腿先抽筋，或者做的时候腰酸屁股翘起",
        compensatedMuscles: ["calves", "lower-back"],
        investigateEn: ["Butt lifting off bench during lying curl", "Dorsiflexing feet forcefully", "Weight too heavy"],
        investigateZh: ["弯举时屁股有没有离开垫子抬起", "脚尖有没有用力往回勾", "重量是否过重"],
        causesEn: ["Hips lifting turns the movement into lumbar momentum; pulling toes up strongly activates calves."],
        causesZh: ["拉不动就翘屁股借力会把压力全甩给腰；大力勾脚尖会提前累垮小腿。"],
        correctionsEn: ["Drop weight so hips stay glued to the pad.", "Keep ankles relaxed/neutral (or gently pointed) instead of pulling toes toward shins.", "Brace abs lightly into the pad."],
        correctionsZh: ["减轻一两格重量，保证屁股全程贴紧不翘。", "脚踝放松不要使劲勾脚尖。", "肚子微收把髋骨压在垫子上。"],
        practiceEn: "10 lighter reps keeping hips glued down and ankles relaxed.",
        practiceZh: "减重做 10 次，屁股压死垫子、脚踝完全放松。",
        retestEn: ["Did calf cramping and lower-back tension subside?"],
        retestZh: ["小腿抽筋和腰酸有没有缓解？"],
      },
    ],
  }),
  ex({
    id: "romanian-deadlift",
    libraryId: "db-rdl",
    category: "legs",
    nameEn: "Romanian Deadlift (RDL)",
    nameZh: "罗马尼亚硬拉",
    primaryMuscles: ["hamstring", "gluteal"],
    secondaryMuscles: ["lower-back"],
    primaryLabelEn: "Hamstrings & gluteus maximus",
    primaryLabelZh: "腘绳肌（大腿后侧）与臀大肌",
    secondaryLabelEn: "Spinal erectors (lower/mid back), upper back, forearms",
    secondaryLabelZh: "竖脊肌（腰背保持平直）、上背与前臂",
    stabilizersEn: "Core, lats (keeping weights close to legs)",
    stabilizersZh: "核心、背阔肌（把哑铃贴近腿）",
    normalFeelEn: "Deep stretch down the back of the thighs as hips push back, then glutes and hamstrings pull you upright.",
    normalFeelZh: "屁股往后推时大腿后侧被拉得酸紧，站直时屁股和大腿后侧一起夹紧发力。",
    beginnerTensionEn: "Lower back taking all the strain from rounding the spine or letting dumbbells drift forward away from shins.",
    beginnerTensionZh: "全部变成弯腰在拉，大腿后侧没被拉到反而腰酸背痛。",
    burnNoteEn: "RDL feels much more like a deep stretch-tension in the back of the legs than a pumping burn—that is the goal.",
    burnNoteZh: "这个动作的标志感是大腿后侧强烈的「拉伸感」，而不一定像腿屈伸那样有酸胀泵感。",
    warningSignsEn: "Sharp or aching pain concentrated in the lower back, or rounding the spine.",
    warningSignsZh: "腰部出现集中刺痛或明显弓背拉扯感。",
    techniqueRulesEn: [
      "This is a hip hinge (push hips BACK like closing a car door with your butt), NOT a squat.",
      "Keep knees softly unlocked (about 15° bend), fixed throughout.",
      "Keep weights gliding tight against your thighs/shins—never drifting forward.",
      "Stop lowering around mid-shin (as soon as hips stop moving back); keep back flat.",
    ],
    techniqueRulesZh: [
      "核心动作是「髋铰链」：膝盖微弯固定住，只想着把屁股使劲往身后的墙推（像用屁股关车门），而不是往下蹲。",
      "哑铃全程贴着大腿和小腿前面往下滑，不要悬空飘在前面。",
      "背部始终保持像木板一样平直，下放到小腿中段、屁股推不动了就停，用臀腿拉回站直。",
    ],
    compensations: [
      {
        id: "rdl-lower-back",
        symptomEn: "Feel lower back more than hamstrings/glutes",
        symptomZh: "腰很酸，大腿后侧和屁股没拉伸感",
        compensatedMuscles: ["lower-back"],
        investigateEn: [
          "Are weights drifting away from thighs/shins?",
          "Are hips pushing back or is the torso just bending down?",
          "Is the user reaching all the way to the floor and rounding the back?",
          "Are knees locked stiff or bending too much into a squat?",
        ],
        investigateZh: [
          "哑铃有没有贴着腿滑下去，还是悬空离腿很远？",
          "有没有先把屁股往后推，还是直接弯腰往下够？",
          "是不是强行往地面放太低导致弓背了？",
          "膝盖是完全锁死，还是弯太多做成了深蹲？",
        ],
        causesEn: [
          "Reaching down with the torso instead of pushing hips back forces the lower back to lift the upper body.",
          "Weights drifting forward increases lever arm torque directly onto the lower back.",
        ],
        causesZh: [
          "不是把屁股往后推、而是直接往下弯腰时，压力就全集中到了腰椎竖脊肌。",
          "哑铃离腿越远，对腰部的杠杆拉力越大。",
        ],
        correctionsEn: [
          "Practice standing 1 foot in front of a wall and push your hips straight back to tap the wall.",
          "Slide dumbbells right down the front of your thighs like shaving your legs.",
          "Stop just below the knees—as soon as hips stop going back, stand back up by driving hips forward.",
        ],
        correctionsZh: [
          "先徒手站在离墙一脚远的地方练习：保持背平直，用屁股往后顶到墙，立刻能找到大腿后侧拉伸感！",
          "拿轻哑铃贴着大腿前侧往下滑，像擦着裤腿走。",
          "只放到膝盖下方一点点（觉得臀腿拉紧、屁股推不动了就停），不用碰地。",
        ],
        practiceEn: "Try 8 wall-tap hip hinges without weights, then 8 light dumbbell reps grazing your thighs.",
        practiceZh: "先做 8 次靠墙用屁股碰墙练习，再拿轻哑铃贴腿做 8 次。",
        retestEn: ["Do you feel a strong stretch behind your thighs?", "Did the lower-back strain fade?"],
        retestZh: ["大腿后侧是不是有清晰的拉伸感了？", "腰部压力是不是小了很多？"],
      },
    ],
  }),
  ex({
    id: "glute-bridge",
    libraryId: "glute-bridge",
    category: "legs",
    nameEn: "Glute Bridge",
    nameZh: "臀桥",
    primaryMuscles: ["gluteal"],
    secondaryMuscles: ["hamstring", "abs"],
    primaryLabelEn: "Gluteus maximus (buttocks)",
    primaryLabelZh: "臀大肌（屁股）",
    secondaryLabelEn: "Hamstrings, core",
    secondaryLabelZh: "大腿后侧、核心",
    stabilizersEn: "Pelvic stabilizers, abductors",
    stabilizersZh: "骨盆稳定肌、臀中肌",
    normalFeelEn: "Firm squeeze in the buttocks at the top without lower-back arching.",
    normalFeelZh: "顶起臀部时屁股收紧发酸，腰不疼，大腿不抢戏。",
    beginnerTensionEn: "Lower back arching/pinching, hamstrings cramping, or front of thighs taking over.",
    beginnerTensionZh: "屁股没感觉，反而腰酸、大腿前侧酸，或者大腿后侧抽筋。",
    burnNoteEn: "Holding 2 seconds at the top with gentle rib-cage tuck is much more effective than lifting your hips as high as possible.",
    burnNoteZh: "重点不是把肚子顶得越高越好，而是顶到肩髋膝一条线后夹紧屁股停 2 秒。",
    warningSignsEn: "Sharp lower-back compression at the top.",
    warningSignsZh: "顶到最高处时腰椎被挤压刺痛。",
    techniqueRulesEn: [
      "Place feet about a hand's width from your glutes so shins are vertical at the top.",
      "Tuck chin slightly, brace ribs down, drive through heels.",
      "Stop when shoulders-hips-knees form a straight line; squeeze glutes 2 seconds.",
    ],
    techniqueRulesZh: [
      "脚跟离屁股大约一个手掌的距离（顶起来时小腿垂直地面）。",
      "收紧下腹、肋骨不往上翻，用脚后跟蹬地顶起臀部。",
      "抬到肩、髋、膝成一条直线就停，顶端夹紧屁股 2 秒，不要再拼命挺腰。",
    ],
    compensations: [
      {
        id: "glute-bridge-hamstring-quad-back",
        symptomEn: "Feel lower back, hamstrings cramping, or front of thighs instead of glutes",
        symptomZh: "腰酸、大腿后侧抽筋，或大腿前侧先累，屁股没感觉",
        compensatedMuscles: ["lower-back", "hamstring", "quadriceps"],
        investigateEn: [
          "Foot distance from hips (too far = hamstring cramp; too close = quad takeover)",
          "Over-arching lower back past straight line at top",
          "Pushing through toes instead of heels",
        ],
        investigateZh: [
          "脚踩的位置（太远容易大腿后侧抽筋，太近容易大腿前侧酸）",
          "顶到最高时是不是肋骨外翻挺腰了",
          "是不是用了脚尖发力而不是脚后跟",
        ],
        causesEn: [
          "Feet too far forward lengthens and overloads hamstrings; feet too close loads quads; lifting higher than hip alignment compresses the lower back.",
        ],
        causesZh: [
          "脚踩太远＝大腿后侧抽筋；脚踩太近＝大腿前侧累；顶太高翻肋骨＝腰椎压迫酸。",
        ],
        correctionsEn: [
          "If hamstrings cramp: scoot heels closer to your butt until shins are vertical at the top.",
          "If front thighs dominate: slide feet slightly forward (2–3 inches) and lift toes slightly off shoes.",
          "If lower back hurts: tuck tailbone slightly under (flatten lower back) before pushing up and stop at straight alignment.",
        ],
        correctionsZh: [
          "若大腿后侧抽筋：把脚跟往屁股方向收近一点，确保顶起来时小腿垂直地面。",
          "若大腿前侧酸：把脚往前挪半个脚掌，并试着微微翘起脚尖只用脚跟蹬地。",
          "若腰酸：先微微卷骨盆收紧肚子，抬到肩髋膝一条直线立刻停住，绝不过度顶高。",
        ],
        practiceEn: "Do 10 bodyweight bridges pausing 2 seconds at the top with toes slightly lifted inside shoes.",
        practiceZh: "徒手做 10 次臀桥，脚尖微微翘起只用脚后跟蹬，顶端停 2 秒用力夹屁股。",
        retestEn: ["Did the cramps or lower-back ache stop?", "Can you clearly feel your glutes working at the top?"],
        retestZh: ["抽筋和腰酸有没有停下来？", "顶到最高停住时屁股有没有发酸收紧？"],
      },
    ],
  }),
  ex({
    id: "calf-raise",
    libraryId: "calf-raise",
    category: "legs",
    nameEn: "Calf Raise",
    nameZh: "提踵（练小腿）",
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    primaryLabelEn: "Gastrocnemius & soleus (calves)",
    primaryLabelZh: "小腿腓肠肌与比目鱼肌",
    secondaryLabelEn: "Intrinsic foot stabilizers",
    secondaryLabelZh: "足底稳定肌群",
    stabilizersEn: "Core, ankles",
    stabilizersZh: "核心、踝关节稳定",
    normalFeelEn: "Deep stretch at the bottom, tight contraction at the back of the lower leg at top.",
    normalFeelZh: "脚跟下沉时小腿后侧被拉开，踮到最高时小腿肚子收紧。",
    beginnerTensionEn: "Arch of the foot cramping or ankles rolling outward.",
    beginnerTensionZh: "脚底板抽筋，或踮起来时脚踝往外歪。",
    burnNoteEn: "Slowing down and pausing 1 second at the bottom and top stops the Achilles tendon from bouncing for you.",
    burnNoteZh: "慢下慢上、在最高和最低各停 1 秒，才能防止跟腱像弹簧一样把动作弹上去。",
    warningSignsEn: "Sharp Achilles tendon or plantar fascia pain.",
    warningSignsZh: "脚后跟上方跟腱刺痛或足底筋膜撕扯痛。",
    techniqueRulesEn: [
      "Push through the ball of the big toe & second toe—keep ankles straight, not rolling onto pinky edge.",
      "Full range: sink heels gently down, pause 1 sec, rise high, pause 1 sec.",
    ],
    techniqueRulesZh: [
      "主要用大脚趾根部发力蹬起，脚踝保持正中不要往外翻。",
      "脚跟先沉到底拉长停 1 秒，再踮到最高停 1 秒，切忌快速上下弹动。",
    ],
    compensations: [
      {
        id: "calf-bounce",
        symptomEn: "Feet/ankles hurt or calves feel nothing",
        symptomZh: "脚底或脚踝不舒服，小腿反而没感觉",
        compensatedMuscles: ["calves"],
        investigateEn: ["Bouncing quickly with short range", "Weight rolling onto outer pinky edges", "Knees bending and bouncing"],
        investigateZh: ["是不是像弹簧一样弹着做很快", "是不是重心歪到了脚外侧", "膝盖是不是跟着一屈一伸借力"],
        causesEn: ["Fast bouncing uses elastic tendon recoil instead of muscle work; rolling outward strains lateral ankle."],
        causesZh: ["快速颠脚全是跟腱弹性反弹，肌肉几乎没干活；外八撇脚腕容易扭伤。"],
        correctionsEn: ["Slow tempo to 2s up, 1s hold, 2s down, 1s stretch.", "Press evenly through big toe base.", "Use bodyweight holding a rail before adding load."],
        correctionsZh: ["放慢节奏：2 秒踮起 → 顶端停 1 秒 → 2 秒下沉 → 底端停 1 秒。", "把重心压在大脚趾和二脚趾根部。", "先扶着栏杆徒手把节奏练对再负重。"],
        practiceEn: "12 slow bodyweight calf raises with 1-second pauses top and bottom.",
        practiceZh: "扶墙徒手做 12 次慢速提踵，上下各停 1 秒。",
        retestEn: ["Do ankles stay steady while calves warm up evenly?"],
        retestZh: ["脚踝稳住了吗？小腿肚子是不是明显发酸了？"],
      },
    ],
  }),
  ex({
    id: "lunges",
    libraryId: "lunge",
    category: "legs",
    nameEn: "Lunges",
    nameZh: "箭步蹲 / 弓步蹲",
    primaryMuscles: ["quadriceps", "gluteal"],
    secondaryMuscles: ["hamstring", "calves"],
    primaryLabelEn: "Quadriceps & gluteus maximus",
    primaryLabelZh: "股四头肌（大腿前侧）与臀大肌",
    secondaryLabelEn: "Hamstrings, calves, adductors",
    secondaryLabelZh: "腘绳肌、小腿、大腿内侧",
    stabilizersEn: "Gluteus medius (hip balance), core",
    stabilizersZh: "臀中肌（骨盆平衡）、核心",
    normalFeelEn: "Front thigh and glute of the lead leg working while back leg gently assists balance.",
    normalFeelZh: "前脚大腿前侧和臀部主力发力，后脚主要负责保持平衡。",
    beginnerTensionEn: "Front knee discomfort, back-foot toes cramping, or wobbling sideways like walking a tightrope.",
    beginnerTensionZh: "前膝盖疼、走钢丝一样左右晃站不稳，或者全靠后脚在蹬。",
    burnNoteEn: "Reverse lunges (stepping backward) are usually much friendlier on beginners' knees than stepping forward.",
    burnNoteZh: "如果往前跨步膝盖不舒服，强烈建议改成「往后退一步的后撤弓步蹲」，对膝盖友好得多。",
    warningSignsEn: "Sharp front knee pain or hip pinching.",
    warningSignsZh: "前膝盖尖锐痛或后腿大腿根拉扯刺痛。",
    techniqueRulesEn: [
      "Stand hip-width apart (like train tracks, NOT a tightrope) for side-to-side balance.",
      "Lower body straight down (elevator) rather than lunging forward.",
      "Keep front heel flat and front knee aligned over toes.",
    ],
    techniqueRulesZh: [
      "两脚左右保持与髋同宽（像踩在两条铁轨上，不要前后踩在一条线上）。",
      "身体像坐电梯一样垂直往下沉，不要猛往前冲。",
      "前脚整个脚掌踩稳，主要靠前脚脚跟发力推起。",
    ],
    compensations: [
      {
        id: "lunge-wobble-knee",
        symptomEn: "Wobbly balance, front knee hurts, or one leg feels much weaker",
        symptomZh: "左右晃站不稳、前膝盖不舒服，或左右腿感觉差很多",
        compensatedMuscles: ["quadriceps", "calves"],
        investigateEn: ["Feet on one narrow line (tightrope stance)", "Stepping forward and letting knee shoot way past toes with heel lifting", "Left vs right stability comparison"],
        investigateZh: ["双脚前后是不是踩在一条线上", "往前跨太短导致前脚跟翘起冲膝盖", "左右两边稳不稳、力气是否一样"],
        causesEn: ["Narrow stance destabilizes hips; short forward lunges overload the front knee."],
        causesZh: ["踩在一条线上左右必然晃；步子太小且前倾就会顶膝盖。"],
        correctionsEn: ["Switch to reverse lunges or stationary split squats holding a support lightly.", "Keep feet hip-width side-to-side (railroad tracks).", "Start with your weaker leg and match reps on the stronger leg."],
        correctionsZh: ["先改练原地分腿蹲或后撤弓步蹲，手可以轻扶墙或架子。", "左右脚拉开到与胯同宽（踩铁轨）。", "先练较弱或较晃的那条腿，强腿只做相同次数。"],
        practiceEn: "8 stationary split squats per leg starting with the weaker leg, using light fingertip wall support.",
        practiceZh: "手轻扶墙，先从较弱的那条腿开始每边做 8 次原地分腿蹲。",
        retestEn: ["Did the wobble and knee stress disappear?"],
        retestZh: ["晃动感和膝盖不适有没有明显减轻？"],
      },
    ],
  }),

  // ═══════════════ CORE (4) ═══════════════
  ex({
    id: "plank",
    libraryId: "plank",
    category: "core",
    nameEn: "Plank",
    nameZh: "平板支撑",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques", "front-deltoids", "quadriceps", "gluteal"],
    primaryLabelEn: "Deep core & rectus abdominis",
    primaryLabelZh: "深层核心（腹横肌）与腹直肌",
    secondaryLabelEn: "Obliques, shoulders, glutes, quads",
    secondaryLabelZh: "腹斜肌、肩部支撑、臀腿协同",
    stabilizersEn: "Serratus anterior, spinal stabilizers",
    stabilizersZh: "前锯肌、脊柱稳定肌",
    normalFeelEn: "Warm tightening across the entire midsection while breathing smoothly.",
    normalFeelZh: "整个肚子前面发紧微颤，呼吸顺畅，腰不沉也不痛。",
    beginnerTensionEn: "Lower back aching from hips sagging, or shoulders/neck cramping from holding too long past form failure.",
    beginnerTensionZh: "屁股塌下去导致腰酸，或者死撑太久变成肩膀和脖子酸。",
    burnNoteEn: "A solid 20–30 second plank squeezing abs and glutes beats a sagging 2-minute plank every time.",
    burnNoteZh: "收紧肚子和屁股标准撑 20–30 秒，比塌着腰死撑 2 分钟有效十倍。",
    warningSignsEn: "Lower back pain or shoulder joint pain.",
    warningSignsZh: "腰部折压刺痛或肩关节刺痛。",
    techniqueRulesEn: [
      "Elbows directly under shoulders; push floor slightly away so upper back doesn't collapse.",
      "Squeeze glutes and tilt tailbone slightly under (tuck hips) so lower back doesn't sag.",
      "Keep breathing smoothly—never hold your breath.",
    ],
    techniqueRulesZh: [
      "手肘放在肩膀正下方，手臂轻轻把地面往下推，肩胛骨不要塌下去。",
      "夹紧屁股、微微卷一点尾骨把肚子收紧，绝不塌腰。",
      "正常呼吸，不要憋气。",
    ],
    compensations: [
      {
        id: "plank-back-shoulder",
        symptomEn: "Lower back aches or shoulders/neck get tired first",
        symptomZh: "腰酸或者肩膀、脖子先累，肚子没感觉",
        compensatedMuscles: ["lower-back", "front-deltoids", "trapezius"],
        investigateEn: ["Hips sagging down below shoulder line", "Elbows positioned forward of shoulders", "Holding set too long past core fatigue"],
        investigateZh: ["腰和屁股有没有往下塌", "手肘是不是放太前面了", "是不是硬撑太久核心早没力了"],
        causesEn: ["Once abs fatigue, the pelvis drops into an arch and weight hangs on the lower back ligaments and shoulders."],
        causesZh: ["肚子一累松懈就会塌腰，重量全挂在腰椎和肩膀上。"],
        correctionsEn: ["Drop to knees (knee plank) or elevate forearms on a bench until 20–30s feels solid in abs.", "Place elbows strictly below shoulders.", "Squeeze glutes and imagine pulling elbows slightly toward toes without moving."],
        correctionsZh: ["先改用跪姿平板支撑，或者手肘撑在卧推凳上做高架平板支撑。", "检查手肘在肩膀正下方。", "夹紧屁股，想象手肘轻微往脚尖方向拽，肚子立刻紧绷。"],
        practiceEn: "Try 2 sets of 20-second incline or knee planks focusing on glute + ab tension.",
        practiceZh: "改做 2 组 20 秒跪姿或撑凳平板支撑，专心夹紧屁股和肚子。",
        retestEn: ["Is the lower back completely pain-free?", "Do you feel your abs tightening instead of shoulders?"],
        retestZh: ["腰部是不是彻底不酸了？", "肚子有没有真正紧起来？"],
      },
    ],
  }),
  ex({
    id: "dead-bug",
    libraryId: "dead-bug",
    category: "core",
    nameEn: "Dead Bug",
    nameZh: "死虫式",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques"],
    primaryLabelEn: "Deep core (transverse abdominis) & rectus abdominis",
    primaryLabelZh: "深层核心（腹横肌）与腹直肌",
    secondaryLabelEn: "Obliques, pelvic stabilizers",
    secondaryLabelZh: "腹斜肌、骨盆稳定肌",
    stabilizersEn: "Hip flexors (controlled)",
    stabilizersZh: "髋屈肌控制",
    normalFeelEn: "Deep tension inside the abdomen while lower back stays glued flat against the floor.",
    normalFeelZh: "下背部紧紧贴着地板不动，肚子深层稳稳收紧发酸。",
    beginnerTensionEn: "Lower back arching off the mat when lowering the leg, causing hip flexors/lower back to take over.",
    beginnerTensionZh: "腿一伸直下腰就离地拱起，变成腰酸和大腿根酸。",
    burnNoteEn: "One of the safest core exercises for beginners with sensitive lower backs when range is kept honest.",
    burnNoteZh: "只要把幅度控制在下背不离地，这是对腰最安全、最有效的新手核心训练。",
    warningSignsEn: "Lower back arching/popping/aching.",
    warningSignsZh: "腰部悬空拱起酸痛或髋关节弹响刺痛。",
    techniqueRulesEn: [
      "Press lower back flat into the floor—no space for a hand to slide under.",
      "Exhale slowly as opposite arm and leg extend.",
      "Stop lowering the leg the exact moment your lower back starts to lift.",
    ],
    techniqueRulesZh: [
      "下背部像被胶水粘住一样死死贴紧地面（手塞不进腰下面）。",
      "伸出对侧手脚时配合缓缓呼气。",
      "只要觉得腰要离地拱起了，腿就不要放那么低，只放到能贴住地面的高度。",
    ],
    compensations: [
      {
        id: "dead-bug-arch",
        symptomEn: "Lower back lifts/aches or front of hips tire",
        symptomZh: "腰悬空发酸或者大腿根酸",
        compensatedMuscles: ["lower-back", "quadriceps"],
        investigateEn: ["Lowering straight leg all the way to the floor", "Forgetting to exhale and flatten lower back", "Neck lifting tensely"],
        investigateZh: ["腿是不是放太低快碰到地了", "有没有配合呼气把腰压实地板", "是不是脖子用力抬起来了"],
        causesEn: ["Lowering the leg past core control pulls the pelvis forward and arches the lower back."],
        causesZh: ["腿放得太低超出了肚子能拉住骨盆的力量，腰就会被迫拱起来。"],
        correctionsEn: ["Bend knees slightly or lower foot only halfway (45° angle).", "Rest head comfortably on the floor or a small pillow.", "Exhale gently as you reach out, keeping back pressed down."],
        correctionsZh: ["只把腿斜着往下伸到 45° 高度，不用放到底接近地面。", "头平放在地上放松脖子。", "一边轻轻吹气一边伸出，感觉肚脐压向地面。"],
        practiceEn: "Try 8 slow alternating reps stopping legs at 45° with lower back pressed down.",
        practiceZh: "头枕好地面，腿只放到 45° 半程做 8 次慢动作。",
        retestEn: ["Does your lower back stay 100% glued to the floor?"],
        retestZh: ["下腰是不是全程都能稳稳贴着地板？"],
      },
    ],
  }),
  ex({
    id: "cable-crunch",
    libraryId: "crunch",
    category: "core",
    nameEn: "Cable Crunch / Crunch",
    nameZh: "绳索卷腹 / 卷腹",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["obliques"],
    primaryLabelEn: "Rectus abdominis (upper/mid abs)",
    primaryLabelZh: "腹直肌（上中腹）",
    secondaryLabelEn: "Obliques",
    secondaryLabelZh: "腹斜肌",
    stabilizersEn: "Arms/shoulders holding rope gently",
    stabilizersZh: "手臂与肩部固定绳索",
    normalFeelEn: "Ribcage curling toward pelvis so the front of the stomach folds and tightens.",
    normalFeelZh: "肋骨往肚脐和骨盆方向卷起来，腹部前面挤压发酸。",
    beginnerTensionEn: "Hip flexors/thighs burning (bowing at the hips with a flat back) or neck straining forward.",
    beginnerTensionZh: "保持背直直地上下磕头（只折髋关节），导致大腿根或脖子酸，肚子没感觉。",
    burnNoteEn: "Think of curling your upper spine like rolling up a yoga mat—not bowing down with a straight back.",
    burnNoteZh: "核心要领是「把上背和胸口一节一节往下卷」，而不是腰板笔直地往下鞠躬。",
    warningSignsEn: "Neck pain from pulling head with hands, or lower-back pinching.",
    warningSignsZh: "用手掰脖子导致的颈椎痛，或腰椎不适。",
    techniqueRulesEn: [
      "Lock hips in place (don't sit back onto heels).",
      "Keep hands beside your forehead/ears—arms don't pull.",
      "Exhale and curl ribs toward your belly button, rounding the upper back.",
    ],
    techniqueRulesZh: [
      "跪姿绳索卷腹时屁股固定在空中不要往脚跟坐。",
      "双手握绳靠在太阳穴或耳旁固定不动，不用手臂用力拉。",
      "吐气把胸口和肋骨往肚脐方向「卷」下来，而不是弯髋鞠躬。",
    ],
    compensations: [
      {
        id: "crunch-hip-neck",
        symptomEn: "Neck hurts, arms tire, or thighs/hips feel it instead of abs",
        symptomZh: "脖子酸、手臂酸，或者大腿根酸而肚子没感觉",
        compensatedMuscles: ["trapezius", "quadriceps", "biceps"],
        investigateEn: ["Hinging at hips (bowing with straight back) instead of flexing spine", "Pulling rope down with arms", "Pulling neck forward with hands"],
        investigateZh: ["是不是像磕头/鞠躬一样只折胯、没卷肚子", "是不是用手臂把绳索往下拉", "仰卧卷腹时是不是双手抱头猛掰脖子"],
        causesEn: ["Hinging at the hip uses hip flexors instead of abs; pulling with hands strains the neck."],
        causesZh: ["直背鞠躬主要由髋屈肌发力；双手拉扯直接压迫颈椎或耗尽手臂。"],
        correctionsEn: ["Keep hips stationary and focus only on bringing ribs closer to your pelvis.", "On floor crunches, cross arms over chest or keep fingertips lightly by ears—never pull the head.", "Exhale forcefully as you curl up to empty air and engage abs."],
        correctionsZh: ["想象肚子里夹着个海绵，用肋骨往骨盆压扁海绵（固定屁股和胯）。", "地上卷腹把手交叉放胸前或轻搭耳旁，绝不抱头掰脖子。", "卷起来时大口呼气，肚子收紧感会立刻翻倍。"],
        practiceEn: "Try 10 slow reps exhaling fully as you curl ribs toward your belly button.",
        practiceZh: "轻重量或徒手做 10 次，每次卷起来时把气缓缓吐光，感受肋骨靠近肚脐。",
        retestEn: ["Did neck/thigh strain stop and ab squeeze increase?"],
        retestZh: ["脖子和腿根不酸了吗？肚子挤压感更清楚了吗？"],
      },
    ],
  }),
  ex({
    id: "leg-raise",
    libraryId: "leg-raise",
    category: "core",
    nameEn: "Leg Raise",
    nameZh: "仰卧/悬垂举腿",
    primaryMuscles: ["abs"],
    secondaryMuscles: ["quadriceps", "obliques"],
    primaryLabelEn: "Lower/entire rectus abdominis & pelvic control",
    primaryLabelZh: "腹直肌（偏下腹）与骨盆卷动控制",
    secondaryLabelEn: "Hip flexors, quadriceps",
    secondaryLabelZh: "髂腰肌（髋屈肌）、股四头肌",
    stabilizersEn: "Lower back control, grip/shoulders (if hanging)",
    stabilizersZh: "腰背稳定性、肩背抓握（若为悬垂版）",
    normalFeelEn: "Abdominal contraction when curling the tailbone gently upward at the top.",
    normalFeelZh: "腿抬起末端稍微把尾骨卷离垫子时，下腹发紧发酸。",
    beginnerTensionEn: "Front of thighs/hip creases burning out and lower back arching off the pad.",
    beginnerTensionZh: "肚子完全没感觉，全是腰悬空酸痛和大腿前侧/大腿根酸。",
    burnNoteEn: "Lifting straight legs up to 45° mainly uses hip flexors; curling your tailbone slightly at the top is what lights up the abs.",
    burnNoteZh: "单纯把直腿往上抬主要在用大腿根的屈髋肌；真正练到下腹的关键是「屈膝把屁股/尾骨微微卷起来」。",
    warningSignsEn: "Lower back popping or aching each rep.",
    warningSignsZh: "每次放腿时腰部弹响或腰椎刺痛。",
    techniqueRulesEn: [
      "Bend knees first (bent-knee raises) if straight legs cause lower-back arching.",
      "Press lower back flat into the pad/floor; don't let legs drop so low your back pops up.",
      "At the top, curl pelvis/tailbone up gently toward your ribs.",
    ],
    techniqueRulesZh: [
      "新手先练「屈膝举腿」，比直腿更容易找到下腹发力且不伤腰。",
      "下背贴紧地板或靠垫，腿下放时一旦腰快悬空就停住，不必放到底。",
      "抬到最高点时稍微把尾骨/屁股向上卷起一点点。",
    ],
    compensations: [
      {
        id: "leg-raise-hip-back",
        symptomEn: "Thighs/hips get tired or lower back aches instead of abs",
        symptomZh: "大腿前侧/大腿根酸，或者腰疼，下腹没感觉",
        compensatedMuscles: ["quadriceps", "lower-back"],
        investigateEn: ["Keeping legs locked straight and dropping all the way to the floor", "Stopping before pelvis curls upward", "Arching lower back"],
        investigateZh: ["是不是腿伸得笔直且放得太低", "是不是只抬腿没卷尾骨", "下背有没有贴住垫子"],
        causesEn: ["Straight legs create huge leverage on hip flexors and pull the lumbar spine into an arch."],
        causesZh: ["直腿杠杆太长，核心力量还没够时全靠髂腰肌和塌腰在硬扯。"],
        correctionsEn: ["Bend knees to 90° and focus on curling knees slightly toward your chest.", "Stop lowering legs halfway down before your lower back lifts.", "Put hands gently beside hips (not under lower back as a crutch) and exhale while curling up."],
        correctionsZh: ["把腿弯起来做屈膝卷腿，想着把屁股和尾骨微微卷离地面。", "腿往下放一半、在腰还没拱起前就停住再抬起。", "抬起来时配合呼气。"],
        practiceEn: "Do 10 bent-knee reverse crunches lifting the tailbone 1–2 inches off the mat smoothly.",
        practiceZh: "改做 10 次屈膝反向卷腹，每次只把尾骨轻轻卷离垫子 2–3 厘米。",
        retestEn: ["Did thigh fatigue drop and lower abs start working?"],
        retestZh: ["大腿根酸感有没有减少，小腹开始发紧了吗？"],
      },
    ],
  }),
];

/** Quick lookup helpers */
export function findDetectiveExercise(id?: string | null): DetectiveExercise | undefined {
  if (!id) return undefined;
  return DETECTIVE_EXERCISES.find((e) => e.id === id || e.libraryId === id);
}

export function findBodyLocation(id?: string | null): BodyLocationEntry | undefined {
  if (!id) return undefined;
  return BODY_LOCATIONS.find((b) => b.id === id);
}

/** Compact summary of the 32-exercise knowledge base for the system prompt. */
function buildExerciseKnowledgeTable(): string {
  return DETECTIVE_EXERCISES.map((e) => {
    const comps = e.compensations
      .map(
        (c) =>
          `  • Compensation "${c.symptomEn}" (${c.symptomZh}): investigate [${c.investigateEn.join("; ")}] | cues: [${c.correctionsEn.join("; ")}]`,
      )
      .join("\n");
    return `- **${e.nameEn} (${e.nameZh})** [${e.category.toUpperCase()}]\n  Primary: ${e.primaryLabelEn} | Secondary: ${e.secondaryLabelEn} | Stabilizers: ${e.stabilizersEn}\n  Rules: ${e.techniqueRulesEn.join(" ")}\n  Muscle Feeling Ed: ${e.normalFeelEn} (${e.burnNoteEn})\n${comps}`;
  }).join("\n");
}

function buildBodyLocationTable(): string {
  return BODY_LOCATIONS.map(
    (b) => `- "${b.phraseEn}" (${b.phraseZh}) -> Possible: ${b.possibleStructuresEn} (${b.possibleStructuresZh})`,
  ).join("\n");
}

/** Complete AI Movement Detective system prompt implementing Parts 1–14. */
export function buildDetectiveSystemPrompt(lang: Lang): string {
  const langRule =
    lang === "en"
      ? `Respond primarily in clear, beginner-friendly **English** (include helpful Mandarin terms in parentheses only if relevant to the user's gym context).`
      : `请主要使用通俗、亲切、适合零基础新手的**简体中文**回答（动作名称、肌群名和关键标题可附上英文对照，方便用户在器械和资料中对照）。`;

  return `You are **AI MOVEMENT DETECTIVE** — an advanced AI movement analysis coach specializing in exercise biomechanics, resistance training technique, muscle activation, movement compensation, and beginner-friendly exercise education.

## LANGUAGE & TONE
${langRule}
- Your users may be complete beginners who have NEVER entered a gym before.
- Never assume they understand anatomical terminology, exercise names, or fitness jargon.
- Teach them as if you are physically guiding them through their first gym session.
- Be patient, scientifically responsible, practical, and never shame beginners.
- Your goal is not just to fix one rep—it is to help users gradually understand their own body.

---

## PART 1 & PART 4: THE MOVEMENT INVESTIGATION SYSTEM (INTERACTIVE DIAGNOSTIC QUESTIONING)
Whenever a user reports an exercise problem, **DO NOT immediately jump to a single final diagnosis** if key information is missing! First, investigate.

Track these 8 diagnostic items silently:
1. Which exercise is being performed?
2. Which body area is experiencing the sensation?
3. What type of sensation is being experienced (fatigue, burn, soreness, joint discomfort, sharp pain, numbness, dizziness)?
4. At what point during the movement does it happen (lifting/pushing, lowering, peak, start, end)?
5. Is the problem happening on the left, right, or both sides?
6. Is the user experiencing normal fatigue, discomfort, or pain?
7. What weight and repetitions are being used?
8. Is the movement controlled or rushed?

**CRITICAL INVESTIGATION RULES:**
- Ask **ONLY THE SINGLE MOST IMPORTANT missing question first**. NEVER overwhelm beginners with 5–8 questions at once.
- When asking a diagnostic question, ALWAYS offer simple clickable answer options on the very last line of your message in this exact format (so the app turns them into tap buttons):
  \`<choices>A. ...|B. ...|C. ...</choices>\`
  Example:
  "First, when you lift the dumbbells, do your shoulders also move upward toward your ears?"
  \`<choices>A. Yes, my shoulders move upward|B. No, my shoulders stay relatively stable|C. I'm not sure</choices>\`
- Use the smallest number of questions necessary (typically 1–3 brief back-and-forths, or jump straight to confidence-based analysis + correction protocol once you already have enough details—e.g. if the user filled out exercise + area + sensation + answered your key question).
- Even during a quick check, keep your message concise enough to read during a gym rest period.

---

## PART 2: BODY LOCATION INTERPRETATION SYSTEM
Translate everyday descriptions into **anatomical possibilities** (NEVER confirmed diagnoses; multiple muscles and structures can contribute to the same sensation; never claim to identify a specific muscle with certainty from text alone):
${buildBodyLocationTable()}

---

## PART 11: PAIN & SAFETY PROTOCOL (HIGHEST PRIORITY!)
Distinguish:
A. Normal muscle fatigue | B. Muscle burning during exercise | C. Delayed onset muscle soreness (DOMS) | D. Joint discomfort | E. Sharp or sudden pain | F. Numbness or tingling | G. Dizziness or unusual systemic symptoms (chest pain, fainting).

**SAFETY RULE:** If the user reports **sharp/sudden pain (E)**, **numbness/tingling (F)**, **dizziness/chest pain/fainting (G)**, significant sudden weakness, or worsening joint pain:
- Immediately tell them to **STOP** the exercise right now. Do NOT recommend pushing through.
- Do NOT attempt to diagnose the underlying medical condition.
- Provide calm safety guidance and recommend professional medical or physical therapy assessment.
- For emergency symptoms (chest pain, fainting, severe dizziness, shortness of breath), advise seeking **urgent medical help immediately**.

---

## PART 5: CONFIDENCE-BASED ANALYSIS
Once sufficient information is gathered, clearly present:
- Explicit confidence labels on hypotheses:
  - **More likely** (较大可能)
  - **Possible** (有可能)
  - **Less likely** (较小可能)
  - **Insufficient information** (信息不足)
- Include:
  1. Most likely explanation
  2. Other possible explanations (if plausible, explain differences)
  3. Supporting observations
  4. What remains uncertain
  5. How to test the hypothesis safely
- Never present an uncertain inference as a medical diagnosis and never invent fake anatomy.

---

## PART 6 & PART 13: COACHING RESPONSE & CORRECTION PROTOCOL FORMAT
Keep responses concise and gym-usable (do not write an academic lecture unless asked).
When delivering a coaching analysis (after sufficient info, or alongside a quick safety adjustment), structure it clearly using these sections:

${
  lang === "en"
    ? `**1. UNDERSTANDING YOUR PROBLEM**
Briefly repeat what the user is experiencing.

**2. WHAT MIGHT BE HAPPENING**
Explain likely causes using confidence labels (**More likely**, **Possible**, **Less likely**, **Insufficient information**), supporting observations, and what remains uncertain.

**3. LET'S CHECK** *(include ONLY if one important clarifying question remains; otherwise note what to verify)*
Ask one focused question if needed.

**4. HOW TO CORRECT IT**
- **PROBLEM:** ...
- **POSSIBLE CAUSE:** Simple language explanation.
- **WHY IT HAPPENS:** Clear, beginner-friendly biomechanics.
- **CORRECTION:** 2–4 specific, actionable cues using body landmarks.

**5. TRY THIS**
One simple lighter-weight practice drill (e.g., 8–10 slow controlled reps).

**6. RETEST**
Tell the user 1–3 specific sensations or movements to observe and report back on (never promise a sensation will always disappear).`
    : `**1. 理解你的问题 (UNDERSTANDING YOUR PROBLEM)**
用一两句话复述用户当前的动作和感受。

**2. 可能发生了什么 (WHAT MIGHT BE HAPPENING)**
用置信度标签（**较大可能 More likely** / **有可能 Possible** / **较小可能 Less likely** / **信息不足 Insufficient information**）说明原因、支持依据以及仍不确定的部分。

**3. 先确认一点 (LET'S CHECK)** *（如果还需要问 1 个关键问题再写这步；若信息已足则跳过或写需留意的观察点）*
只问这 1 个最关键的问题，并在末尾给出 \`<choices>A. ...|B. ...|C. ...</choices>\`。

**4. 动作调整方案 (HOW TO CORRECT IT)**
- **问题 (PROBLEM):** ...
- **可能原因 (POSSIBLE CAUSE):** 用大白话说明原因。
- **为什么会这样 (WHY IT HAPPENS):** 简单直观的生物力学解释。
- **调整方法 (CORRECTION):** 2–4 条具体好照做的指令（用身体看得到的参照物）。

**5. 降重试一下 (TRY THIS)**
给一个用很轻重量立即能试的练习（例如慢速 8–10 次）。

**6. 复测观察 (RETEST)**
让用户做完后观察 1–3 个具体感受变化并反馈（不要向用户保证某种感觉一定会100%消失）。`
}

---

## PART 7 & PART 8: BEGINNER TEACHING & MUSCLE FEELING EDUCATION
- Replace jargon like *"Maintain scapular depression and optimize the humeral plane"* with *"Keep your shoulders relaxed. Don't pull them up toward your ears, and lift slightly forward of your sides."*
- Whenever introducing a technical term (e.g., *scapula*, *latissimus dorsi*, *hip hinge*), immediately explain it in everyday language.
- Teach Muscle Feeling Education accurately:
  - Distinguish **primary target**, **secondary contributing muscles**, and **common beginner tension zones**.
  - **CRITICAL:** Feeling a muscle burn is NOT proof of optimal activation, and NOT feeling a strong burn/pump does NOT mean the exercise is ineffective. Never encourage chasing pain or soreness.

---

## PART 9: LEFT-RIGHT IMBALANCE ANALYSIS
When users report one side feels stronger, tighter, or more active than the other:
- Investigate: range of motion differences, movement control, strength, setup/seat symmetry, grip/foot placement, previous injury/discomfort, dominant-side compensation.
- Recommend: unilateral (one-arm/one-leg) variations, lighter controlled reps, equal range of motion, **starting with the weaker/less-connected side first**, and **matching the stronger side's repetitions to the weaker side**.
- Never assume a perceived sensation difference proves a structural anatomical asymmetry. If there is persistent weakness, coordination loss, or numbness, advise professional evaluation.

---

## PART 10: VISUAL MOVEMENT ANALYSIS (PHOTOS OR VIDEO FRAME STRIPS)
If the user attaches a photo or a 4-frame video sequence strip (showing START / MID / PEAK / END), analyze ONLY what is visibly observable and structure your answer as:
${
  lang === "en"
    ? `**WHAT I CAN SEE**
Describe observable body positioning, joint alignment, setup, trajectory, momentum, or visible left-right differences.

**POTENTIAL ISSUE**
Explain possible movement or setup issues (using confidence labels where appropriate).

**CORRECTION**
Give 2–4 practical adjustments they can try right now.

**WHAT I CANNOT CONFIRM**
Clearly state camera-angle / static-frame limitations. NEVER claim to know precisely which muscle is firing from an ordinary image/video, and NEVER make a medical diagnosis.`
    : `**我能看到的画面 (WHAT I CAN SEE)**
客观描述画面中可见的身体姿势、关节对齐、器械座椅高度、轨迹、借力晃动或可见的左右差异。

**可能的问题 (POTENTIAL ISSUE)**
结合置信度说明可能存在的设置或动作问题。

**调整建议 (CORRECTION)**
给出 2–4 条马上就能试的具体改法。

**画面无法确认的部分 (WHAT I CANNOT CONFIRM)**
坦诚说明视角/静帧/视频帧抽样的局限性：普通照片和视频无法精确测定具体哪块肌肉激活，也不做任何医学诊断。`
}

---

## PART 12: EXERCISE-SPECIFIC BIOMECHANICS REFERENCE (32 CORE EXERCISES)
Use exercise-specific biomechanics below rather than generic advice:
${buildExerciseKnowledgeTable()}

---

## INTERACTIVE CHOICES FOOTER (MANDATORY)
On the **very last line** of EVERY response, ALWAYS include 2–4 concise, user-voiced clickable options wrapped strictly in \`<choices>...</choices>\` separated by \`|\`:
- When investigating: \`<choices>A. ...|B. ...|C. ...</choices>\` answering your single question.
- When giving a correction & retest: e.g. \`<choices>Tried it, neck feels better|Still feel tension there|Show me another angle/cue|Check safety</choices>\` (localized to ${lang === "en" ? "English" : "Simplified Chinese"}).`;
}

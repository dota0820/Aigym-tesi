export type Group =
  | "back"
  | "chest"
  | "legs"
  | "glutes"
  | "shoulders"
  | "arms"
  | "core"
  | "mobility"
  | "cardio";

export const GROUPS: { id: Group; label: string; emoji: string }[] = [
  { id: "back", label: "背", emoji: "🦋" },
  { id: "chest", label: "胸", emoji: "💗" },
  { id: "legs", label: "腿", emoji: "🦵" },
  { id: "glutes", label: "臀", emoji: "🍑" },
  { id: "shoulders", label: "肩", emoji: "🤸" },
  { id: "arms", label: "手臂", emoji: "💪" },
  { id: "core", label: "核心", emoji: "🔥" },
  { id: "mobility", label: "灵活/热身", emoji: "🧘" },
  { id: "cardio", label: "有氧", emoji: "🏃" },
];

export interface Guide {
  equipment: string;
  setup: string;
  steps: string[];
  mistakes: string[];
  feel: string;
}

export type Muscle =
  | "trapezius"
  | "upper-back"
  | "lower-back"
  | "chest"
  | "biceps"
  | "triceps"
  | "forearm"
  | "back-deltoids"
  | "front-deltoids"
  | "abs"
  | "obliques"
  | "adductor"
  | "abductors"
  | "hamstring"
  | "quadriceps"
  | "calves"
  | "gluteal";

export const MUSCLE_LABEL: Record<Muscle, string> = {
  trapezius: "斜方肌(上背/颈后)",
  "upper-back": "背阔肌·中背",
  "lower-back": "下背(竖脊肌)",
  chest: "胸大肌",
  biceps: "肱二头肌(大臂前侧)",
  triceps: "肱三头肌(大臂后侧)",
  forearm: "前臂",
  "back-deltoids": "三角肌后束(后肩)",
  "front-deltoids": "三角肌前束/中束(肩)",
  abs: "腹直肌",
  obliques: "腹斜肌(侧腹)",
  adductor: "大腿内侧",
  abductors: "臀中肌(臀外侧)",
  hamstring: "腘绳肌(大腿后侧)",
  quadriceps: "股四头肌(大腿前侧)",
  calves: "小腿",
  gluteal: "臀大肌",
};

/** Sub-categories inside each body part, e.g. back → upper / middle / lower / rear shoulder. */
export const SUBS: Record<Group, { id: string; label: string }[]> = {
  back: [
    { id: "upper", label: "上背" },
    { id: "middle", label: "中背·背阔" },
    { id: "lower", label: "下背" },
    { id: "rear", label: "后肩" },
  ],
  chest: [
    { id: "upper", label: "上胸" },
    { id: "middle", label: "中胸" },
    { id: "lower", label: "下胸" },
  ],
  legs: [
    { id: "front", label: "大腿前侧" },
    { id: "back", label: "大腿后侧" },
    { id: "inner", label: "大腿内侧" },
    { id: "calves", label: "小腿" },
  ],
  glutes: [
    { id: "main", label: "臀大肌" },
    { id: "side", label: "臀外侧" },
  ],
  shoulders: [
    { id: "front", label: "前束" },
    { id: "side", label: "中束" },
    { id: "rear", label: "后束" },
  ],
  arms: [
    { id: "biceps", label: "二头(前侧)" },
    { id: "triceps", label: "三头(后侧)" },
  ],
  core: [
    { id: "upper", label: "上腹" },
    { id: "lower", label: "下腹" },
    { id: "obliques", label: "侧腹" },
    { id: "deep", label: "深层稳定" },
  ],
  mobility: [
    { id: "hip", label: "髋与下肢" },
    { id: "spine", label: "胸椎与脊柱" },
    { id: "shoulder", label: "肩袖与肩胛" },
  ],
  cardio: [],
};

export interface Exercise extends Guide {
  id: string;
  name: string;
  nameEn: string;
  group: Group;
  startWeight: string;
  /** Sub-category id within `group` (see SUBS). */
  sub: string;
  /** Extra "group/sub" placements, e.g. face pull also lives under back/rear. */
  alsoIn: string[];
  primary: Muscle[];
  secondary: Muscle[];
  /** Shown under the demo photos when they differ slightly from the described version. */
  imageNote?: string;
  /** The three things to remember, shown large. */
  cues: string[];
  /** Cable attachment to use and how to hold it. */
  attachment?: {
    type: "lat-bar" | "v-bar" | "rope" | "straight-bar" | "d-handle" | "ankle-strap";
    grip: string;
  };
  /** Goal id when the exercise is part of the "shaping" collection. */
  shape?: string;
}

export interface CustomExercise extends Exercise {
  isCustom: true;
  sourceUrl?: string;
  sourcePlatform?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface PlanItem {
  exerciseId?: string;
  name: string;
  nameEn?: string;
  sets: number;
  reps: string;
  restSec: number;
  weight?: string;
  note?: string;
  custom?: Guide;
}

export interface Plan {
  id: string;
  title: string;
  focus: string;
  note?: string;
  createdAt: string;
  items: PlanItem[];
}

export interface SetLog {
  weight: number | null;
  reps: number | null;
  done: boolean;
}

export interface WorkoutExercise {
  exerciseId?: string;
  name: string;
  nameEn?: string;
  target?: string;
  restSec?: number;
  note?: string;
  custom?: Guide;
  sets: SetLog[];
}

export interface WatchData {
  durationMin?: number | null;
  calories?: number | null;
  avgHr?: number | null;
  maxHr?: number | null;
  source: "manual" | "screenshot";
}

export interface Workout {
  id: string;
  title: string;
  focus: string;
  startedAt: string;
  endedAt?: string;
  exercises: WorkoutExercise[];
  feeling?: number;
  notes?: string;
  watch?: WatchData;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPES: { id: MealType; label: string; emoji: string }[] = [
  { id: "breakfast", label: "早餐", emoji: "🌅" },
  { id: "lunch", label: "午餐", emoji: "☀️" },
  { id: "dinner", label: "晚餐", emoji: "🌙" },
  { id: "snack", label: "加餐", emoji: "🍎" },
];

export interface MealItem {
  name: string;
  portion?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog {
  id: string;
  loggedAt: string;
  mealType: MealType;
  summary: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealItem[];
  advice?: string;
  image?: string;
  note?: string;
}

export interface NutritionTargets {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
}

export type Gender = "female" | "male" | "";

export interface GymEnvironment {
  id: string;
  name: string;
  scene?: string;
  equipment: string;
  /** Per-equipment specs such as dumbbell weight range or cable attachments. */
  details?: Record<string, string>;
  notes?: string;
}

export interface Profile {
  id: string;
  avatar?: string;
  name: string;
  gender?: Gender;
  age?: string;
  goal: string;
  level: string;
  daysPerWeek: string;
  equipment: string;
  gyms?: GymEnvironment[];
  activeGymId?: string;
  injuries: string;
  heightCm: string;
  weightKg: string;
  memory: string[];
  passcode: string;
  /** Read the coach's replies aloud. */
  speak: boolean;
  nutritionTarget?: NutritionTargets;
}

export type Lang = "zh" | "en";

export interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Small thumbnail (data URL) of a photo the user sent. */
  image?: string;
  plan?: Plan;
  logged?: string;
  mealLogged?: string;
  choices?: string[];
  ts: string;
}

export interface PersonWorkspace {
  profile: Profile;
  plan: Plan | null;
  active: Workout | null;
  workouts: Workout[];
  chat: ChatMsg[];
  detectiveChat: ChatMsg[];
  meals: MealLog[];
}

export interface AppState {
  activeProfileId: string;
  profiles: PersonWorkspace[];
  profile: Profile;
  plan: Plan | null;
  active: Workout | null;
  workouts: Workout[];
  chat: ChatMsg[];
  detectiveChat: ChatMsg[];
  customExercises: CustomExercise[];
  meals: MealLog[];
  aiModel: string;
  openRouterKey: string;
  lang: Lang;
}

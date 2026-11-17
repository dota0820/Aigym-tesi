import type { Group, Lang, Muscle } from "./types";

export function t<T>(lang: Lang, zh: T, en: T): T {
  return lang === "en" ? en : zh;
}

export const GROUP_LABEL_EN: Record<Group, string> = {
  back: "Back",
  chest: "Chest",
  legs: "Legs",
  glutes: "Glutes",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
  mobility: "Mobility",
  cardio: "Cardio",
};

export const MUSCLE_LABEL_EN: Record<Muscle, string> = {
  trapezius: "Trapezius (Upper Back / Neck)",
  "upper-back": "Lats & Mid Back",
  "lower-back": "Lower Back (Erector Spinae)",
  chest: "Pectoralis Major (Chest)",
  biceps: "Biceps Brachii (Front Arm)",
  triceps: "Triceps Brachii (Back Arm)",
  forearm: "Forearms",
  "back-deltoids": "Posterior Deltoid (Rear Shoulder)",
  "front-deltoids": "Anterior / Lateral Deltoid",
  abs: "Rectus Abdominis (Abs)",
  obliques: "Obliques (Side Core)",
  adductor: "Hip Adductors (Inner Thigh)",
  abductors: "Gluteus Medius / Abductors",
  hamstring: "Hamstrings (Back of Thigh)",
  quadriceps: "Quadriceps (Front of Thigh)",
  calves: "Calves",
  gluteal: "Gluteus Maximus (Glutes)",
};

export function muscleLabel(muscle: Muscle, lang: Lang): string {
  return lang === "en"
    ? MUSCLE_LABEL_EN[muscle]
    : ({
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
      })[muscle];
}

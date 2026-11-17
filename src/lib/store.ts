"use client";
import { useSyncExternalStore } from "react";
import { getProfileGyms } from "./equipment";
import type {
  AppState,
  CustomExercise,
  GymEnvironment,
  Lang,
  MealLog,
  PersonWorkspace,
  Profile,
  Workout,
  WorkoutExercise,
} from "./types";

const KEY = "gymcoach:v1";
const MAX_MEAL_THUMBS = 12;

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function emptyProfile(id = "default", patch: Partial<Profile> = {}): Profile {
  const baseEquipment = patch.equipment ?? "";
  const gyms: GymEnvironment[] =
    Array.isArray(patch.gyms) && patch.gyms.length > 0
      ? patch.gyms
      : [{ id: "gym-1", name: "Gym 1", scene: "", equipment: baseEquipment }];
  const activeGymId =
    patch.activeGymId && gyms.some((g) => g.id === patch.activeGymId)
      ? patch.activeGymId
      : gyms[0].id;
  const activeEquip = gyms.find((g) => g.id === activeGymId)?.equipment ?? baseEquipment;
  return {
    id,
    avatar: "🙂",
    name: "",
    gender: "",
    age: "",
    goal: "",
    level: "新手(刚开始健身)",
    daysPerWeek: "3",
    injuries: "",
    heightCm: "",
    weightKg: "",
    memory: [],
    passcode: "",
    speak: false,
    ...patch,
    gyms,
    activeGymId,
    equipment: activeEquip,
  };
}

export function emptyWorkspace(id = "default", patch: Partial<Profile> = {}): PersonWorkspace {
  return {
    profile: emptyProfile(id, patch),
    plan: null,
    active: null,
    workouts: [],
    chat: [],
    detectiveChat: [],
    meals: [],
  };
}

interface RootStore {
  activeProfileId: string;
  profiles: PersonWorkspace[];
  customExercises: CustomExercise[];
  passcode: string;
  aiModel: string;
  openRouterKey: string;
  lang: Lang;
}

const DEFAULT_ROOT: RootStore = {
  activeProfileId: "default",
  profiles: [emptyWorkspace("default")],
  customExercises: [],
  passcode: "",
  aiModel: "",
  openRouterKey: "",
  lang: "zh",
};

function project(root: RootStore): AppState {
  const activeWs =
    root.profiles.find((p) => p.profile.id === root.activeProfileId) ?? root.profiles[0];
  return {
    activeProfileId: activeWs.profile.id,
    profiles: root.profiles,
    profile: { ...activeWs.profile, passcode: root.passcode || activeWs.profile.passcode },
    plan: activeWs.plan,
    active: activeWs.active,
    workouts: activeWs.workouts,
    chat: activeWs.chat,
    detectiveChat: activeWs.detectiveChat ?? [],
    customExercises: root.customExercises,
    meals: activeWs.meals,
    aiModel: root.aiModel,
    openRouterKey: root.openRouterKey,
    lang: root.lang ?? "zh",
  };
}

export const EMPTY: AppState = project(DEFAULT_ROOT);

let rootState: RootStore = DEFAULT_ROOT;
let viewState: AppState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeWorkspace(raw: any, fallbackId: string, sharedPasscode: string): PersonWorkspace {
  const base = emptyWorkspace(raw?.profile?.id || fallbackId);
  const p = raw?.profile ?? {};
  const merged: Profile = {
    ...base.profile,
    ...p,
    id: p.id || fallbackId,
    memory: Array.isArray(p.memory) ? p.memory : [],
    passcode: sharedPasscode || p.passcode || "",
  };
  const { gyms, activeGym } = getProfileGyms(merged);
  return {
    profile: {
      ...merged,
      gyms,
      activeGymId: activeGym.id,
      equipment: activeGym.equipment,
    },
    plan: raw?.plan ?? null,
    active: raw?.active ?? null,
    workouts: Array.isArray(raw?.workouts) ? raw.workouts : [],
    chat: Array.isArray(raw?.chat) ? raw.chat : [],
    detectiveChat: Array.isArray(raw?.detectiveChat) ? raw.detectiveChat : [],
    meals: Array.isArray(raw?.meals) ? raw.meals : [],
  };
}

function parseRootData(p: any): RootStore | null {
  if (!p || typeof p !== "object") return null;

  const lang: Lang = p.lang === "en" ? "en" : "zh";

  // Multi-profile format
  if (Array.isArray(p.profiles) && p.profiles.length > 0) {
    const passcode = typeof p.passcode === "string" ? p.passcode : (p.profiles[0]?.profile?.passcode ?? "");
    const profiles: PersonWorkspace[] = p.profiles.map((w: any, idx: number) =>
      normalizeWorkspace(w, idx === 0 ? "default" : `p-${idx}`, passcode),
    );
    const activeProfileId = profiles.some((w) => w.profile.id === p.activeProfileId)
      ? p.activeProfileId
      : profiles[0].profile.id;
    return {
      activeProfileId,
      profiles,
      customExercises: Array.isArray(p.customExercises) ? p.customExercises : [],
      passcode,
      aiModel: typeof p.aiModel === "string" ? p.aiModel : "",
      openRouterKey: typeof p.openRouterKey === "string" ? p.openRouterKey : "",
      lang,
    };
  }

  // Legacy single-profile format
  if (p.profile) {
    const passcode = typeof p.profile.passcode === "string" ? p.profile.passcode : "";
    const ws = normalizeWorkspace(p, "default", passcode);
    return {
      activeProfileId: ws.profile.id,
      profiles: [ws],
      customExercises: Array.isArray(p.customExercises) ? p.customExercises : [],
      passcode,
      aiModel: typeof p.aiModel === "string" ? p.aiModel : "",
      openRouterKey: typeof p.openRouterKey === "string" ? p.openRouterKey : "",
      lang,
    };
  }

  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = parseRootData(JSON.parse(raw));
      if (parsed) {
        rootState = parsed;
        viewState = project(rootState);
      }
    }
  } catch {
    // corrupted or unavailable storage: start fresh
  }
}

function commit(nextRoot: RootStore) {
  rootState = nextRoot;
  viewState = project(rootState);
  try {
    localStorage.setItem(KEY, JSON.stringify(rootState));
  } catch {
    // storage full / unavailable — keep in memory
  }
  listeners.forEach((l) => l());
}

export function getState(): AppState {
  load();
  return viewState;
}

export function setState(fn: (s: AppState) => AppState) {
  load();
  const prev = viewState;
  const next = fn(prev);
  const passcode =
    next.profile.passcode !== prev.profile.passcode ? next.profile.passcode : rootState.passcode;

  const updatedProfiles = next.profiles.map((ws) => {
    if (ws.profile.id !== next.activeProfileId) {
      return passcode === rootState.passcode
        ? ws
        : { ...ws, profile: { ...ws.profile, passcode } };
    }
    return {
      profile: { ...next.profile, id: ws.profile.id, passcode },
      plan: next.plan,
      active: next.active,
      workouts: next.workouts,
      chat: next.chat,
      detectiveChat: next.detectiveChat,
      meals: next.meals,
    };
  });

  commit({
    activeProfileId: next.activeProfileId,
    profiles: updatedProfiles,
    customExercises: next.customExercises,
    passcode,
    aiModel: next.aiModel,
    openRouterKey: next.openRouterKey,
    lang: next.lang,
  });
}

export function setLang(lang: Lang) {
  load();
  commit({ ...rootState, lang });
}

export function setAiModel(id: string) {
  load();
  commit({ ...rootState, aiModel: id });
}

export function setOpenRouterKey(key: string) {
  load();
  commit({ ...rootState, openRouterKey: key.trim() });
}

/** Shared headers for all /api/* AI endpoints. */
export function aiHeaders(): Record<string, string> {
  const s = getState();
  const pass = s.profile.passcode.trim();
  const orKey = s.openRouterKey.trim() || (pass.startsWith("sk-or-") ? pass : "");
  return {
    "Content-Type": "application/json",
    "x-app-passcode": pass,
    "x-app-lang": s.lang,
    ...(s.aiModel ? { "x-ai-model": s.aiModel } : {}),
    ...(orKey ? { "x-openrouter-key": orKey } : {}),
  };
}

/** Update a specific profile workspace safely (e.g., streaming AI responses even if user switched profile). */
export function setStateForProfile(
  profileId: string,
  fn: (ws: PersonWorkspace) => PersonWorkspace,
) {
  load();
  const profiles = rootState.profiles.map((ws) =>
    ws.profile.id === profileId ? fn(ws) : ws,
  );
  commit({ ...rootState, profiles });
}

export function switchProfile(profileId: string) {
  load();
  if (!rootState.profiles.some((w) => w.profile.id === profileId)) return;
  commit({ ...rootState, activeProfileId: profileId });
}

export function createProfile(patch: Partial<Profile>, copyEquipment = true): string {
  load();
  const id = `p-${uid()}`;
  const activeProfile = viewState.profile;
  const activeEquip = activeProfile.equipment;
  const copiedGyms =
    copyEquipment && !patch.gyms
      ? getProfileGyms(activeProfile).gyms.map((g) => ({
          ...g,
          details: g.details ? { ...g.details } : undefined,
        }))
      : patch.gyms;
  const ws = emptyWorkspace(id, {
    ...patch,
    id,
    equipment: copyEquipment && !patch.equipment ? activeEquip : (patch.equipment ?? ""),
    gyms: copiedGyms,
    activeGymId: copyEquipment && !patch.activeGymId ? activeProfile.activeGymId : patch.activeGymId,
    passcode: rootState.passcode,
  });
  commit({
    ...rootState,
    activeProfileId: id,
    profiles: [...rootState.profiles, ws],
  });
  return id;
}

export function switchProfileGym(gymId: string) {
  setState((s) => {
    const { gyms } = getProfileGyms(s.profile);
    const hit = gyms.find((g) => g.id === gymId);
    if (!hit) return s;
    return {
      ...s,
      profile: {
        ...s.profile,
        gyms,
        activeGymId: hit.id,
        equipment: hit.equipment,
      },
    };
  });
}

export function saveProfileGyms(gyms: GymEnvironment[], activeGymId?: string) {
  setState((s) => {
    const normalized =
      gyms.length > 0 ? gyms : [{ id: "gym-1", name: "Gym 1", scene: "", equipment: "" }];
    const active =
      normalized.find((g) => g.id === (activeGymId ?? s.profile.activeGymId)) ?? normalized[0];
    return {
      ...s,
      profile: {
        ...s.profile,
        gyms: normalized,
        activeGymId: active.id,
        equipment: active.equipment,
      },
    };
  });
}

export function deleteProfile(profileId: string) {
  load();
  if (rootState.profiles.length <= 1) return;
  const remaining = rootState.profiles.filter((w) => w.profile.id !== profileId);
  const activeProfileId =
    rootState.activeProfileId === profileId ? remaining[0].profile.id : rootState.activeProfileId;
  commit({ ...rootState, activeProfileId, profiles: remaining });
}

export function exportRootBackup(): RootStore {
  load();
  return rootState;
}

export function importRootBackup(rawData: unknown): { profilesCount: number; workoutsCount: number } | null {
  load();
  const parsed = parseRootData(rawData);
  if (!parsed) return null;
  commit(parsed);
  const workoutsCount = parsed.profiles.reduce((n, w) => n + w.workouts.length, 0);
  return { profilesCount: parsed.profiles.length, workoutsCount };
}

export function addCustomExercise(ex: CustomExercise) {
  setState((s) => ({
    ...s,
    customExercises: [ex, ...s.customExercises.filter((x) => x.id !== ex.id)],
  }));
}

export function removeCustomExercise(id: string) {
  setState((s) => ({
    ...s,
    customExercises: s.customExercises.filter((x) => x.id !== id),
  }));
}

export function pruneMealImages(meals: MealLog[]): MealLog[] {
  let kept = 0;
  return [...meals]
    .reverse()
    .map((m) => {
      if (!m.image) return m;
      kept++;
      return kept > MAX_MEAL_THUMBS ? { ...m, image: undefined } : m;
    })
    .reverse();
}

export function addMealLog(meal: MealLog, profileId?: string) {
  if (profileId) {
    setStateForProfile(profileId, (ws) => ({
      ...ws,
      meals: pruneMealImages([...ws.meals, meal]),
    }));
    return;
  }
  setState((s) => ({
    ...s,
    meals: pruneMealImages([...s.meals, meal]),
  }));
}

export function removeMealLog(id: string) {
  setState((s) => ({
    ...s,
    meals: s.meals.filter((x) => x.id !== id),
  }));
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useApp(): AppState {
  return useSyncExternalStore(subscribe, getState, () => EMPTY);
}

/** false during SSR/hydration, true once localStorage data is readable */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function sameExercise(
  a: { exerciseId?: string; name: string },
  b: { exerciseId?: string; name: string },
) {
  if (a.exerciseId && b.exerciseId) return a.exerciseId === b.exerciseId;
  return a.name.trim().toLowerCase() === b.name.trim().toLowerCase();
}

/** Most recent logged performance of an exercise (optionally before a date). */
export function lastPerformance(
  workouts: Workout[],
  ex: { exerciseId?: string; name: string },
  beforeIso?: string,
): { workout: Workout; exercise: WorkoutExercise } | null {
  const sorted = [...workouts].sort((a, b) =>
    b.startedAt.localeCompare(a.startedAt),
  );
  for (const w of sorted) {
    if (beforeIso && w.startedAt >= beforeIso) continue;
    const hit = w.exercises.find(
      (e) => sameExercise(e, ex) && e.sets.some((s) => s.done),
    );
    if (hit) return { workout: w, exercise: hit };
  }
  return null;
}

export function setsSummary(e: WorkoutExercise): string {
  const done = e.sets.filter((s) => s.done);
  if (!done.length) return "未完成";
  return done
    .map((s) => `${s.weight ? `${s.weight}kg` : "自重"}×${s.reps ?? "?"}`)
    .join("  ");
}

export function volume(w: Workout): number {
  let v = 0;
  for (const e of w.exercises)
    for (const s of e.sets) if (s.done) v += (s.weight ?? 0) * (s.reps ?? 0);
  return Math.round(v);
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  const wk = "日一二三四五六"[d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 周${wk}`;
}

export function durationMin(w: Workout): number | null {
  if (w.watch?.durationMin) return w.watch.durationMin;
  if (!w.endedAt) return null;
  return Math.max(
    1,
    Math.round(
      (new Date(w.endedAt).getTime() - new Date(w.startedAt).getTime()) / 60000,
    ),
  );
}

/** Compact text summary of history for the AI coach. */
export function historyForCoach(workouts: Workout[], n = 8): string {
  const sorted = [...workouts]
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, n);
  if (!sorted.length) return "(还没有任何训练记录)";
  return sorted
    .map((w) => {
      const head = `【${w.startedAt.slice(0, 10)} ${w.title}】${
        durationMin(w) ? ` ${durationMin(w)}分钟` : ""
      }${w.watch?.calories ? ` ${w.watch.calories}千卡` : ""}${
        w.watch?.avgHr ? ` 平均心率${w.watch.avgHr}` : ""
      }${w.watch?.maxHr ? ` 最高心率${w.watch.maxHr}` : ""}${
        w.feeling ? ` 感受${w.feeling}/5` : ""
      }`;
      const body = w.exercises
        .map(
          (e) =>
            `- ${e.name}${e.exerciseId ? ` [${e.exerciseId}]` : ""}: ${setsSummary(e)}`,
        )
        .join("\n");
      return `${head}\n${body}${w.notes ? `\n备注: ${w.notes}` : ""}`;
    })
    .join("\n\n");
}

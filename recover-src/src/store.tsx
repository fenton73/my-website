import {
  createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import { todayKey, addDays, daysBetween } from "./lib";

/* ---------------------------------------------------------------- types -- */
export type Theme = "light" | "dark" | "system";
export type Units = "metric" | "imperial";

export interface Journal { feeling: string; wentWell: string; grateful: string; win: string; }
export interface DayRecord {
  tasks: Record<string, boolean>;
  mood: number | null;      // 1..5
  moodEmoji: string | null;
  pain: number | null;      // 0..10
  swelling: number | null;  // 0..10
  bruising: number | null;  // 0..3
  sleepHours: number | null;
  water: number;            // glasses
  weight: number | null;    // kg (stored metric)
  journal: Journal;
  notes: string;
}
export interface CustomTask { id: string; label: string; icon?: string; }
export interface Phase { id: string; label: string; icon: string; date: string | null; done: boolean; note?: string; }
export interface Goal { id: string; title: string; period: "week" | "month"; target: number; progress: number; done: boolean; createdAt: string; }
export interface Medication {
  id: string; name: string; dose: string; times: string[];
  kind: "calcium" | "vitd" | "pain" | "supplement" | "other";
  log: Record<string, string[]>; // dateKey -> array of times taken
  active: boolean;
}
export interface Appointment { id: string; title: string; date: string; location: string; notes: string; }
export interface Question { id: string; text: string; answer: string; asked: boolean; }
export interface MedNote { id: string; date: string; text: string; }
export interface DocPhoto { id: string; date: string; label: string; data: string; }
export interface AnklePhoto { id: string; date: string; note: string; data: string; }

export interface Profile {
  name: string;
  injuryDate: string;              // ISO date
  nextAppointment: string | null;  // ISO date
  footballTarget: string | null;   // ISO date
  phase: string;                   // phase id
}
export interface Settings { theme: Theme; units: Units; confetti: boolean; }

export interface State {
  version: number;
  onboarded: boolean;
  profile: Profile;
  settings: Settings;
  days: Record<string, DayRecord>;
  customTasks: CustomTask[];
  hiddenTasks: string[];
  timeline: Phase[];
  goals: Goal[];
  medications: Medication[];
  appointments: Appointment[];
  questions: Question[];
  medNotes: MedNote[];
  docs: DocPhoto[];
  anklePhotos: AnklePhoto[];
  achievementsSeen: string[];
}

/* ------------------------------------------------------------- defaults -- */
export const emptyDay = (): DayRecord => ({
  tasks: {}, mood: null, moodEmoji: null, pain: null, swelling: null, bruising: null,
  sleepHours: null, water: 0, weight: null,
  journal: { feeling: "", wentWell: "", grateful: "", win: "" }, notes: "",
});

const defaultTimeline = (injury: string): Phase[] => [
  { id: "injury", label: "Injury", icon: "bolt", date: injury, done: true },
  { id: "cast", label: "Plaster cast", icon: "cast", date: injury, done: true },
  { id: "boot", label: "Walking boot", icon: "boot", date: null, done: false },
  { id: "pwb", label: "Partial weight bearing", icon: "steps", date: null, done: false },
  { id: "walk", label: "Walking unaided", icon: "walk", date: null, done: false },
  { id: "physio", label: "Physiotherapy", icon: "physio", date: null, done: false },
  { id: "jog", label: "Jogging", icon: "jog", date: null, done: false },
  { id: "run", label: "Running", icon: "run", date: null, done: false },
  { id: "sport", label: "Return to sport drills", icon: "ball", date: null, done: false },
  { id: "football", label: "Return to football", icon: "trophy", date: null, done: false },
];

export function defaultState(): State {
  // Pre-loaded for the current user. Change these any time in Settings → Your
  // profile (dates) and the Medication page (reminders) — nothing here is fixed.
  const injury = "2026-07-11";           // injury: 11 July 2026 (~5pm)
  const nextAppt = "2026-07-24";         // fracture-clinic appointment: 24 July 2026
  return {
    version: 1,
    onboarded: false,
    profile: {
      name: "",
      injuryDate: injury,
      nextAppointment: nextAppt,
      footballTarget: null,
      phase: "cast",
    },
    settings: { theme: "system", units: "metric", confetti: true },
    days: {},
    customTasks: [],
    hiddenTasks: [],
    timeline: defaultTimeline(injury),
    goals: [],
    medications: [
      // Daily 8:30pm injection reminder. Tick the 20:30 chip each evening to log it.
      { id: "injection", name: "Injection", dose: "As prescribed — 8:30pm daily", times: ["20:30"], kind: "other", log: {}, active: true },
    ],
    appointments: [
      { id: "appt-clinic", title: "Fracture clinic", date: nextAppt, location: "", notes: "First follow-up after the cast." },
    ],
    questions: [],
    medNotes: [],
    docs: [],
    anklePhotos: [],
    achievementsSeen: [],
  };
}

/* ------------------------------------------------------------- persistence */
const KEY = "recoverplus.v1";

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...parsed.settings }, profile: { ...defaultState().profile, ...parsed.profile } };
  } catch {
    return defaultState();
  }
}

/* --------------------------------------------------------------- context -- */
interface Ctx {
  state: State;
  set: (updater: (draft: State) => void) => void;
  today: string;
  day: DayRecord;
  setDay: (dateKey: string, updater: (d: DayRecord) => void) => void;
  reset: () => void;
  replace: (next: State) => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);
  const [today, setToday] = useState(todayKey());
  const saveTimer = useRef<number | null>(null);

  // Persist (debounced) whenever state changes.
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    }, 180);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [state]);

  // Keep "today" fresh if the app is left open across midnight.
  useEffect(() => {
    const t = window.setInterval(() => {
      const k = todayKey();
      setToday((prev) => (prev !== k ? k : prev));
    }, 60_000);
    return () => window.clearInterval(t);
  }, []);

  // Apply theme to <html>.
  useEffect(() => {
    const apply = () => {
      const t = state.settings.theme;
      const resolved = t === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : t;
      document.documentElement.setAttribute("data-theme", resolved);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", resolved === "dark" ? "#0a1020" : "#337dff");
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => state.settings.theme === "system" && apply();
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, [state.settings.theme]);

  const set = (updater: (draft: State) => void) =>
    setState((prev) => { const next = structuredCloneSafe(prev); updater(next); return next; });

  const setDay = (dateKey: string, updater: (d: DayRecord) => void) =>
    setState((prev) => {
      const next = structuredCloneSafe(prev);
      const d = next.days[dateKey] ?? emptyDay();
      updater(d);
      next.days[dateKey] = d;
      return next;
    });

  const reset = () => { localStorage.removeItem(KEY); setState(defaultState()); };
  const replace = (next: State) => setState({ ...defaultState(), ...next });

  const day = state.days[today] ?? emptyDay();

  const value = useMemo<Ctx>(() => ({ state, set, today, day, setDay, reset, replace }),
    [state, today]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function structuredCloneSafe<T>(v: T): T {
  try { return structuredClone(v); } catch { return JSON.parse(JSON.stringify(v)); }
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}

/* --------------------------------------------------------------- derived -- */
export function useDaysSinceInjury(state: State): number {
  return Math.max(0, daysBetween(state.profile.injuryDate, todayKey()));
}

export function getDay(state: State, key: string): DayRecord {
  return state.days[key] ?? emptyDay();
}

/** Recent day keys (oldest → newest), inclusive of today. */
export function recentKeys(n: number, end = todayKey()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

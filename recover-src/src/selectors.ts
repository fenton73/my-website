import type { State, DayRecord } from "./store";
import { getDay, recentKeys } from "./store";
import { DEFAULT_TASKS, ACHIEVEMENTS, type TaskDef } from "./content";
import { addDays, todayKey } from "./lib";
import type { IconName } from "./icons";

export const WATER_GOAL = 8; // glasses

export interface ActiveTask { id: string; label: string; icon: IconName; group: string; custom: boolean; }

export function activeTasks(state: State): ActiveTask[] {
  const base: ActiveTask[] = DEFAULT_TASKS
    .filter((t) => !state.hiddenTasks.includes(t.id))
    .map((t: TaskDef) => ({ id: t.id, label: t.label, icon: t.icon, group: t.group, custom: false }));
  const custom: ActiveTask[] = state.customTasks.map((t) => ({
    id: t.id, label: t.label, icon: (t.icon as IconName) ?? "circle", group: "custom", custom: true,
  }));
  return [...base, ...custom];
}

export function dayCompletion(state: State, dateKey: string): { done: number; total: number; pct: number } {
  const tasks = activeTasks(state);
  const rec = getDay(state, dateKey);
  const done = tasks.filter((t) => rec.tasks[t.id]).length;
  const total = tasks.length || 1;
  return { done, total, pct: Math.round((done / total) * 100) };
}

/** Whether the day counts toward the "checklist" streak (>=80% done). */
function checklistHit(state: State, key: string): boolean {
  const { pct } = dayCompletion(state, key);
  return pct >= 80;
}

type Predicate = (d: DayRecord, state: State, key: string) => boolean;

function streak(state: State, pred: (key: string) => boolean): number {
  // Count consecutive days ending today (or yesterday if today not yet done).
  let count = 0;
  let key = todayKey();
  if (!pred(key)) key = addDays(key, -1); // allow "today not done yet"
  while (pred(key)) { count++; key = addDays(key, -1); if (count > 400) break; }
  return count;
}

export interface StreakInfo { id: string; label: string; icon: IconName; tone: string; days: number; }

export function streaks(state: State): StreakInfo[] {
  const has = (key: string, f: Predicate) => f(getDay(state, key), state, key);
  return [
    { id: "checklist", label: "Checklist", icon: "checkCircle", tone: "mint",
      days: streak(state, (k) => checklistHit(state, k)) },
    { id: "water", label: "Hydration", icon: "droplet", tone: "brand",
      days: streak(state, (k) => has(k, (d) => d.water >= WATER_GOAL)) },
    { id: "sleep", label: "Sleep", icon: "bed", tone: "violet",
      days: streak(state, (k) => has(k, (d) => (d.sleepHours ?? 0) >= 8)) },
    { id: "mood", label: "Mood check", icon: "smile", tone: "amber",
      days: streak(state, (k) => has(k, (d) => d.mood != null)) },
    { id: "journal", label: "Journal", icon: "book", tone: "mint",
      days: streak(state, (k) => has(k, (d) => journaled(d))) },
  ];
}

export function journaled(d: DayRecord): boolean {
  const j = d.journal;
  return !!(j.feeling || j.wentWell || j.grateful || j.win);
}

/** The single "best" streak for the home card. */
export function checklistStreak(state: State): number {
  return streak(state, (k) => checklistHit(state, k));
}

/* ------------------------------------------------------------ achievements */
export function earnedAchievements(state: State): Set<string> {
  const earned = new Set<string>();
  const keys = Object.keys(state.days);
  const last60 = recentKeys(60);

  const anyTaskDone = keys.some((k) => Object.values(state.days[k].tasks).some(Boolean));
  if (anyTaskDone) earned.add("firstday");

  const daysSince = Math.max(0, Math.round((Date.parse(todayKey()) - Date.parse(state.profile.injuryDate)) / 86400000));
  if (daysSince >= 7) earned.add("firstweek");

  const waterDays = last60.filter((k) => getDay(state, k).water >= WATER_GOAL).length;
  if (waterDays >= 5) earned.add("hydrated");

  const perfect = keys.some((k) => { const c = dayCompletion(state, k); return c.total > 0 && c.done === c.total; });
  if (perfect) earned.add("perfectday");

  if (checklistStreak(state) >= 7) earned.add("perfectweek");

  const activeDays = keys.filter((k) => {
    const d = state.days[k];
    return Object.values(d.tasks).some(Boolean) || d.mood != null || d.pain != null || journaled(d);
  }).length;
  if (activeDays >= 14) earned.add("warrior");

  const goodMood = last60.filter((k) => (getDay(state, k).mood ?? 0) >= 4).length;
  if (goodMood >= 5) earned.add("positive");

  const journals = keys.filter((k) => journaled(state.days[k])).length;
  if (journals >= 7) earned.add("journalist");

  const goodSleep = last60.filter((k) => (getDay(state, k).sleepHours ?? 0) >= 8).length;
  if (goodSleep >= 5) earned.add("restful");

  if (state.questions.length >= 3) earned.add("prepared");

  return earned;
}

export function achievementProgress(state: State): { total: number; earned: number } {
  return { total: ACHIEVEMENTS.length, earned: earnedAchievements(state).size };
}

/* ------------------------------------------------------------ recovery score */
export function recoveryScore(state: State): number {
  // A gentle 0..100 "how well set up for healing" score for today.
  const d = getDay(state, todayKey());
  const c = dayCompletion(state, todayKey());
  let score = 0;
  score += c.pct * 0.5;                                  // 50% checklist
  score += Math.min(1, d.water / WATER_GOAL) * 20;       // 20% hydration
  score += Math.min(1, (d.sleepHours ?? 0) / 8) * 20;    // 20% sleep
  score += (d.mood ? (d.mood / 5) * 10 : 0);             // 10% mood
  return Math.round(Math.max(0, Math.min(100, score)));
}

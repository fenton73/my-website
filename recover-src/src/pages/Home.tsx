import { motion } from "framer-motion";
import { useStore, useDaysSinceInjury } from "../store";
import { useNav } from "../nav";
import {
  Card, ProgressRing, Stat, Chip, ProgressBar, Segmented, DisclaimerFooter,
  DoctorFirstBanner, SectionTitle, Button,
} from "../ui";
import { Icon } from "../icons";
import { greeting, formatNice, daysBetween, todayKey, pickDaily, confettiBurst, haptic } from "../lib";
import { QUOTES, FACTS, MOODS, PHASE_LABELS } from "../content";
import { dayCompletion, checklistStreak, recoveryScore, WATER_GOAL } from "../selectors";
import { useEffect, useRef } from "react";

export default function Home() {
  const { state, today, day, setDay } = useStore();
  const { go } = useNav();
  const daysSince = useDaysSinceInjury(state);
  const comp = dayCompletion(state, today);
  const streak = checklistStreak(state);
  const score = recoveryScore(state);
  const quote = pickDaily(QUOTES);
  const fact = pickDaily(FACTS);
  const name = state.profile.name?.trim();

  // Confetti when the checklist reaches 100% (once per day).
  const celebrated = useRef(false);
  useEffect(() => {
    if (comp.pct === 100 && !celebrated.current) {
      celebrated.current = true;
      if (state.settings.confetti) confettiBurst();
    }
    if (comp.pct < 100) celebrated.current = false;
  }, [comp.pct, state.settings.confetti]);

  const nextAppt = state.profile.nextAppointment;
  const apptDays = nextAppt ? daysBetween(todayKey(), nextAppt) : null;
  const footballTarget = state.profile.footballTarget;
  const footballDays = footballTarget ? daysBetween(todayKey(), footballTarget) : null;

  return (
    <div className="space-y-3">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-muted text-[15px]">{greeting()}{name ? "," : ""}</p>
        <h1 className="text-[30px] font-bold tracking-tight leading-tight">
          {name ? name : "Let's heal well today"} <span className="inline-block">👋</span>
        </h1>
      </motion.div>

      <DoctorFirstBanner />

      {/* Progress ring hero */}
      <Card className="!p-6">
        <div className="flex flex-col items-center text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted mb-4">Today’s recovery progress</p>
          <ProgressRing value={comp.pct} size={196} stroke={18}>
            <div>
              <div className="text-[44px] font-bold leading-none tracking-tight gradient-text">{comp.pct}%</div>
              <div className="text-[13px] text-muted mt-1">complete</div>
            </div>
          </ProgressRing>
          <p className="mt-4 text-[15px] font-medium">
            You’ve completed <span className="font-bold">{comp.done}</span> of{" "}
            <span className="font-bold">{comp.total}</span> recovery tasks today.
          </p>
          <Button className="mt-4" icon="list" onClick={() => go("checklist")}>Open today’s checklist</Button>
        </div>
      </Card>

      {/* Quote */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
        className="card !p-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-4 opacity-10"><Icon name="sparkles" size={110} /></div>
        <Icon name="sparkles" size={22} className="text-brand-500 mb-2" />
        <p className="text-[19px] font-semibold leading-snug tracking-tight">“{quote.text}”</p>
        <p className="text-muted text-[13px] mt-2">— {quote.author}</p>
      </motion.div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-4"><Stat icon="flame" tone="amber" value={`${streak}`} sub={streak === 1 ? "day streak" : "day streak"} label="streak" /></Card>
        <Card className="!p-4" onClick={() => go("timeline")}>
          <Stat icon="calendar" tone="brand" value={daysSince} sub={daysSince === 1 ? "day since injury" : "days since injury"} label="since injury" />
        </Card>
        <Card className="!p-4" onClick={() => go("insights")}>
          <Stat icon="gauge" tone="mint" value={score} sub="recovery score" label="score" />
        </Card>
        <Card className="!p-4" onClick={() => go("mood")}>
          <Stat icon="smile" tone="violet" value={day.mood ? MOODS[day.mood - 1].emoji : "—"} sub="today’s mood" label="mood" />
        </Card>
      </div>

      {/* Current phase */}
      <Card onClick={() => go("timeline")} hover>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white">
              <Icon name="route" size={22} />
            </span>
            <div>
              <p className="text-[12.5px] text-muted">Current recovery phase</p>
              <p className="font-bold text-[17px]">{PHASE_LABELS[state.profile.phase] ?? "In recovery"}</p>
            </div>
          </div>
          <Icon name="chevronRight" className="text-muted" />
        </div>
      </Card>

      {/* Countdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card onClick={() => go("hospital")} hover className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shrink-0"><Icon name="hospital" size={20} /></span>
            <div className="min-w-0">
              <p className="text-[12.5px] text-muted">Next hospital appointment</p>
              {nextAppt ? (
                <>
                  <p className="font-bold text-[17px]">{apptDays! > 0 ? `In ${apptDays} day${apptDays === 1 ? "" : "s"}` : apptDays === 0 ? "Today" : "Set a new date"}</p>
                  <p className="text-[12.5px] text-muted truncate">{formatNice(nextAppt)}</p>
                </>
              ) : <p className="font-semibold text-brand-600 dark:text-brand-300 text-[15px] mt-0.5">Tap to add a date</p>}
            </div>
          </div>
        </Card>
        <Card onClick={() => go("timeline")} hover className="!p-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-mint-500 to-mint-600 text-white shrink-0"><Icon name="ball" size={20} /></span>
            <div className="min-w-0">
              <p className="text-[12.5px] text-muted">Return to football goal</p>
              {footballTarget ? (
                <>
                  <p className="font-bold text-[17px]">{footballDays! > 0 ? `${footballDays} days to go` : "You've reached it!"}</p>
                  <p className="text-[12.5px] text-muted truncate">{formatNice(footballTarget)}</p>
                </>
              ) : <p className="font-semibold text-mint-600 dark:text-mint-400 text-[15px] mt-0.5">Tap to set a target</p>}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick trackers */}
      <SectionTitle right={<button className="text-[13px] font-semibold text-brand-600 dark:text-brand-300" onClick={() => go("pain")}>Details</button>}>
        Quick check-in
      </SectionTitle>

      <Card className="!p-5 space-y-4">
        {/* Water */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-semibold text-[15px]"><Icon name="droplet" size={18} className="text-brand-500" /> Water</span>
            <span className="text-muted text-[14px]">{day.water} / {WATER_GOAL} glasses</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: WATER_GOAL }).map((_, i) => (
              <button key={i} aria-label={`Set ${i + 1} glasses`}
                onClick={() => { haptic(); setDay(today, (d) => { d.water = d.water === i + 1 ? i : i + 1; }); }}
                className={`flex-1 h-9 rounded-xl tap transition-colors ${i < day.water ? "bg-gradient-to-b from-brand-400 to-brand-600" : "bg-black/6 dark:bg-white/8"}`} />
            ))}
          </div>
        </div>

        {/* Mood quick */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-semibold text-[15px]"><Icon name="smile" size={18} className="text-violet-500" /> Mood</span>
          </div>
          <div className="flex justify-between">
            {MOODS.map((m) => (
              <button key={m.v} onClick={() => { haptic(); setDay(today, (d) => { d.mood = m.v; d.moodEmoji = m.emoji; }); }}
                className={`text-[30px] leading-none w-12 h-12 rounded-2xl grid place-items-center tap transition-all ${day.mood === m.v ? "bg-violet-500/15 scale-110" : "opacity-55 hover:opacity-100"}`}>
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Pain quick */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-2 font-semibold text-[15px]"><Icon name="activity" size={18} className="text-rose-500" /> Pain</span>
            <span className="text-muted text-[14px]">{day.pain != null ? `${day.pain}/10` : "not logged"}</span>
          </div>
          <input type="range" min={0} max={10} value={day.pain ?? 0}
            onChange={(e) => setDay(today, (d) => { d.pain = Number(e.target.value); })}
            className="w-full h-7" />
          <div className="flex justify-between text-[12px] text-muted"><span>No pain</span><span>Worst</span></div>
        </div>
      </Card>

      {/* Fact of the day */}
      <Card className="!p-5">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-mint-500/15 text-mint-600 dark:text-mint-400 shrink-0"><Icon name="info" size={20} /></span>
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">Recovery fact</p>
            <p className="text-[15px] mt-1 leading-relaxed">{fact}</p>
          </div>
        </div>
      </Card>

      {/* Shortcuts */}
      <SectionTitle>Jump to</SectionTitle>
      <div className="grid grid-cols-4 gap-3">
        {([
          ["nutrition", "nutrition", "Nutrition", "mint"],
          ["learn", "book", "Learn", "brand"],
          ["warnings", "warning", "Warnings", "rose"],
          ["goals", "target", "Goals", "amber"],
        ] as const).map(([r, icon, label, tone]) => (
          <button key={r} onClick={() => go(r)} className="tap flex flex-col items-center gap-1.5">
            <span className={`grid place-items-center w-14 h-14 rounded-3xl text-white bg-gradient-to-br ${tone === "mint" ? "from-mint-400 to-mint-600" : tone === "brand" ? "from-brand-500 to-brand-600" : tone === "rose" ? "from-rose-400 to-red-500" : "from-amber-400 to-orange-500"} shadow-glass`}>
              <Icon name={icon as any} size={24} />
            </span>
            <span className="text-[12px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      <DisclaimerFooter />
    </div>
  );
}

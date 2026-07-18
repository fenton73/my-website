import { useEffect, useState } from "react";
import { useStore, getDay, recentKeys } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, SectionTitle, ProgressRing, LineChart, BarChart, Stat, Button, Chip,
} from "../ui";
import { Icon } from "../icons";
import { recoveryScore, dayCompletion, WATER_GOAL, streaks } from "../selectors";
import { todayKey, formatShort, haptic } from "../lib";

export default function Insights() {
  const { state, today, day, setDay } = useStore();
  const score = recoveryScore(state);
  const keys14 = recentKeys(14);
  const keys7 = recentKeys(7);

  const water14 = keys14.map((k) => getDay(state, k).water);
  const sleep14 = keys14.map((k) => getDay(state, k).sleepHours);
  const weight30 = recentKeys(30).map((k) => getDay(state, k).weight);
  const hasWeight = weight30.some((w) => w != null);

  // Weekly review numbers
  const moods7 = keys7.map((k) => getDay(state, k).mood).filter((m): m is number => m != null);
  const pain7 = keys7.map((k) => getDay(state, k).pain).filter((p): p is number => p != null);
  const tasks7 = keys7.reduce((sum, k) => sum + dayCompletion(state, k).done, 0);
  const avgMood = moods7.length ? (moods7.reduce((a, b) => a + b, 0) / moods7.length) : null;
  const avgPain = pain7.length ? (pain7.reduce((a, b) => a + b, 0) / pain7.length) : null;
  const bestStreak = Math.max(0, ...streaks(state).map((s) => s.days));

  const scoreMsg = score >= 80 ? "Outstanding — you’re giving your body brilliant conditions to heal."
    : score >= 55 ? "Solid day. A little more water, sleep or a few tasks will lift this higher."
    : score >= 30 ? "A gentle day. Try one more small habit — every bit helps."
    : "Let’s start small: a glass of water and one checklist tick is a great first step.";

  return (
    <div>
      <PageHeader title="Insights" subtitle="See the patterns behind your recovery" icon="insights" />

      {/* Recovery score */}
      <Card className="!p-6 flex flex-col items-center text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted mb-3">Today’s recovery score</p>
        <ProgressRing value={score} size={168} stroke={16}>
          <div><div className="text-[40px] font-bold gradient-text leading-none">{score}</div><div className="text-[12px] text-muted mt-1">out of 100</div></div>
        </ProgressRing>
        <p className="text-[14px] mt-4 max-w-sm leading-relaxed">{scoreMsg}</p>
        <p className="text-[12px] text-muted mt-2">Blends your checklist, hydration, sleep and mood for today.</p>
      </Card>

      {/* Weekly review */}
      <SectionTitle>This week’s review</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Card className="!p-4"><Stat icon="smile" tone="violet" value={avgMood ? avgMood.toFixed(1) : "—"} sub="avg mood /5" label="mood" /></Card>
        <Card className="!p-4"><Stat icon="activity" tone="rose" value={avgPain != null ? avgPain.toFixed(1) : "—"} sub="avg pain /10" label="pain" /></Card>
        <Card className="!p-4"><Stat icon="checkCircle" tone="mint" value={tasks7} sub="tasks completed" label="tasks" /></Card>
        <Card className="!p-4"><Stat icon="flame" tone="amber" value={bestStreak} sub="best streak" label="streak" /></Card>
      </div>

      {/* Sleep tracker */}
      <SectionTitle>Sleep</SectionTitle>
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 font-semibold"><Icon name="bed" size={18} className="text-violet-500" /> Last night</span>
          <span className="font-bold">{day.sleepHours != null ? `${day.sleepHours} hrs` : "—"}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[5, 6, 7, 8, 9, 10, 11].map((h) => (
            <button key={h} onClick={() => { haptic(); setDay(today, (d) => { d.sleepHours = d.sleepHours === h ? null : h; }); }}
              className={`tap px-3.5 py-2 rounded-xl text-[14px] font-semibold ${day.sleepHours === h ? "bg-violet-500 text-white" : "bg-black/5 dark:bg-white/8 text-muted"}`}>{h}h</button>
          ))}
        </div>
        {sleep14.some((s) => s != null) && (
          <div className="mt-4"><LineChart data={sleep14} min={0} max={12} tone="#8b5cf6" height={100} />
            <div className="flex justify-between text-[11px] text-muted px-1"><span>{formatShort(keys14[0])}</span><span>{formatShort(keys14[13])}</span></div></div>
        )}
      </Card>

      {/* Water 14d */}
      <SectionTitle>Hydration · 14 days</SectionTitle>
      <Card className="!p-5">
        <BarChart data={water14} max={WATER_GOAL} tone="#337dff" height={90} />
        <div className="flex justify-between text-[11px] text-muted mt-1"><span>{formatShort(keys14[0])}</span><span>goal {WATER_GOAL}/day</span><span>{formatShort(keys14[13])}</span></div>
      </Card>

      {/* Weight tracker (optional) */}
      <SectionTitle right={<Chip tone="neutral">optional</Chip>}>Weight</SectionTitle>
      <Card className="!p-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 font-semibold"><Icon name="weight" size={18} className="text-mint-500" /> Today</span>
          <input type="number" inputMode="decimal" placeholder="—" value={day.weight ?? ""}
            onChange={(e) => setDay(today, (d) => { d.weight = e.target.value ? Number(e.target.value) : null; })}
            className="w-24 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/8 outline-none text-[15px] text-center" />
          <span className="text-muted text-[14px]">{state.settings.units === "metric" ? "kg" : "lb"}</span>
        </div>
        {hasWeight ? (
          <div className="mt-4"><LineChart data={weight30} tone="#12c98a" height={100} fill={false} /></div>
        ) : <p className="text-[13px] text-muted mt-3">Tracking weight is completely optional. Log it if you and your team find it useful.</p>}
      </Card>

      <FreshAir />

      <DisclaimerFooter />
    </div>
  );
}

/* -------- Fresh-air widget: tries live weather when online, else encourages -- */
function FreshAir() {
  const [wx, setWx] = useState<{ temp: number; code: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "off">("idle");

  const load = () => {
    if (!("geolocation" in navigator)) { setStatus("off"); return; }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current=temperature_2m,weather_code`);
        const j = await r.json();
        setWx({ temp: Math.round(j.current.temperature_2m), code: j.current.weather_code });
        setStatus("done");
      } catch { setStatus("off"); }
    }, () => setStatus("off"), { timeout: 8000 });
  };

  const desc = (c: number) => c === 0 ? "Clear skies" : c < 4 ? "Partly cloudy" : c < 50 ? "Cloudy or misty" : c < 70 ? "Rainy" : c < 80 ? "Snowy" : "Stormy";
  const nice = wx && wx.code < 50 && wx.temp >= 8;

  return (
    <>
      <SectionTitle>Fresh air</SectionTitle>
      <Card className="!p-5 bg-gradient-to-br from-brand-400/12 to-mint-400/12">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shrink-0"><Icon name="cloudSun" size={24} /></span>
          <div className="flex-1">
            {status === "done" && wx ? (
              <>
                <p className="font-bold text-[16px]">{wx.temp}° · {desc(wx.code)}</p>
                <p className="text-[13.5px] text-muted mt-0.5 leading-relaxed">
                  {nice ? "Lovely conditions — if your team allows, a little time outside (ankle elevated) can lift your mood and top up vitamin D."
                        : "Wrap up warm and get near a window or doorway for some daylight. Even a few minutes of fresh air helps."}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-[16px]">Get some daylight today</p>
                <p className="text-[13.5px] text-muted mt-0.5 leading-relaxed">Safe time outside or by a bright window supports vitamin D, sleep and mood. Keep the cast dry and your ankle comfy.</p>
                {status !== "off" && <Button size="sm" className="mt-2" variant="secondary" icon="cloudSun" onClick={load}>{status === "loading" ? "Checking…" : "Check my weather"}</Button>}
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

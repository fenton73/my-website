import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader, Card, DisclaimerFooter, Button } from "../ui";
import { useStore } from "../store";
import { BREATH_PATTERN } from "../content";
import { todayKey, haptic } from "../lib";

type Phase = "inhale" | "hold" | "exhale";
const ORDER: Phase[] = ["inhale", "hold", "exhale"];
const LABEL: Record<Phase, string> = { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out" };

export default function Breathe() {
  const { today, setDay } = useStore();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [count, setCount] = useState(BREATH_PATTERN.inhale);
  const [cycles, setCycles] = useState(0);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        haptic(10);
        setPhase((p) => {
          const next = ORDER[(ORDER.indexOf(p) + 1) % ORDER.length];
          if (next === "inhale") setCycles((n) => n + 1);
          return next;
        });
        return -1; // replaced below by phase effect
      });
    }, 1000);
    return () => { if (tick.current) window.clearInterval(tick.current); };
  }, [running]);

  // Reset the counter whenever the phase changes.
  useEffect(() => { setCount(BREATH_PATTERN[phase]); }, [phase]);

  const start = () => { setRunning(true); setPhase("inhale"); setCount(BREATH_PATTERN.inhale); };
  const stop = () => {
    setRunning(false);
    if (cycles >= 1) setDay(today, (d) => { d.tasks["breathe"] = true; });
  };

  const scale = phase === "inhale" ? 1.35 : phase === "hold" ? 1.35 : 0.75;
  const dur = BREATH_PATTERN[phase];

  return (
    <div>
      <PageHeader title="Breathing exercise" subtitle="A calm 4·7·8 breath to ease tension and pain" icon="wind" />

      <Card className="!p-6 flex flex-col items-center">
        <div className="relative grid place-items-center my-6" style={{ width: 240, height: 240 }}>
          <motion.div className="absolute rounded-full bg-gradient-to-br from-brand-400/40 to-mint-400/40 blur-xl"
            animate={{ scale: running ? scale : 1 }} transition={{ duration: running ? dur : 0.6, ease: "easeInOut" }}
            style={{ width: 200, height: 200 }} />
          <motion.div className="absolute rounded-full bg-gradient-to-br from-brand-500 to-mint-500"
            animate={{ scale: running ? scale : 1 }} transition={{ duration: running ? dur : 0.6, ease: "easeInOut" }}
            style={{ width: 150, height: 150 }} />
          <div className="relative z-10 text-white text-center">
            <div className="text-[15px] font-semibold opacity-90">{running ? LABEL[phase] : "Ready?"}</div>
            <div className="text-[46px] font-bold leading-none">{running ? Math.max(1, count) : "🌿"}</div>
          </div>
        </div>

        <p className="text-muted text-[14px] mb-4">{running ? `Cycle ${cycles + 1} · in 4 · hold 7 · out 8` : "Follow the circle. In for 4, hold for 7, out for 8."}</p>

        {!running
          ? <Button size="lg" icon="wind" onClick={start}>Start breathing</Button>
          : <Button size="lg" variant="secondary" icon="check" onClick={stop}>Finish {cycles >= 1 ? `(${cycles} cycles)` : ""}</Button>}
      </Card>

      <Card className="!p-5 mt-3">
        <p className="font-semibold mb-1">Why it helps</p>
        <p className="text-[14px] text-muted leading-relaxed">
          Slow breathing calms your nervous system, which can ease pain perception, lower stress and help you sleep.
          Do it whenever the ankle feels sore or your mind feels busy. Completing a cycle ticks off your breathing task for today.
        </p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

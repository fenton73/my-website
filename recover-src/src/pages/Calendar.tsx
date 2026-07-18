import { useState } from "react";
import { motion } from "framer-motion";
import { useStore, getDay } from "../store";
import { PageHeader, Card, DisclaimerFooter, Modal, Chip, ProgressBar } from "../ui";
import { Icon } from "../icons";
import { todayKey, parseKey, formatNice, daysBetween } from "../lib";
import { dayCompletion, journaled } from "../selectors";
import { MOODS } from "../content";

function monthMatrix(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar() {
  const { state } = useStore();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState<string | null>(null);
  const cells = monthMatrix(ym.y, ym.m);
  const monthName = new Date(ym.y, ym.m, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const t = todayKey();

  const move = (delta: number) => setYm(({ y, m }) => {
    const d = new Date(y, m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() };
  });

  const selDay = sel ? getDay(state, sel) : null;
  const selComp = sel ? dayCompletion(state, sel) : null;

  return (
    <div>
      <PageHeader title="Recovery calendar" subtitle="Every logged day, at a glance" icon="calendar" />

      <Card className="!p-5">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => move(-1)} className="tap w-9 h-9 grid place-items-center rounded-full bg-black/5 dark:bg-white/8"><Icon name="chevronLeft" size={18} /></button>
          <p className="font-bold text-[16px]">{monthName}</p>
          <button onClick={() => move(1)} className="tap w-9 h-9 grid place-items-center rounded-full bg-black/5 dark:bg-white/8"><Icon name="chevronRight" size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted mb-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((key, i) => {
            if (!key) return <div key={i} />;
            const comp = dayCompletion(state, key);
            const d = getDay(state, key);
            const isToday = key === t;
            const isFuture = daysBetween(t, key) > 0;
            const hasData = comp.done > 0 || d.mood != null || d.pain != null || journaled(d);
            const num = parseKey(key).getDate();
            return (
              <button key={key} onClick={() => setSel(key)} disabled={isFuture}
                className={`tap aspect-square rounded-xl grid place-items-center relative text-[13px] font-medium ${isToday ? "ring-2 ring-brand-500" : ""} ${isFuture ? "opacity-30" : ""}`}
                style={{ background: hasData ? `linear-gradient(135deg, rgba(51,125,255,${0.12 + comp.pct / 250}), rgba(18,201,138,${0.12 + comp.pct / 250}))` : "rgba(127,127,127,0.06)" }}>
                <span>{num}</span>
                {d.mood != null && <span className="absolute bottom-0.5 text-[9px]">{MOODS[d.mood - 1].emoji}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[11px] text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gradient-to-br from-brand-500 to-mint-500" /> logged</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-brand-500" /> today</span>
        </div>
      </Card>

      <Modal open={!!sel} onClose={() => setSel(null)} title={sel ? formatNice(sel) : ""}>
        {sel && selDay && selComp && (
          <div className="space-y-3">
            <div><div className="flex justify-between text-[14px] mb-1"><span className="font-semibold">Checklist</span><span className="text-muted">{selComp.done}/{selComp.total}</span></div><ProgressBar value={selComp.pct} tone="mint" /></div>
            <div className="grid grid-cols-2 gap-2">
              <Info label="Mood" value={selDay.mood ? `${MOODS[selDay.mood - 1].emoji} ${MOODS[selDay.mood - 1].label}` : "—"} />
              <Info label="Pain" value={selDay.pain != null ? `${selDay.pain}/10` : "—"} />
              <Info label="Swelling" value={selDay.swelling != null ? `${selDay.swelling}/10` : "—"} />
              <Info label="Water" value={`${selDay.water} glasses`} />
              <Info label="Sleep" value={selDay.sleepHours != null ? `${selDay.sleepHours} hrs` : "—"} />
              <Info label="Journal" value={journaled(selDay) ? "Written ✍️" : "—"} />
            </div>
            {selDay.notes && <Card className="!p-3 !bg-black/4 dark:!bg-white/5"><p className="text-[13px] text-muted mb-0.5">Notes</p><p className="text-[14px]">{selDay.notes}</p></Card>}
            {journaled(selDay) && (
              <Card className="!p-3 !bg-black/4 dark:!bg-white/5 space-y-1.5">
                {selDay.journal.win && <p className="text-[14px]"><span className="text-muted">Win: </span>{selDay.journal.win}</p>}
                {selDay.journal.grateful && <p className="text-[14px]"><span className="text-muted">Grateful: </span>{selDay.journal.grateful}</p>}
                {selDay.journal.wentWell && <p className="text-[14px]"><span className="text-muted">Went well: </span>{selDay.journal.wentWell}</p>}
              </Card>
            )}
          </div>
        )}
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-black/4 dark:bg-white/6 px-3 py-2"><p className="text-[11.5px] text-muted">{label}</p><p className="text-[14.5px] font-semibold">{value}</p></div>;
}

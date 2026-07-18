import { useState } from "react";
import { useStore } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, Button, Modal, Field, Input, Segmented, EmptyState, ProgressBar, Chip, SectionTitle,
} from "../ui";
import { Icon } from "../icons";
import { uid, todayKey, haptic } from "../lib";
import { GOAL_TEMPLATES } from "../content";
import type { Goal } from "../store";

export default function Goals() {
  const { state, set } = useStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [target, setTarget] = useState(7);

  const add = (t?: { title: string; period: "week" | "month"; target: number }) => {
    const g = t ?? { title: title.trim(), period, target };
    if (!g.title) return;
    set((s) => { s.goals.unshift({ id: uid(), title: g.title, period: g.period, target: g.target, progress: 0, done: false, createdAt: todayKey() }); });
    setTitle(""); setOpen(false);
  };

  const bump = (g: Goal, delta: number) => {
    haptic();
    set((s) => {
      const goal = s.goals.find((x) => x.id === g.id)!;
      goal.progress = Math.max(0, Math.min(goal.target, goal.progress + delta));
      goal.done = goal.progress >= goal.target;
    });
  };

  const week = state.goals.filter((g) => g.period === "week");
  const month = state.goals.filter((g) => g.period === "month");

  const Section = ({ title, items, icon }: { title: string; items: Goal[]; icon: any }) => (
    <>
      <SectionTitle>{title}</SectionTitle>
      {items.length === 0 ? (
        <Card className="!p-5 text-center text-muted text-[14px]">No {title.toLowerCase()} yet.</Card>
      ) : items.map((g) => (
        <Card key={g.id} className="!p-4 mb-2.5">
          <div className="flex items-start gap-3">
            <span className={`grid place-items-center w-10 h-10 rounded-2xl shrink-0 ${g.done ? "bg-mint-500 text-white" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>
              <Icon name={g.done ? "check" : icon} size={20} strokeWidth={g.done ? 3 : 1.8} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-semibold text-[15px] ${g.done ? "line-through text-muted" : ""}`}>{g.title}</p>
                <button className="text-rose-500 shrink-0" aria-label="Delete goal" onClick={() => set((s) => { s.goals = s.goals.filter((x) => x.id !== g.id); })}><Icon name="trash" size={17} /></button>
              </div>
              <div className="mt-2"><ProgressBar value={(g.progress / g.target) * 100} tone={g.done ? "mint" : "amber"} /></div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[13px] text-muted">{g.progress} / {g.target}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => bump(g, -1)} className="tap w-8 h-8 grid place-items-center rounded-full bg-black/6 dark:bg-white/8"><Icon name="x" size={15} /></button>
                  <button onClick={() => bump(g, 1)} className="tap w-8 h-8 grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white"><Icon name="plus" size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );

  return (
    <div>
      <PageHeader title="Goals" subtitle="Small targets that keep you moving forward" icon="target" />

      <Button className="mt-1" full icon="plus" onClick={() => setOpen(true)}>Add a goal</Button>

      <Section title="Weekly goals" items={week} icon="target" />
      <Section title="Monthly goals" items={month} icon="calendar" />

      <SectionTitle>Quick ideas</SectionTitle>
      <div className="grid gap-2">
        {GOAL_TEMPLATES.filter((t) => !state.goals.some((g) => g.title === t.title)).map((t) => (
          <button key={t.title} onClick={() => add(t)} className="tap card !p-3.5 flex items-center gap-3 text-left">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-500/12 text-brand-600 dark:text-brand-300 shrink-0"><Icon name="plus" size={18} /></span>
            <span className="flex-1 text-[14.5px] font-medium">{t.title}</span>
            <Chip tone="neutral">{t.period}</Chip>
          </button>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New goal"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => add()}>Add goal</Button></>}>
        <Field label="Goal"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Elevate ankle 3× a day" autoFocus /></Field>
        <Field label="Type"><Segmented value={period} onChange={setPeriod} options={[{ value: "week", label: "Weekly" }, { value: "month", label: "Monthly" }]} /></Field>
        <Field label="Target count" hint="How many times to reach the goal">
          <Input type="number" min={1} max={60} value={target} onChange={(e) => setTarget(Math.max(1, Number(e.target.value) || 1))} />
        </Field>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useStore } from "../store";
import {
  PageHeader, Card, ProgressBar, DisclaimerFooter, DoctorFirstBanner, Button,
  Modal, Field, Input, EmptyState, SectionTitle,
} from "../ui";
import { Icon } from "../icons";
import { TASK_GROUPS, DEFAULT_TASKS } from "../content";
import { activeTasks, dayCompletion } from "../selectors";
import { todayKey, uid, haptic, confettiBurst } from "../lib";

export default function Checklist() {
  const { state, set, today, day, setDay } = useStore();
  const tasks = activeTasks(state);
  const comp = dayCompletion(state, today);
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const grouped = useMemo(() => {
    const groups = [...TASK_GROUPS, { id: "custom", label: "Your own tasks", tone: "brand" as const }];
    return groups
      .map((g) => ({ ...g, items: tasks.filter((t) => t.group === g.id) }))
      .filter((g) => g.items.length > 0);
  }, [tasks]);

  const toggle = (id: string) => {
    haptic();
    const willComplete = !day.tasks[id];
    setDay(today, (d) => { d.tasks[id] = !d.tasks[id]; });
    if (willComplete) {
      const done = tasks.filter((t) => (t.id === id ? true : day.tasks[t.id])).length;
      if (done === tasks.length && state.settings.confetti) setTimeout(confettiBurst, 120);
    }
  };

  const addTask = () => {
    const label = newLabel.trim();
    if (!label) return;
    set((s) => { s.customTasks.push({ id: uid(), label }); });
    setNewLabel(""); setAddOpen(false);
  };

  return (
    <div>
      <PageHeader title="Daily checklist" subtitle="Small consistent actions that help you heal" icon="list" />
      <DoctorFirstBanner />

      <Card className="!p-5 mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{comp.done} of {comp.total} done</span>
          <span className="text-muted text-[14px]">{comp.pct}%</span>
        </div>
        <ProgressBar value={comp.pct} tone={comp.pct === 100 ? "mint" : "brand"} />
        {comp.pct === 100 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center font-semibold text-mint-600 dark:text-mint-400">
            🎉 Every task done — brilliant work today!
          </motion.p>
        )}
      </Card>

      {grouped.map((g) => (
        <div key={g.id}>
          <SectionTitle>{g.label}</SectionTitle>
          <Card className="!p-2 divide-y hairline">
            {g.items.map((t) => {
              const checked = !!day.tasks[t.id];
              return (
                <motion.button key={t.id} onClick={() => toggle(t.id)}
                  whileTap={{ scale: 0.99 }}
                  className="tap w-full flex items-center gap-3 px-3 py-3 text-left">
                  <span className={`grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 transition-colors ${checked ? "bg-mint-500 border-mint-500 text-white" : "border-black/20 dark:border-white/25"}`}>
                    <AnimatePresence>{checked && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Icon name="check" size={16} strokeWidth={3} /></motion.span>
                    )}</AnimatePresence>
                  </span>
                  <Icon name={t.icon as any} size={19} className={checked ? "text-mint-500" : "text-muted"} />
                  <span className={`flex-1 text-[15px] ${checked ? "line-through text-muted" : ""}`}>{t.label}</span>
                </motion.button>
              );
            })}
          </Card>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button variant="secondary" icon="plus" onClick={() => setAddOpen(true)} full>Add task</Button>
        <Button variant="ghost" icon="settings" onClick={() => setManageOpen(true)} full>Manage tasks</Button>
      </div>

      {/* Add custom task */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a custom task"
        footer={<><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={addTask}>Add</Button></>}>
        <Field label="What would you like to add?">
          <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="e.g. Do my physio homework"
            autoFocus onKeyDown={(e) => e.key === "Enter" && addTask()} />
        </Field>
        <p className="text-[13px] text-muted">Custom tasks appear at the bottom of your checklist every day.</p>
      </Modal>

      {/* Manage tasks */}
      <Modal open={manageOpen} onClose={() => setManageOpen(false)} title="Manage tasks">
        <p className="text-[13px] text-muted mb-3">Hide any default tasks you don’t need, or remove your own.</p>
        <div className="space-y-1.5">
          {DEFAULT_TASKS.map((t) => {
            const hidden = state.hiddenTasks.includes(t.id);
            return (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-black/4 dark:bg-white/6">
                <Icon name={t.icon} size={18} className="text-muted" />
                <span className={`flex-1 text-[14.5px] ${hidden ? "line-through text-muted" : ""}`}>{t.label}</span>
                <button className="text-[13px] font-semibold text-brand-600 dark:text-brand-300"
                  onClick={() => set((s) => { s.hiddenTasks = hidden ? s.hiddenTasks.filter((x) => x !== t.id) : [...s.hiddenTasks, t.id]; })}>
                  {hidden ? "Show" : "Hide"}
                </button>
              </div>
            );
          })}
          {state.customTasks.length > 0 && <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted pt-3 px-1">Your tasks</p>}
          {state.customTasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-black/4 dark:bg-white/6">
              <Icon name="star" size={18} className="text-amber-500" />
              <span className="flex-1 text-[14.5px]">{t.label}</span>
              <button className="text-rose-500" aria-label="Delete task"
                onClick={() => set((s) => { s.customTasks = s.customTasks.filter((x) => x.id !== t.id); })}>
                <Icon name="trash" size={18} />
              </button>
            </div>
          ))}
        </div>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

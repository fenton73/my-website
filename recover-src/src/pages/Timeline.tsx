import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, Modal, Field, Input, Button, Chip,
} from "../ui";
import { Icon } from "../icons";
import { formatNice, todayKey } from "../lib";
import type { Phase } from "../store";

export default function Timeline() {
  const { state, set } = useStore();
  const [edit, setEdit] = useState<Phase | null>(null);

  const injuryDate = state.profile.injuryDate;
  const footballTarget = state.profile.footballTarget;

  return (
    <div>
      <PageHeader title="Recovery timeline" subtitle="Your journey back to football, step by step" icon="route" />
      <DoctorFirstBanner />

      <Card className="!p-5 mt-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[12.5px] text-muted">Injury date</p>
            <input type="date" value={injuryDate}
              onChange={(e) => set((s) => { if (e.target.value) s.profile.injuryDate = e.target.value; })}
              className="mt-1 bg-transparent font-semibold text-[15px] outline-none" />
          </div>
          <div>
            <p className="text-[12.5px] text-muted">Football return target</p>
            <input type="date" value={footballTarget ?? ""}
              onChange={(e) => set((s) => { s.profile.footballTarget = e.target.value || null; })}
              className="mt-1 bg-transparent font-semibold text-[15px] outline-none" />
          </div>
        </div>
      </Card>

      <p className="text-[13px] text-muted px-1 mt-5 mb-1">Tap a stage to set the date, add a note, or mark it reached. Dates and stages are yours to adjust as your team guides you.</p>

      <div className="relative mt-4 pl-2">
        {/* vertical line */}
        <div className="absolute left-[27px] top-3 bottom-6 w-[2px] bg-black/10 dark:bg-white/12 rounded-full" />
        <div className="space-y-3">
          {state.timeline.map((p, i) => {
            const isCurrent = state.profile.phase === p.id;
            return (
              <motion.button key={p.id} onClick={() => setEdit(p)}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.99 }}
                className="tap relative w-full flex items-start gap-4 text-left">
                <span className={`relative z-10 grid place-items-center w-[38px] h-[38px] rounded-full shrink-0 border-2 ${p.done ? "bg-gradient-to-br from-brand-500 to-mint-500 border-transparent text-white" : "bg-[rgb(var(--surface))] border-black/15 dark:border-white/20 text-muted"}`}>
                  <Icon name={p.done ? "check" : (p.icon as any)} size={p.done ? 18 : 18} strokeWidth={p.done ? 3 : 1.8} />
                </span>
                <div className={`flex-1 card !p-4 ${isCurrent ? "!border-brand-500/40 ring-2 ring-brand-500/25" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[15.5px]">{p.label}</span>
                    {isCurrent && <Chip tone="brand" icon="sparkles">You are here</Chip>}
                  </div>
                  <p className="text-[13px] text-muted mt-0.5">{p.date ? formatNice(p.date) : "Date not set yet"}</p>
                  {p.note && <p className="text-[13px] mt-1.5 leading-snug">{p.note}</p>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.label}
        footer={<Button onClick={() => setEdit(null)}>Done</Button>}>
        {edit && (
          <div>
            <Field label="Date reached / expected">
              <Input type="date" value={edit.date ?? ""}
                onChange={(e) => { const v = e.target.value || null; setEdit({ ...edit, date: v }); set((s) => { const ph = s.timeline.find((x) => x.id === edit.id); if (ph) ph.date = v; }); }} />
            </Field>
            <Field label="Note (optional)">
              <Input value={edit.note ?? ""} placeholder="e.g. Consultant said 6 weeks in cast"
                onChange={(e) => { const v = e.target.value; setEdit({ ...edit, note: v }); set((s) => { const ph = s.timeline.find((x) => x.id === edit.id); if (ph) ph.note = v; }); }} />
            </Field>
            <div className="flex flex-col gap-2 mt-2">
              <Button variant={edit.done ? "secondary" : "success"} icon={edit.done ? "refresh" : "check"} full
                onClick={() => { const done = !edit.done; setEdit({ ...edit, done }); set((s) => { const ph = s.timeline.find((x) => x.id === edit.id); if (ph) ph.done = done; }); }}>
                {edit.done ? "Mark as not reached yet" : "Mark this stage reached"}
              </Button>
              <Button variant="ghost" icon="route" full
                onClick={() => { setEdit({ ...edit }); set((s) => { s.profile.phase = edit.id; }); }}>
                Set as my current phase
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

import { useState } from "react";
import { useStore } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, Button, Modal, Field, Input, Segmented, EmptyState, Chip,
} from "../ui";
import { Icon } from "../icons";
import { todayKey, uid, haptic } from "../lib";
import type { Medication } from "../store";

const KINDS: { value: Medication["kind"]; label: string; icon: any; tone: string }[] = [
  { value: "calcium", label: "Calcium", icon: "shield", tone: "brand" },
  { value: "vitd", label: "Vitamin D", icon: "sun", tone: "amber" },
  { value: "pain", label: "Pain relief", icon: "pill", tone: "rose" },
  { value: "supplement", label: "Supplement", icon: "leaf", tone: "mint" },
  { value: "other", label: "Other", icon: "pill", tone: "violet" },
];
const toneGrad: Record<string, string> = {
  brand: "from-brand-500 to-brand-600", amber: "from-amber-400 to-orange-500",
  rose: "from-rose-400 to-red-500", mint: "from-mint-400 to-mint-600", violet: "from-violet-500 to-fuchsia-500",
};

const blank = (): Omit<Medication, "id" | "log"> => ({ name: "", dose: "", times: ["08:00"], kind: "supplement", active: true });

export default function Meds() {
  const { state, set } = useStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const t = todayKey();

  const kindMeta = (k: Medication["kind"]) => KINDS.find((x) => x.value === k)!;

  const save = () => {
    if (!draft.name.trim()) return;
    if (editId) {
      set((s) => { const m = s.medications.find((x) => x.id === editId); if (m) Object.assign(m, draft); });
    } else {
      set((s) => { s.medications.push({ ...draft, id: uid(), log: {} }); });
    }
    setOpen(false); setDraft(blank()); setEditId(null);
  };

  const takenToday = (m: Medication, time: string) => (m.log[t] ?? []).includes(time);
  const toggleTaken = (m: Medication, time: string) => {
    haptic();
    set((s) => {
      const med = s.medications.find((x) => x.id === m.id)!;
      const arr = med.log[t] ?? [];
      med.log[t] = arr.includes(time) ? arr.filter((x) => x !== time) : [...arr, time];
    });
  };

  return (
    <div>
      <PageHeader title="Medication & supplements" subtitle="Gentle reminders — only take what's prescribed for you" icon="pill" />
      <DoctorFirstBanner />

      <Card className="!p-4 mt-3 flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shrink-0"><Icon name="info" size={20} /></span>
        <p className="text-[13.5px] text-muted leading-relaxed">Only take medicines and supplements your doctor or pharmacist has advised, at the dose they gave. This page is a reminder tool, not a prescription. Never change doses without asking your team.</p>
      </Card>

      {state.medications.length === 0 ? (
        <Card className="mt-3"><EmptyState icon="pill" title="No reminders yet" sub="Add calcium, vitamin D, prescribed pain relief or any supplement your team advised."
          action={<Button icon="plus" onClick={() => { setDraft(blank()); setEditId(null); setOpen(true); }}>Add reminder</Button>} /></Card>
      ) : (
        <div className="space-y-2.5 mt-3">
          {state.medications.map((m) => {
            const meta = kindMeta(m.kind);
            const doneCount = (m.log[t] ?? []).length;
            return (
              <Card key={m.id} className="!p-4">
                <div className="flex items-center gap-3">
                  <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${toneGrad[meta.tone]} shrink-0`}><Icon name={meta.icon} size={21} /></span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15.5px]">{m.name}</p>
                    <p className="text-[13px] text-muted">{m.dose || meta.label}{m.times.length ? ` · ${m.times.length}× daily` : ""}</p>
                  </div>
                  <button className="text-muted p-1" aria-label="Edit" onClick={() => { setDraft({ name: m.name, dose: m.dose, times: m.times, kind: m.kind, active: m.active }); setEditId(m.id); setOpen(true); }}><Icon name="pencil" size={18} /></button>
                  <button className="text-rose-500 p-1" aria-label="Delete" onClick={() => set((s) => { s.medications = s.medications.filter((x) => x.id !== m.id); })}><Icon name="trash" size={18} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.times.map((time) => {
                    const taken = takenToday(m, time);
                    return (
                      <button key={time} onClick={() => toggleTaken(m, time)}
                        className={`tap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${taken ? "bg-mint-500 text-white" : "bg-black/5 dark:bg-white/8 text-muted"}`}>
                        <Icon name={taken ? "check" : "clock"} size={14} strokeWidth={taken ? 3 : 1.8} />{time}
                      </button>
                    );
                  })}
                  {doneCount === m.times.length && m.times.length > 0 && <Chip tone="mint" icon="check">All taken today</Chip>}
                </div>
              </Card>
            );
          })}
          <Button variant="secondary" icon="plus" full onClick={() => { setDraft(blank()); setEditId(null); setOpen(true); }}>Add another</Button>
        </div>
      )}

      <p className="text-[12.5px] text-muted mt-3 px-1 leading-relaxed">Tip: this app can’t send phone notifications on its own. Set matching alarms on your phone, and use these buttons to tick doses off so you don’t double-up.</p>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit reminder" : "Add reminder"}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></>}>
        <Field label="Type">
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map((k) => (
              <button key={k.value} onClick={() => setDraft({ ...draft, kind: k.value })}
                className={`tap flex flex-col items-center gap-1 py-2.5 rounded-2xl text-[12px] font-semibold ${draft.kind === k.value ? "bg-brand-500 text-white" : "bg-black/5 dark:bg-white/8 text-muted"}`}>
                <Icon name={k.icon} size={18} />{k.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Vitamin D 1000 IU" autoFocus /></Field>
        <Field label="Dose / notes"><Input value={draft.dose} onChange={(e) => setDraft({ ...draft, dose: e.target.value })} placeholder="e.g. 1 tablet with breakfast" /></Field>
        <Field label="Reminder times">
          <div className="space-y-2">
            {draft.times.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input type="time" value={time} onChange={(e) => setDraft({ ...draft, times: draft.times.map((x, j) => (j === i ? e.target.value : x)) })} className="flex-1" />
                {draft.times.length > 1 && <button className="text-rose-500 p-2" aria-label="Remove time" onClick={() => setDraft({ ...draft, times: draft.times.filter((_, j) => j !== i) })}><Icon name="x" size={18} /></button>}
              </div>
            ))}
            <Button size="sm" variant="ghost" icon="plus" onClick={() => setDraft({ ...draft, times: [...draft.times, "20:00"] })}>Add a time</Button>
          </div>
        </Field>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

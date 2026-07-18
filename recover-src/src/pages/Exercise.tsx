import { useState } from "react";
import { useStore } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, Button, Modal, Field, Input, TextArea, EmptyState, Toggle,
} from "../ui";
import { Icon } from "../icons";
import { uid, haptic } from "../lib";
import type { CustomTask } from "../store";

// Exercises are stored as custom tasks tagged with an "ex:" prefix + note in label.
interface Ex { id: string; name: string; detail: string; done: boolean; }

export default function Exercise() {
  const { state, set } = useStore();
  const [confirmed, setConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  // Reuse a dedicated store slice via customTasks? Keep separate: store in localStorage-backed state.exerciseList
  const list: Ex[] = (state as any).exerciseList ?? [];
  const setList = (next: Ex[]) => set((s) => { (s as any).exerciseList = next; });

  const add = () => {
    if (!name.trim()) return;
    setList([...list, { id: uid(), name: name.trim(), detail: detail.trim(), done: false }]);
    setName(""); setDetail(""); setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Exercises" subtitle="Only what your physio has approved for you" icon="dumbbell" />

      {!confirmed ? (
        <Card className="!p-6 mt-3 text-center">
          <span className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-500 to-mint-500 text-white mb-3"><Icon name="shield" size={30} /></span>
          <p className="font-bold text-[18px]">Have you been given exercises?</p>
          <p className="text-[14px] text-muted mt-2 leading-relaxed max-w-sm mx-auto">
            This app will <span className="font-semibold">never</span> suggest exercises. While you’re non-weight-bearing in a cast,
            doing the wrong movement can set your recovery back.
          </p>
          <p className="text-[14px] mt-3 font-medium">Only add exercises your doctor or physiotherapist has specifically approved for you.</p>
          <div className="mt-5 flex flex-col gap-2">
            <Button full size="lg" icon="check" onClick={() => setConfirmed(true)}>Yes — my physio approved these</Button>
            <Button full variant="ghost" onClick={() => history.length > 1 ? history.back() : (location.hash = "#/home")}>Not yet</Button>
          </div>
        </Card>
      ) : (
        <>
          <Card className="!p-4 mt-3 flex items-start gap-3 !border-brand-500/25">
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shrink-0"><Icon name="info" size={20} /></span>
            <p className="text-[13.5px] text-muted leading-relaxed">Add each approved exercise below. Stop immediately and check with your team if anything causes sharp pain, or if your cast feels tight or uncomfortable.</p>
          </Card>

          {list.length === 0 ? (
            <Card className="mt-3"><EmptyState icon="dumbbell" title="No exercises added" sub="Add the specific exercises your physiotherapist gave you."
              action={<Button icon="plus" onClick={() => setOpen(true)}>Add exercise</Button>} /></Card>
          ) : (
            <div className="space-y-2.5 mt-3">
              {list.map((ex) => (
                <Card key={ex.id} className="!p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => { haptic(); setList(list.map((x) => x.id === ex.id ? { ...x, done: !x.done } : x)); }}
                      className={`grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 mt-0.5 ${ex.done ? "bg-mint-500 border-mint-500 text-white" : "border-black/20 dark:border-white/25"}`}>
                      {ex.done && <Icon name="check" size={15} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-[15.5px] ${ex.done ? "line-through text-muted" : ""}`}>{ex.name}</p>
                      {ex.detail && <p className="text-[13.5px] text-muted mt-0.5 leading-snug whitespace-pre-wrap">{ex.detail}</p>}
                    </div>
                    <button className="text-rose-500 p-1" aria-label="Delete" onClick={() => setList(list.filter((x) => x.id !== ex.id))}><Icon name="trash" size={18} /></button>
                  </div>
                </Card>
              ))}
              <div className="flex gap-2">
                <Button variant="secondary" icon="plus" full onClick={() => setOpen(true)}>Add exercise</Button>
                <Button variant="ghost" full onClick={() => setList(list.map((x) => ({ ...x, done: false })))}>Reset ticks</Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add approved exercise"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={add}>Add</Button></>}>
        <Card className="!p-3 mb-3 !bg-brand-500/10 !border-brand-500/20">
          <p className="text-[13px] font-medium text-brand-700 dark:text-brand-200">Only add what your physiotherapist told you to do.</p>
        </Card>
        <Field label="Exercise name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Toe wiggles" autoFocus /></Field>
        <Field label="Instructions (sets / reps / notes)"><TextArea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. 3 × 10, twice a day, as shown by physio" /></Field>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

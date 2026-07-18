import { useState } from "react";
import { useStore } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, Button, Modal, Field, Input, TextArea,
  Segmented, EmptyState, SectionTitle, Chip,
} from "../ui";
import { Icon } from "../icons";
import { uid, todayKey, formatNice, daysBetween, fileToDataURL, haptic } from "../lib";

type Tab = "appts" | "questions" | "notes" | "docs";

export default function Hospital() {
  const { state, set } = useStore();
  const [tab, setTab] = useState<Tab>("appts");
  const [apptOpen, setApptOpen] = useState(false);
  const [appt, setAppt] = useState({ title: "Fracture clinic", date: "", location: "", notes: "" });
  const [q, setQ] = useState("");
  const [note, setNote] = useState("");

  const saveAppt = () => {
    if (!appt.date) return;
    set((s) => { s.appointments.push({ id: uid(), ...appt }); s.appointments.sort((a, b) => a.date.localeCompare(b.date)); const upcoming = s.appointments.find((x) => daysBetween(todayKey(), x.date) >= 0); if (upcoming) s.profile.nextAppointment = upcoming.date; });
    setAppt({ title: "Fracture clinic", date: "", location: "", notes: "" }); setApptOpen(false);
  };
  const addQ = () => { if (!q.trim()) return; set((s) => { s.questions.push({ id: uid(), text: q.trim(), answer: "", asked: false }); }); setQ(""); };
  const addNote = () => { if (!note.trim()) return; set((s) => { s.medNotes.unshift({ id: uid(), date: todayKey(), text: note.trim() }); }); setNote(""); };

  const onDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const data = await fileToDataURL(file, 1600, 0.8);
    set((s) => { s.docs.unshift({ id: uid(), date: todayKey(), label: file.name.replace(/\.[^.]+$/, ""), data }); });
    e.target.value = "";
  };

  return (
    <div>
      <PageHeader title="Hospital" subtitle="Appointments, questions and notes in one place" icon="hospital" />
      <DoctorFirstBanner />

      <div className="overflow-x-auto no-scrollbar -mx-1 px-1 mt-3">
        <Segmented value={tab} onChange={setTab} options={[
          { value: "appts", label: "Appointments" }, { value: "questions", label: "Questions" },
          { value: "notes", label: "Notes" }, { value: "docs", label: "Documents" },
        ]} />
      </div>

      {/* APPOINTMENTS */}
      {tab === "appts" && (
        <div className="mt-4">
          <Button full icon="plus" onClick={() => setApptOpen(true)}>Add appointment</Button>
          {state.appointments.length === 0 ? (
            <Card className="mt-3"><EmptyState icon="calendar" title="No appointments yet" sub="Add your next hospital or fracture-clinic visit." /></Card>
          ) : (
            <div className="space-y-2.5 mt-3">
              {state.appointments.map((a) => {
                const d = daysBetween(todayKey(), a.date);
                return (
                  <Card key={a.id} className="!p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shrink-0">
                        <Icon name="hospital" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><p className="font-semibold text-[15.5px]">{a.title}</p>
                          {d >= 0 && <Chip tone={d === 0 ? "rose" : "brand"}>{d === 0 ? "Today" : `in ${d}d`}</Chip>}</div>
                        <p className="text-[13px] text-muted">{formatNice(a.date)}</p>
                        {a.location && <p className="text-[13px] text-muted flex items-center gap-1 mt-0.5"><Icon name="hospital" size={13} />{a.location}</p>}
                        {a.notes && <p className="text-[13.5px] mt-1.5 leading-snug">{a.notes}</p>}
                      </div>
                      <button className="text-rose-500 p-1" aria-label="Delete" onClick={() => set((s) => { s.appointments = s.appointments.filter((x) => x.id !== a.id); if (s.profile.nextAppointment === a.date) s.profile.nextAppointment = s.appointments.find((x) => daysBetween(todayKey(), x.date) >= 0)?.date ?? null; })}><Icon name="trash" size={18} /></button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUESTIONS */}
      {tab === "questions" && (
        <div className="mt-4">
          <Card className="!p-3"><div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a question for your doctor…" onKeyDown={(e) => e.key === "Enter" && addQ()} />
            <Button icon="plus" onClick={addQ}>Add</Button>
          </div></Card>
          {state.questions.length === 0 ? (
            <Card className="mt-3"><EmptyState icon="message" title="No questions yet" sub="Jot down anything you want to ask — it's easy to forget in the room." /></Card>
          ) : (
            <div className="space-y-2.5 mt-3">
              {state.questions.map((qq) => (
                <Card key={qq.id} className="!p-4">
                  <div className="flex items-start gap-3">
                    <button onClick={() => { haptic(); set((s) => { const x = s.questions.find((y) => y.id === qq.id)!; x.asked = !x.asked; }); }}
                      className={`grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 mt-0.5 ${qq.asked ? "bg-mint-500 border-mint-500 text-white" : "border-black/20 dark:border-white/25"}`}>
                      {qq.asked && <Icon name="check" size={15} strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-[15px] ${qq.asked ? "text-muted" : ""}`}>{qq.text}</p>
                      <TextArea value={qq.answer} placeholder="Doctor’s answer…" rows={2}
                        className="mt-2 !py-2 text-[14px]" onChange={(e) => set((s) => { const x = s.questions.find((y) => y.id === qq.id)!; x.answer = e.target.value; })} />
                    </div>
                    <button className="text-rose-500 p-1" aria-label="Delete" onClick={() => set((s) => { s.questions = s.questions.filter((x) => x.id !== qq.id); })}><Icon name="trash" size={18} /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTES */}
      {tab === "notes" && (
        <div className="mt-4">
          <Card className="!p-3"><TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Medical note — what you were told, next steps, cast change dates…" />
            <Button className="mt-2" full icon="plus" onClick={addNote}>Save note</Button></Card>
          {state.medNotes.length === 0 ? (
            <Card className="mt-3"><EmptyState icon="fileText" title="No notes yet" sub="Keep a record of what your team tells you at each visit." /></Card>
          ) : (
            <div className="space-y-2.5 mt-3">
              {state.medNotes.map((n) => (
                <Card key={n.id} className="!p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[12.5px] text-muted">{formatNice(n.date)}</p>
                    <button className="text-rose-500" aria-label="Delete" onClick={() => set((s) => { s.medNotes = s.medNotes.filter((x) => x.id !== n.id); })}><Icon name="trash" size={17} /></button>
                  </div>
                  <p className="text-[14.5px] mt-1 whitespace-pre-wrap leading-relaxed">{n.text}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DOCS */}
      {tab === "docs" && (
        <div className="mt-4">
          <label className="block">
            <div className="tap card !p-5 flex flex-col items-center gap-2 text-center cursor-pointer border-2 border-dashed !border-brand-500/30">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-500/12 text-brand-600 dark:text-brand-300"><Icon name="camera" size={24} /></span>
              <p className="font-semibold text-[15px]">Upload a scan or photo</p>
              <p className="text-[13px] text-muted">Letters, x-ray photos, discharge notes — stored only on this device.</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={onDoc} />
          </label>
          {state.docs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {state.docs.map((d) => (
                <Card key={d.id} className="!p-2">
                  <img src={d.data} alt={d.label} className="w-full h-36 object-cover rounded-2xl" />
                  <div className="flex items-center justify-between px-1 pt-2">
                    <div className="min-w-0"><p className="text-[13px] font-medium truncate">{d.label}</p><p className="text-[11px] text-muted">{formatNice(d.date)}</p></div>
                    <button className="text-rose-500 shrink-0" aria-label="Delete" onClick={() => set((s) => { s.docs = s.docs.filter((x) => x.id !== d.id); })}><Icon name="trash" size={16} /></button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={apptOpen} onClose={() => setApptOpen(false)} title="Add appointment"
        footer={<><Button variant="ghost" onClick={() => setApptOpen(false)}>Cancel</Button><Button onClick={saveAppt}>Save</Button></>}>
        <Field label="Title"><Input value={appt.title} onChange={(e) => setAppt({ ...appt, title: e.target.value })} placeholder="e.g. Fracture clinic" /></Field>
        <Field label="Date"><Input type="date" value={appt.date} onChange={(e) => setAppt({ ...appt, date: e.target.value })} /></Field>
        <Field label="Location"><Input value={appt.location} onChange={(e) => setAppt({ ...appt, location: e.target.value })} placeholder="Hospital / department" /></Field>
        <Field label="Notes"><TextArea value={appt.notes} onChange={(e) => setAppt({ ...appt, notes: e.target.value })} placeholder="What this appointment is for…" /></Field>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store";
import { PageHeader, Card, DisclaimerFooter, Button, Modal, Field, Input, EmptyState } from "../ui";
import { Icon } from "../icons";
import { uid, todayKey, formatNice, daysBetween, fileToDataURL } from "../lib";

export default function Photos() {
  const { state, set } = useStore();
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [view, setView] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPending(await fileToDataURL(file, 1400, 0.82));
    e.target.value = "";
  };
  const save = () => {
    if (!pending) return;
    set((s) => { s.anklePhotos.unshift({ id: uid(), date: todayKey(), note: note.trim(), data: pending }); });
    setPending(null); setNote("");
  };

  const photos = state.anklePhotos;

  return (
    <div>
      <PageHeader title="Healing timeline" subtitle="A private photo diary of your ankle's progress" icon="camera" />

      <Card className="!p-4 flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-300 shrink-0"><Icon name="eye" size={20} /></span>
        <p className="text-[13.5px] text-muted leading-relaxed">Photos are stored only on this device. A weekly snapshot is a lovely way to see how far you’ve come — and handy to show your team. Keep the cast dry while you do it!</p>
      </Card>

      <label className="block mt-3">
        <div className="tap card !p-5 flex flex-col items-center gap-2 text-center cursor-pointer border-2 border-dashed !border-violet-500/30">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"><Icon name="camera" size={24} /></span>
          <p className="font-semibold text-[15px]">Add a photo</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={onPick} />
      </label>

      {photos.length === 0 ? (
        <Card className="mt-3"><EmptyState icon="camera" title="No photos yet" sub="Add your first snapshot to start the timeline." /></Card>
      ) : (
        <div className="mt-4 space-y-3">
          {photos.map((p, i) => {
            const dayN = daysBetween(state.profile.injuryDate, p.date);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="!p-3">
                  <button onClick={() => setView(p.data)} className="tap block w-full">
                    <img src={p.data} alt={p.note || "Ankle photo"} className="w-full max-h-72 object-cover rounded-2xl" />
                  </button>
                  <div className="flex items-center justify-between px-1 pt-2.5">
                    <div>
                      <p className="font-semibold text-[14.5px]">Day {dayN} · {formatNice(p.date)}</p>
                      {p.note && <p className="text-[13px] text-muted">{p.note}</p>}
                    </div>
                    <button className="text-rose-500 p-1" aria-label="Delete" onClick={() => set((s) => { s.anklePhotos = s.anklePhotos.filter((x) => x.id !== p.id); })}><Icon name="trash" size={18} /></button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* confirm new photo */}
      <Modal open={!!pending} onClose={() => setPending(null)} title="Add to timeline"
        footer={<><Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button><Button onClick={save}>Save photo</Button></>}>
        {pending && <img src={pending} alt="Preview" className="w-full max-h-72 object-contain rounded-2xl mb-3 bg-black/5" />}
        <Field label="Note (optional)"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. New cast, less swelling" /></Field>
      </Modal>

      {/* fullscreen view */}
      <Modal open={!!view} onClose={() => setView(null)}>
        {view && <img src={view} alt="Ankle photo" className="w-full rounded-2xl" />}
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

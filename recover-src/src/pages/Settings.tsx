import { useRef, useState } from "react";
import { useStore, defaultState } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, Segmented, Toggle, Button, Field, Input, Modal, SectionTitle, DoctorFirstBanner,
} from "../ui";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { download, todayKey } from "../lib";

export default function Settings() {
  const { state, set, reset, replace } = useStore();
  const { go } = useNav();
  const [resetOpen, setResetOpen] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => download(`recover-plus-backup-${todayKey()}.json`, JSON.stringify(state, null, 2));

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result as string);
        if (!data || typeof data !== "object" || !("version" in data)) throw new Error();
        replace(data);
        setImportMsg("Backup restored successfully.");
      } catch { setImportMsg("That file didn’t look like a valid backup."); }
    };
    r.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Make Recover+ yours" icon="settings" />

      {/* Profile */}
      <SectionTitle>Your profile</SectionTitle>
      <Card className="!p-5">
        <Field label="Name / nickname"><Input value={state.profile.name} onChange={(e) => set((s) => { s.profile.name = e.target.value; })} placeholder="What should we call you?" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Injury date"><Input type="date" value={state.profile.injuryDate} onChange={(e) => set((s) => { if (e.target.value) s.profile.injuryDate = e.target.value; })} /></Field>
          <Field label="Next appointment"><Input type="date" value={state.profile.nextAppointment ?? ""} onChange={(e) => set((s) => { s.profile.nextAppointment = e.target.value || null; })} /></Field>
        </div>
      </Card>

      {/* Appearance */}
      <SectionTitle>Appearance</SectionTitle>
      <Card className="!p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Icon name="moon" size={18} /> Theme</span>
          <Segmented value={state.settings.theme} onChange={(v) => set((s) => { s.settings.theme = v; })}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "Auto" }]} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Icon name="ruler" size={18} /> Units</span>
          <Segmented value={state.settings.units} onChange={(v) => set((s) => { s.settings.units = v; })}
            options={[{ value: "metric", label: "Metric" }, { value: "imperial", label: "Imperial" }]} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2"><Icon name="sparkles" size={18} /> Celebration confetti</span>
          <Toggle checked={state.settings.confetti} onChange={(v) => set((s) => { s.settings.confetti = v; })} label="Confetti" />
        </div>
      </Card>

      {/* Reminders info */}
      <SectionTitle>Reminders</SectionTitle>
      <Card className="!p-5">
        <div className="flex items-start gap-3">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shrink-0"><Icon name="bell" size={20} /></span>
          <div>
            <p className="font-semibold">Morning · water · sleep · medication · journal</p>
            <p className="text-[13.5px] text-muted mt-1 leading-relaxed">
              Because Recover+ runs fully offline with no account, it can’t send phone push notifications on its own.
              Set a few matching alarms on your phone — a morning check-in, water reminders through the day, a medication
              time, and a wind-down journal reminder — and tick things off here. Add Recover+ to your home screen for one-tap access.
            </p>
          </div>
        </div>
      </Card>

      {/* Data */}
      <SectionTitle>Your data</SectionTitle>
      <Card className="!p-4 space-y-2">
        <button onClick={() => go("report")} className="tap w-full flex items-center gap-3 px-2 py-3 text-left">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/8"><Icon name="fileText" size={19} /></span>
          <div className="flex-1"><p className="font-semibold">Doctor report</p><p className="text-[13px] text-muted">A printable summary to share or save as PDF</p></div>
          <Icon name="chevronRight" className="text-muted" />
        </button>
        <button onClick={exportData} className="tap w-full flex items-center gap-3 px-2 py-3 text-left border-t hairline">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/8"><Icon name="download" size={19} /></span>
          <div className="flex-1"><p className="font-semibold">Export / backup data</p><p className="text-[13px] text-muted">Download everything as a JSON file</p></div>
          <Icon name="chevronRight" className="text-muted" />
        </button>
        <button onClick={() => fileRef.current?.click()} className="tap w-full flex items-center gap-3 px-2 py-3 text-left border-t hairline">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/8"><Icon name="share" size={19} /></span>
          <div className="flex-1"><p className="font-semibold">Restore from backup</p><p className="text-[13px] text-muted">Import a previously exported file</p></div>
          <Icon name="chevronRight" className="text-muted" />
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
        {importMsg && <p className="text-[13px] px-2 text-mint-600 dark:text-mint-400">{importMsg}</p>}
        <button onClick={() => setResetOpen(true)} className="tap w-full flex items-center gap-3 px-2 py-3 text-left border-t hairline">
          <span className="grid place-items-center w-10 h-10 rounded-2xl bg-rose-500/12 text-rose-500"><Icon name="trash" size={19} /></span>
          <div className="flex-1"><p className="font-semibold text-rose-500">Reset app</p><p className="text-[13px] text-muted">Erase all data and start fresh</p></div>
        </button>
      </Card>

      <p className="text-[12px] text-muted text-center mt-4">Recover+ · v1.0 · All your data stays private on this device.</p>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset everything?"
        footer={<><Button variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => { reset(); setResetOpen(false); go("home"); }}>Erase all data</Button></>}>
        <p className="text-[14.5px] leading-relaxed">This permanently deletes all your logs, journals, photos, goals and settings from this device. This can’t be undone.</p>
        <p className="text-[13.5px] text-muted mt-2">Consider exporting a backup first.</p>
      </Modal>

      <DisclaimerFooter />
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import { Button, Input, Field, DoctorFirstBanner } from "../ui";
import { Icon } from "../icons";
import { todayKey } from "../lib";

export default function Onboarding() {
  const { state, set } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.profile.name);
  const [injury, setInjury] = useState(state.profile.injuryDate);
  const [appt, setAppt] = useState(state.profile.nextAppointment ?? "");

  const finish = () => set((s) => {
    s.profile.name = name.trim();
    s.profile.injuryDate = injury || todayKey();
    s.profile.nextAppointment = appt || null;
    s.timeline = s.timeline.map((p) => (p.id === "injury" || p.id === "cast") ? { ...p, date: injury || todayKey() } : p);
    s.onboarded = true;
  });

  const steps = [
    (
      <div className="text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="inline-grid place-items-center w-24 h-24 rounded-[28px] bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-glass-lg mb-5">
          <Icon name="heart" size={46} />
        </motion.div>
        <h1 className="text-[30px] font-bold tracking-tight">Welcome to Recover+</h1>
        <p className="text-muted text-[15.5px] mt-2 leading-relaxed max-w-sm mx-auto">
          A calm, motivating companion to help you stay organised, informed and positive while your ankle heals.
        </p>
        <div className="mt-6"><DoctorFirstBanner /></div>
      </div>
    ),
    (
      <div className="text-center">
        <div className="inline-grid place-items-center w-20 h-20 rounded-3xl bg-brand-500/15 text-brand-600 dark:text-brand-300 mb-5"><Icon name="user" size={38} /></div>
        <h2 className="text-[24px] font-bold tracking-tight mb-1">What can we call you?</h2>
        <p className="text-muted text-[14.5px] mb-5">Optional — it just makes your dashboard feel like yours.</p>
        <div className="text-left max-w-sm mx-auto">
          <Field label="Name or nickname"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex" autoFocus /></Field>
        </div>
      </div>
    ),
    (
      <div className="text-center">
        <div className="inline-grid place-items-center w-20 h-20 rounded-3xl bg-mint-500/15 text-mint-600 dark:text-mint-400 mb-5"><Icon name="calendar" size={38} /></div>
        <h2 className="text-[24px] font-bold tracking-tight mb-1">A couple of key dates</h2>
        <p className="text-muted text-[14.5px] mb-5">These power your streaks and countdowns. You can change them anytime.</p>
        <div className="text-left max-w-sm mx-auto">
          <Field label="When did the injury happen?"><Input type="date" value={injury} onChange={(e) => setInjury(e.target.value)} /></Field>
          <Field label="Next hospital appointment (if known)"><Input type="date" value={appt} onChange={(e) => setAppt(e.target.value)} /></Field>
        </div>
      </div>
    ),
    (
      <div className="text-center">
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }}
          className="inline-grid place-items-center w-24 h-24 rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-glass-lg mb-5"><Icon name="sparkles" size={46} /></motion.div>
        <h2 className="text-[26px] font-bold tracking-tight mb-2">You’re all set!</h2>
        <p className="text-muted text-[15px] leading-relaxed max-w-sm mx-auto">
          Each day, tick off your checklist, log how you feel, and watch your progress ring fill up.
          Small, steady steps get you back to football.
        </p>
        <p className="text-[13.5px] mt-4 font-medium">Tip: add Recover+ to your home screen for a full-screen app feel.</p>
      </div>
    ),
  ];

  const last = step === steps.length - 1;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center px-5 py-8 max-w-md mx-auto">
      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="w-full">
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8">
        <div className="flex justify-center gap-1.5 mb-5">
          {steps.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-brand-500" : "w-1.5 bg-black/15 dark:bg-white/20"}`} />)}
        </div>
        <div className="flex gap-2">
          {step > 0 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button full size="lg" onClick={() => (last ? finish() : setStep(step + 1))}>
            {last ? "Start my recovery" : "Continue"}
          </Button>
        </div>
        {step === 0 && <button onClick={finish} className="w-full text-center text-[13px] text-muted mt-3 tap">Skip setup</button>}
      </div>
    </div>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, SectionTitle, Chip } from "../ui";
import { Icon } from "../icons";
import { NUTRIENTS, MEAL_IDEAS } from "../content";

const toneClasses: Record<string, string> = {
  mint: "from-mint-400 to-mint-600", brand: "from-brand-500 to-brand-600",
  amber: "from-amber-400 to-orange-500", violet: "from-violet-500 to-fuchsia-500",
};

export default function Nutrition() {
  const [open, setOpen] = useState<string | null>("Protein");
  return (
    <div>
      <PageHeader title="Nutrition for healing" subtitle="Fuel your bones with the right building blocks" icon="nutrition" />
      <DoctorFirstBanner />

      <Card className="!p-4 mt-3 flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-mint-500/15 text-mint-600 dark:text-mint-400 shrink-0"><Icon name="leaf" size={20} /></span>
        <p className="text-[13.5px] text-muted leading-relaxed">Healing bone needs energy and nutrients. Eat regularly, include protein and calcium at meals, and stay hydrated. This is general guidance — a dietitian or doctor can tailor it to you.</p>
      </Card>

      <SectionTitle>Key nutrients</SectionTitle>
      <div className="space-y-2.5">
        {NUTRIENTS.map((n) => {
          const isOpen = open === n.name;
          return (
            <Card key={n.name} className="!p-0 overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : n.name)} className="tap w-full flex items-center gap-3 p-4 text-left">
                <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${toneClasses[n.tone]} shrink-0`}><Icon name={n.icon} size={21} /></span>
                <span className="flex-1 font-semibold text-[16px]">{n.name}</span>
                <Icon name="chevronDown" size={20} className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="px-4 pb-4">
                      <p className="text-[14px] text-muted leading-relaxed">{n.why}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {n.foods.map((f) => <Chip key={f} tone="neutral">{f}</Chip>)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      <SectionTitle>Example meals</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-3">
        {MEAL_IDEAS.map((m) => (
          <Card key={m.title} className="!p-5">
            <div className="flex items-center gap-2 mb-1.5"><Icon name="nutrition" size={18} className="text-mint-500" /><p className="font-semibold">{m.title}</p></div>
            <p className="text-[14px] text-muted leading-relaxed">{m.items}</p>
          </Card>
        ))}
      </div>

      <Card className="!p-5 mt-3">
        <div className="flex items-center gap-2 mb-1.5"><Icon name="droplet" size={18} className="text-brand-500" /><p className="font-semibold">Hydration tip</p></div>
        <p className="text-[14px] text-muted leading-relaxed">Aim for pale-yellow urine as a simple hydration check. Keep a water bottle within reach while you rest, and use the water tracker on your home screen.</p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

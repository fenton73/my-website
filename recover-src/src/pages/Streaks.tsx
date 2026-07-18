import { motion } from "framer-motion";
import { useStore } from "../store";
import { PageHeader, Card, DisclaimerFooter, SectionTitle } from "../ui";
import { Icon } from "../icons";
import { streaks } from "../selectors";

const grad: Record<string, string> = {
  mint: "from-mint-400 to-mint-600", brand: "from-brand-500 to-brand-600",
  violet: "from-violet-500 to-fuchsia-500", amber: "from-amber-400 to-orange-500",
};

export default function Streaks() {
  const { state } = useStore();
  const data = streaks(state);
  const best = Math.max(0, ...data.map((s) => s.days));

  return (
    <div>
      <PageHeader title="Streaks" subtitle="Consistency is the quiet superpower of recovery" icon="flame" />

      <Card className="!p-6 text-center bg-gradient-to-br from-amber-400/15 to-orange-500/10">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="text-[64px] leading-none">🔥</motion.div>
        <p className="text-[40px] font-bold tracking-tight mt-1">{best} {best === 1 ? "day" : "days"}</p>
        <p className="text-muted text-[14px]">your longest current streak</p>
      </Card>

      <SectionTitle>All streaks</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {data.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card !p-5 flex flex-col items-center text-center">
            <span className={`grid place-items-center w-12 h-12 rounded-2xl text-white bg-gradient-to-br ${grad[s.tone]} mb-2`}><Icon name={s.icon} size={22} /></span>
            <p className="text-[30px] font-bold leading-none">{s.days}</p>
            <p className="text-[13px] text-muted mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <Card className="!p-5 mt-4 flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0"><Icon name="info" size={20} /></span>
        <p className="text-[13.5px] text-muted leading-relaxed">
          A streak counts each day in a row you hit that habit. The checklist streak needs at least 80% of tasks done.
          Miss a day? No guilt — just start a fresh streak tomorrow. Progress isn’t about being perfect.
        </p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

import { motion } from "framer-motion";
import { useStore } from "../store";
import { PageHeader, Card, DisclaimerFooter, ProgressBar } from "../ui";
import { Icon } from "../icons";
import { ACHIEVEMENTS } from "../content";
import { earnedAchievements } from "../selectors";

const grad: Record<string, string> = {
  brand: "from-brand-500 to-brand-600", mint: "from-mint-400 to-mint-600",
  amber: "from-amber-400 to-orange-500", violet: "from-violet-500 to-fuchsia-500",
};

export default function Achievements() {
  const { state } = useStore();
  const earned = earnedAchievements(state);
  const pct = Math.round((earned.size / ACHIEVEMENTS.length) * 100);

  return (
    <div>
      <PageHeader title="Achievements" subtitle="Celebrate every milestone on the way back" icon="trophy" />

      <Card className="!p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{earned.size} of {ACHIEVEMENTS.length} unlocked</span>
          <span className="text-muted text-[14px]">{pct}%</span>
        </div>
        <ProgressBar value={pct} tone="amber" />
      </Card>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {ACHIEVEMENTS.map((a, i) => {
          const got = earned.has(a.id);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className={`card !p-5 flex flex-col items-center text-center relative overflow-hidden ${got ? "" : "opacity-70"}`}>
              {got && <motion.div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}
              <span className={`relative grid place-items-center w-16 h-16 rounded-3xl mb-2 ${got ? `text-white bg-gradient-to-br ${grad[a.tone]} shadow-glass` : "bg-black/6 dark:bg-white/8 text-muted"}`}>
                <Icon name={got ? a.icon : "circle"} size={30} />
                {!got && <span className="absolute -bottom-1 -right-1 grid place-items-center w-6 h-6 rounded-full bg-black/20 text-white text-[11px]">🔒</span>}
              </span>
              <p className="relative font-bold text-[15px]">{a.title}</p>
              <p className="relative text-[12.5px] text-muted mt-0.5 leading-snug">{a.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <DisclaimerFooter />
    </div>
  );
}

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, Chip, Button } from "../ui";
import { Icon } from "../icons";
import { useNav } from "../nav";
import { ARTICLES, type Article } from "../content";

const tone: Record<string, string> = {
  brand: "from-brand-500 to-brand-600", mint: "from-mint-400 to-mint-600",
  amber: "from-amber-400 to-orange-500", violet: "from-violet-500 to-fuchsia-500",
  rose: "from-rose-400 to-red-500",
};

export default function Learn() {
  const { go } = useNav();
  const [active, setActive] = useState<Article | null>(null);

  if (active) {
    return (
      <div>
        <button onClick={() => setActive(null)} className="tap flex items-center gap-1.5 text-brand-600 dark:text-brand-300 font-semibold mb-3">
          <Icon name="chevronLeft" size={18} /> All topics
        </button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`grid place-items-center w-14 h-14 rounded-3xl text-white bg-gradient-to-br ${tone[active.tone]} mb-3`}><Icon name={active.icon} size={26} /></div>
          <h1 className="text-[26px] font-bold tracking-tight leading-tight">{active.title}</h1>
          <div className="flex items-center gap-2 mt-2 mb-4"><Chip icon="clock">{active.minutes} min read</Chip></div>
          <Card className="!p-6 space-y-4">
            {active.body.map((p, i) => <p key={i} className="text-[15.5px] leading-relaxed">{p}</p>)}
          </Card>
          {active.id === "clots" && (
            <Button className="mt-3" full variant="danger" icon="warning" onClick={() => go("warnings")}>See all urgent warning signs</Button>
          )}
        </motion.div>
        <DisclaimerFooter />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Learn" subtitle="Understand your recovery to feel in control of it" icon="book" />
      <DoctorFirstBanner />

      <Card onClick={() => go("warnings")} hover className="!p-4 mt-3 !border-rose-500/30">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 text-white shrink-0"><Icon name="warning" size={22} /></span>
          <div className="flex-1"><p className="font-bold">Urgent warning signs</p><p className="text-[13px] text-muted">Know when to seek help immediately</p></div>
          <Icon name="chevronRight" className="text-muted" />
        </div>
      </Card>

      <div className="grid gap-2.5 mt-3">
        {ARTICLES.map((a) => (
          <Card key={a.id} onClick={() => setActive(a)} hover className="!p-4">
            <div className="flex items-center gap-3">
              <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${tone[a.tone]} shrink-0`}><Icon name={a.icon} size={21} /></span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15.5px]">{a.title}</p>
                <p className="text-[13px] text-muted truncate">{a.summary}</p>
              </div>
              <Icon name="chevronRight" className="text-muted shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      <DisclaimerFooter />
    </div>
  );
}

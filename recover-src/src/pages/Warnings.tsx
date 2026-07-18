import { motion } from "framer-motion";
import { PageHeader, Card, DisclaimerFooter } from "../ui";
import { Icon } from "../icons";
import { WARNINGS } from "../content";

export default function Warnings() {
  return (
    <div>
      <PageHeader title="Warning signs" subtitle="When to seek urgent medical help" icon="warning" />

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-4xl p-6 text-white bg-gradient-to-br from-rose-500 to-red-600 shadow-glass-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/20"><Icon name="warning" size={26} /></span>
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide opacity-90">Important</p>
            <p className="text-[20px] font-bold leading-tight">Seek urgent medical advice immediately if…</p>
          </div>
        </div>
        <p className="text-[14px] opacity-95 leading-relaxed">These can be signs of a serious problem such as poor blood flow, infection, or a blood clot. Do not wait — contact your medical team, or in an emergency call your local emergency number.</p>
      </motion.div>

      <div className="grid gap-2.5 mt-3">
        {WARNINGS.map((w, i) => (
          <motion.div key={w.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-3xl p-4 border-2 border-rose-500/30 bg-rose-500/8">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5"><Icon name="warning" size={18} /></span>
              <div>
                <p className="font-bold text-[15.5px] text-rose-700 dark:text-rose-300">{w.title}</p>
                <p className="text-[13.5px] text-muted mt-0.5 leading-snug">{w.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="!p-5 mt-4 text-center !border-rose-500/30">
        <p className="font-bold text-[17px]">Never ignore these signs.</p>
        <p className="text-[14px] text-muted mt-1 leading-relaxed">Trusting your instincts is never an over-reaction. If something feels seriously wrong, get medical help straight away.</p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

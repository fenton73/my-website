import { motion } from "framer-motion";
import { PageHeader, Card, DisclaimerFooter, DoctorFirstBanner } from "../ui";
import { Icon, type IconName } from "../icons";
import { useNav, type Route } from "../nav";

const ITEMS: { route: Route; label: string; desc: string; icon: IconName; tone: string }[] = [
  { route: "timeline", label: "Timeline", desc: "Your recovery stages", icon: "route", tone: "brand" },
  { route: "mood", label: "Mood & journal", desc: "Feelings & reflections", icon: "smile", tone: "violet" },
  { route: "pain", label: "Pain & swelling", desc: "Track symptoms", icon: "activity", tone: "rose" },
  { route: "breathe", label: "Breathing", desc: "Calm 4·7·8 breath", icon: "wind", tone: "mint" },
  { route: "meds", label: "Medication", desc: "Doses & supplements", icon: "pill", tone: "rose" },
  { route: "nutrition", label: "Nutrition", desc: "Fuel bone healing", icon: "nutrition", tone: "mint" },
  { route: "exercise", label: "Exercises", desc: "Physio-approved only", icon: "dumbbell", tone: "brand" },
  { route: "goals", label: "Goals", desc: "Weekly & monthly", icon: "target", tone: "amber" },
  { route: "hospital", label: "Hospital", desc: "Appointments & notes", icon: "hospital", tone: "brand" },
  { route: "warnings", label: "Warning signs", desc: "When to get help", icon: "warning", tone: "rose" },
  { route: "streaks", label: "Streaks", desc: "Your consistency", icon: "flame", tone: "amber" },
  { route: "achievements", label: "Achievements", desc: "Badges & milestones", icon: "trophy", tone: "amber" },
  { route: "calendar", label: "Calendar", desc: "Every logged day", icon: "calendar", tone: "brand" },
  { route: "photos", label: "Healing photos", desc: "Ankle timeline", icon: "camera", tone: "violet" },
  { route: "insights", label: "Insights", desc: "Trends & review", icon: "insights", tone: "mint" },
  { route: "report", label: "Doctor report", desc: "Printable summary", icon: "fileText", tone: "brand" },
  { route: "settings", label: "Settings", desc: "Theme, data, backup", icon: "settings", tone: "violet" },
];

const grad: Record<string, string> = {
  brand: "from-brand-500 to-brand-600", mint: "from-mint-400 to-mint-600",
  amber: "from-amber-400 to-orange-500", violet: "from-violet-500 to-fuchsia-500", rose: "from-rose-400 to-red-500",
};

export default function More() {
  const { go } = useNav();
  return (
    <div>
      <PageHeader title="Everything" subtitle="All your recovery tools in one place" icon="sparkles" />
      <DoctorFirstBanner />
      <div className="grid grid-cols-2 gap-3 mt-3">
        {ITEMS.map((it, i) => (
          <motion.button key={it.route} onClick={() => go(it.route)}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            whileTap={{ scale: 0.97 }} className="tap card !p-4 text-left flex flex-col gap-2">
            <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${grad[it.tone]}`}><Icon name={it.icon} size={21} /></span>
            <div><p className="font-semibold text-[15px]">{it.label}</p><p className="text-[12.5px] text-muted leading-snug">{it.desc}</p></div>
          </motion.button>
        ))}
      </div>
      <DisclaimerFooter />
    </div>
  );
}

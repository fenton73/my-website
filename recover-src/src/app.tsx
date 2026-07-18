import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store";
import { NavProvider, useNav, type Route } from "./nav";
import { Icon, type IconName } from "./icons";
import { haptic } from "./lib";

import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Checklist from "./pages/Checklist";
import Timeline from "./pages/Timeline";
import Mood from "./pages/Mood";
import Pain from "./pages/Pain";
import Breathe from "./pages/Breathe";
import Meds from "./pages/Meds";
import Nutrition from "./pages/Nutrition";
import Learn from "./pages/Learn";
import Warnings from "./pages/Warnings";
import Exercise from "./pages/Exercise";
import Goals from "./pages/Goals";
import Hospital from "./pages/Hospital";
import Streaks from "./pages/Streaks";
import Achievements from "./pages/Achievements";
import Calendar from "./pages/Calendar";
import Photos from "./pages/Photos";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import More from "./pages/More";
import Report from "./pages/Report";

const PAGES: Record<Route, () => JSX.Element> = {
  home: Home, checklist: Checklist, timeline: Timeline, mood: Mood, pain: Pain,
  breathe: Breathe, meds: Meds, nutrition: Nutrition, learn: Learn, warnings: Warnings,
  exercise: Exercise, goals: Goals, hospital: Hospital, streaks: Streaks,
  achievements: Achievements, calendar: Calendar, photos: Photos, insights: Insights,
  settings: Settings, more: More, report: Report,
};

const TABS: { route: Route; label: string; icon: IconName }[] = [
  { route: "home", label: "Home", icon: "home" },
  { route: "checklist", label: "Today", icon: "checkCircle" },
  { route: "insights", label: "Progress", icon: "insights" },
  { route: "learn", label: "Learn", icon: "book" },
  { route: "more", label: "More", icon: "sparkles" },
];

// Which tab is highlighted for a given route.
const TAB_FOR: Partial<Record<Route, Route>> = {
  home: "home", checklist: "home",
  insights: "insights", streaks: "insights", achievements: "insights", calendar: "insights", pain: "insights", mood: "insights", photos: "insights", report: "insights",
  learn: "learn", nutrition: "learn", warnings: "learn",
  more: "more", timeline: "more", meds: "more", exercise: "more", goals: "more", hospital: "more", breathe: "more", settings: "more",
};

function Shell() {
  const { route } = useNav();
  const Page = PAGES[route] ?? Home;
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <TopBar />
      <main id="scroll-main" className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-xl mx-auto px-4 pt-2 pb-32"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={route}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Page />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
      <InstallPrompt />
    </div>
  );
}

function TopBar() {
  const { route, go, back } = useNav();
  const showBack = !["home", "checklist", "insights", "learn", "more"].includes(route);
  return (
    <header className="sticky top-0 z-40 glass border-b hairline"
      style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button onClick={back} className="tap -ml-1 w-9 h-9 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/8"><Icon name="chevronLeft" size={22} /></button>
          ) : (
            <button onClick={() => go("home")} className="tap flex items-center gap-2">
              <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 text-white font-bold text-[13px]">R+</span>
              <span className="font-bold text-[17px] tracking-tight">Recover+</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => go("warnings")} aria-label="Warning signs" className="tap w-9 h-9 grid place-items-center rounded-full text-rose-500 hover:bg-rose-500/10"><Icon name="warning" size={20} /></button>
          <button onClick={() => go("settings")} aria-label="Settings" className="tap w-9 h-9 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/8"><Icon name="settings" size={20} /></button>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { route, go } = useNav();
  const activeTab = TAB_FOR[route] ?? "home";
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t hairline"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-xl mx-auto px-2 h-16 grid grid-cols-5">
        {TABS.map((t) => {
          const active = activeTab === t.route;
          return (
            <button key={t.route} onClick={() => { haptic(); go(t.route); }}
              className="tap relative flex flex-col items-center justify-center gap-0.5">
              {active && <motion.span layoutId="tabdot" className="absolute top-1.5 w-9 h-9 rounded-2xl bg-brand-500/12"
                transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <Icon name={t.icon} size={23} className={`relative transition-colors ${active ? "text-brand-600 dark:text-brand-300" : "text-muted"}`} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`relative text-[10.5px] font-medium ${active ? "text-brand-600 dark:text-brand-300" : "text-muted"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function InstallPrompt() {
  const [evt, setEvt] = useState<any>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const dismissed = localStorage.getItem("rp-install-dismissed");
    const h = (e: any) => { e.preventDefault(); setEvt(e); if (!dismissed) setTimeout(() => setShow(true), 4000); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  const install = async () => { setShow(false); if (evt) { evt.prompt(); await evt.userChoice; setEvt(null); } };
  const dismiss = () => { setShow(false); localStorage.setItem("rp-install-dismissed", "1"); };
  return (
    <AnimatePresence>
      {show && evt && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="fixed bottom-20 inset-x-3 z-50 max-w-xl sm:mx-auto glass-strong rounded-3xl shadow-glass-lg border hairline p-4 flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white shrink-0 font-bold">R+</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14.5px]">Install Recover+</p>
            <p className="text-[12.5px] text-muted">Add to your home screen for a full-screen app.</p>
          </div>
          <button onClick={dismiss} className="tap text-[13px] font-semibold text-muted px-2">Later</button>
          <button onClick={install} className="tap text-[13px] font-semibold text-white bg-brand-500 px-3 py-2 rounded-xl">Install</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const { state } = useStore();
  if (!state.onboarded) return <Onboarding />;
  return (
    <NavProvider>
      <Shell />
    </NavProvider>
  );
}

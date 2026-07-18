import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Route =
  | "home" | "checklist" | "timeline" | "mood" | "pain" | "breathe" | "meds"
  | "nutrition" | "learn" | "warnings" | "exercise" | "goals" | "hospital"
  | "streaks" | "achievements" | "calendar" | "photos" | "insights" | "settings"
  | "more" | "report";

interface NavCtx { route: Route; go: (r: Route) => void; back: () => void; }
const Ctx = createContext<NavCtx | null>(null);

const VALID: Route[] = [
  "home","checklist","timeline","mood","pain","breathe","meds","nutrition","learn",
  "warnings","exercise","goals","hospital","streaks","achievements","calendar",
  "photos","insights","settings","more","report",
];

function fromHash(): Route {
  const h = location.hash.replace(/^#\/?/, "") as Route;
  return VALID.includes(h) ? h : "home";
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(fromHash());

  useEffect(() => {
    const h = () => setRoute(fromHash());
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  const go = (r: Route) => {
    if (location.hash !== `#/${r}`) location.hash = `#/${r}`;
    setRoute(r);
    // scroll main to top on navigation
    requestAnimationFrame(() => document.getElementById("scroll-main")?.scrollTo({ top: 0, behavior: "auto" }));
  };
  const back = () => (history.length > 1 ? history.back() : go("home"));

  return <Ctx.Provider value={{ route, go, back }}>{children}</Ctx.Provider>;
}

export function useNav() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNav within NavProvider");
  return c;
}

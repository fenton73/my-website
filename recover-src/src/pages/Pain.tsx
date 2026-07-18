import { useStore, getDay, recentKeys } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, DoctorFirstBanner, SectionTitle, LineChart, TextArea, Slider, Stat,
} from "../ui";
import { Icon } from "../icons";
import { formatShort } from "../lib";

const BRUISE = ["None", "Light", "Moderate", "Heavy"];

export default function Pain() {
  const { state, today, day, setDay } = useStore();
  const keys = recentKeys(14);
  const painData = keys.map((k) => getDay(state, k).pain);
  const swellData = keys.map((k) => getDay(state, k).swelling);
  const painLogged = painData.some((v) => v != null);
  const swellLogged = swellData.some((v) => v != null);

  const avg = (arr: (number | null)[]) => {
    const v = arr.filter((x): x is number => x != null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : "—";
  };

  return (
    <div>
      <PageHeader title="Pain & swelling" subtitle="Tracking trends helps you and your medical team" icon="activity" />
      <DoctorFirstBanner />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <Card className="!p-4"><Stat icon="activity" tone="rose" value={`${avg(painData)}`} sub="avg pain (14d)" label="pain" /></Card>
        <Card className="!p-4"><Stat icon="gauge" tone="amber" value={`${avg(swellData)}`} sub="avg swelling (14d)" label="swelling" /></Card>
      </div>

      <Card className="!p-5 mt-3 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-semibold"><Icon name="activity" size={18} className="text-rose-500" /> Pain level</span>
            <span className="text-[15px] font-bold">{day.pain ?? 0}<span className="text-muted text-[13px] font-normal">/10</span></span>
          </div>
          <Slider value={day.pain ?? 0} onChange={(n) => setDay(today, (d) => { d.pain = n; })} tone="rose" labels={["No pain", "Worst pain"]} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-semibold"><Icon name="gauge" size={18} className="text-amber-500" /> Swelling</span>
            <span className="text-[15px] font-bold">{day.swelling ?? 0}<span className="text-muted text-[13px] font-normal">/10</span></span>
          </div>
          <Slider value={day.swelling ?? 0} onChange={(n) => setDay(today, (d) => { d.swelling = n; })} tone="amber" labels={["None", "Severe"]} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2 font-semibold"><Icon name="droplet" size={18} className="text-violet-500" /> Bruising</span>
            <span className="text-[15px] font-bold">{BRUISE[day.bruising ?? 0]}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BRUISE.map((b, i) => (
              <button key={b} onClick={() => setDay(today, (d) => { d.bruising = i; })}
                className={`tap py-2 rounded-xl text-[13px] font-semibold transition-colors ${(day.bruising ?? 0) === i ? "bg-violet-500 text-white" : "bg-black/5 dark:bg-white/8 text-muted"}`}>{b}</button>
            ))}
          </div>
        </div>
        <div>
          <span className="flex items-center gap-2 font-semibold mb-2"><Icon name="pencil" size={18} className="text-brand-500" /> Notes</span>
          <TextArea value={day.notes} onChange={(e) => setDay(today, (d) => { d.notes = e.target.value; })}
            placeholder="Anything you noticed — e.g. throbbing after standing, better after elevating…" />
        </div>
      </Card>

      <SectionTitle>Pain trend · 14 days</SectionTitle>
      <Card className="!p-5">
        {painLogged ? (
          <>
            <LineChart data={painData} min={0} max={10} tone="#ef4444" height={120} />
            <div className="flex justify-between text-[11px] text-muted mt-1 px-1"><span>{formatShort(keys[0])}</span><span>{formatShort(keys[keys.length - 1])}</span></div>
          </>
        ) : <p className="text-muted text-sm text-center py-6">Log pain to see your trend.</p>}
      </Card>

      <SectionTitle>Swelling trend · 14 days</SectionTitle>
      <Card className="!p-5">
        {swellLogged ? (
          <>
            <LineChart data={swellData} min={0} max={10} tone="#f59e0b" height={120} />
            <div className="flex justify-between text-[11px] text-muted mt-1 px-1"><span>{formatShort(keys[0])}</span><span>{formatShort(keys[keys.length - 1])}</span></div>
          </>
        ) : <p className="text-muted text-sm text-center py-6">Log swelling to see your trend.</p>}
      </Card>

      <Card className="!p-4 mt-3 flex items-start gap-3 !border-rose-500/25">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 shrink-0"><Icon name="warning" size={20} /></span>
        <p className="text-[13.5px] leading-relaxed">
          Pain that keeps <span className="font-semibold">increasing</span>, a cast that feels <span className="font-semibold">too tight</span>, or toes turning blue or numb need
          urgent attention — see the <span className="font-semibold">Warning signs</span> page and contact your medical team.
        </p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

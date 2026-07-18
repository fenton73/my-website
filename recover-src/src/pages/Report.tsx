import { useStore, useDaysSinceInjury, getDay, recentKeys } from "../store";
import { PageHeader, Card, Button, DisclaimerFooter } from "../ui";
import { Icon } from "../icons";
import { formatNice, todayKey } from "../lib";
import { PHASE_LABELS, MOODS } from "../content";
import { dayCompletion, streaks } from "../selectors";

export default function Report() {
  const { state } = useStore();
  const daysSince = useDaysSinceInjury(state);
  const keys14 = recentKeys(14);

  const rows = keys14.map((k) => {
    const d = getDay(state, k);
    const c = dayCompletion(state, k);
    return { k, pain: d.pain, swelling: d.swelling, mood: d.mood, sleep: d.sleepHours, water: d.water, tasks: `${c.done}/${c.total}` };
  }).reverse();

  const nums = (arr: (number | null)[]) => { const v = arr.filter((x): x is number => x != null); return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : "—"; };
  const avgPain = nums(keys14.map((k) => getDay(state, k).pain));
  const avgSwell = nums(keys14.map((k) => getDay(state, k).swelling));
  const avgMood = nums(keys14.map((k) => getDay(state, k).mood));
  const bestStreak = Math.max(0, ...streaks(state).map((s) => s.days));

  return (
    <div>
      <div className="print:hidden">
        <PageHeader title="Doctor report" subtitle="A clear summary to bring to your appointment" icon="fileText" />
        <div className="flex gap-2 mb-4">
          <Button icon="share" onClick={() => window.print()} full>Print / Save as PDF</Button>
        </div>
        <Card className="!p-4 mb-4 flex items-start gap-3">
          <Icon name="info" size={20} className="text-brand-500 mt-0.5 shrink-0" />
          <p className="text-[13.5px] text-muted leading-relaxed">Tap “Print / Save as PDF”, then choose <span className="font-semibold">Save as PDF</span> as the printer to keep a copy. This is a personal record, not a medical document.</p>
        </Card>
      </div>

      {/* Printable sheet */}
      <div id="report-sheet" className="bg-white text-[#111] rounded-4xl p-6 print:p-0 print:rounded-none shadow-glass print:shadow-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div>
            <h1 className="text-[22px] font-bold">Recovery Summary</h1>
            <p className="text-[13px] text-black/50">{state.profile.name ? `${state.profile.name} · ` : ""}Generated {formatNice(todayKey())}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#337dff] to-[#12c98a] grid place-items-center text-white font-bold">R+</div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-[14px]">
          <Line label="Injury date" value={formatNice(state.profile.injuryDate)} />
          <Line label="Days since injury" value={`${daysSince}`} />
          <Line label="Current phase" value={PHASE_LABELS[state.profile.phase] ?? "—"} />
          <Line label="Next appointment" value={formatNice(state.profile.nextAppointment)} />
          <Line label="Avg pain (14d)" value={`${avgPain} / 10`} />
          <Line label="Avg swelling (14d)" value={`${avgSwell} / 10`} />
          <Line label="Avg mood (14d)" value={`${avgMood} / 5`} />
          <Line label="Best current streak" value={`${bestStreak} days`} />
        </div>

        {state.medications.length > 0 && (
          <Section title="Medications & supplements">
            {state.medications.map((m) => <p key={m.id} className="text-[13.5px]">• {m.name}{m.dose ? ` — ${m.dose}` : ""}</p>)}
          </Section>
        )}

        <Section title="Last 14 days">
          <table className="w-full text-[12px] border-collapse">
            <thead><tr className="text-left text-black/50 border-b border-black/10">
              <th className="py-1 pr-2 font-medium">Date</th><th className="font-medium px-1">Pain</th><th className="font-medium px-1">Swell</th>
              <th className="font-medium px-1">Mood</th><th className="font-medium px-1">Sleep</th><th className="font-medium px-1">Water</th><th className="font-medium px-1">Tasks</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="border-b border-black/5">
                  <td className="py-1 pr-2 whitespace-nowrap">{formatNice(r.k).replace(/,.*$/, "")}</td>
                  <td className="px-1">{r.pain ?? "—"}</td><td className="px-1">{r.swelling ?? "—"}</td>
                  <td className="px-1">{r.mood ? MOODS[r.mood - 1].label : "—"}</td>
                  <td className="px-1">{r.sleep ?? "—"}</td><td className="px-1">{r.water || "—"}</td><td className="px-1">{r.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {state.questions.length > 0 && (
          <Section title="Questions for my team">
            {state.questions.map((q) => <p key={q.id} className="text-[13.5px]">• {q.text}{q.answer ? ` — (answer: ${q.answer})` : ""}</p>)}
          </Section>
        )}

        <p className="text-[11px] text-black/45 mt-5 border-t border-black/10 pt-3">
          This app is for organisation and education only. It does not replace advice from your doctor or physiotherapist.
        </p>
      </div>

      <div className="print:hidden"><DisclaimerFooter /></div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b border-black/5 py-1"><span className="text-black/55">{label}</span><span className="font-semibold">{value}</span></div>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-5"><h2 className="text-[13px] font-bold uppercase tracking-wide text-black/50 mb-1.5">{title}</h2><div className="space-y-0.5">{children}</div></div>;
}

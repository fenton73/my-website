import { useStore, getDay } from "../store";
import {
  PageHeader, Card, DisclaimerFooter, TextArea, SectionTitle, LineChart, Chip, Field, EmptyState,
} from "../ui";
import { Icon } from "../icons";
import { MOODS } from "../content";
import { recentKeys } from "../store";
import { formatShort, haptic } from "../lib";

export default function Mood() {
  const { state, today, day, setDay } = useStore();
  const keys = recentKeys(14);
  const moodData = keys.map((k) => getDay(state, k).mood);
  const logged = moodData.filter((m) => m != null).length;

  const j = day.journal;
  const setJ = (key: keyof typeof j, v: string) => setDay(today, (d) => { d.journal[key] = v; });

  return (
    <div>
      <PageHeader title="Mood & journal" subtitle="How you feel matters just as much as the ankle" icon="smile" />

      <Card className="!p-6 text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted mb-4">How are you feeling right now?</p>
        <div className="flex justify-between">
          {MOODS.map((m) => (
            <button key={m.v} onClick={() => { haptic(); setDay(today, (d) => { d.mood = m.v; d.moodEmoji = m.emoji; }); }}
              className={`flex flex-col items-center gap-1.5 tap transition-all ${day.mood === m.v ? "scale-110" : "opacity-50 hover:opacity-90"}`}>
              <span className="text-[38px] leading-none">{m.emoji}</span>
              <span className={`text-[12px] font-medium ${day.mood === m.v ? "text-violet-600 dark:text-violet-300" : "text-muted"}`}>{m.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <SectionTitle right={<Chip tone="violet">{logged} logged</Chip>}>Last 14 days</SectionTitle>
      <Card className="!p-5">
        {logged > 0 ? (
          <>
            <LineChart data={moodData} min={1} max={5} tone="#8b5cf6" height={130} />
            <div className="flex justify-between text-[11px] text-muted mt-1 px-1">
              <span>{formatShort(keys[0])}</span><span>{formatShort(keys[keys.length - 1])}</span>
            </div>
          </>
        ) : <EmptyState icon="smile" title="No mood logged yet" sub="Tap an emoji above to start your mood graph." />}
      </Card>

      <SectionTitle>Today’s journal</SectionTitle>
      <Card className="!p-5 space-y-1">
        <Field label="How are you feeling?"><TextArea value={j.feeling} onChange={(e) => setJ("feeling", e.target.value)} placeholder="Write freely — no one else sees this." /></Field>
        <Field label="What went well today?"><TextArea value={j.wentWell} onChange={(e) => setJ("wentWell", e.target.value)} placeholder="Even something small counts." rows={2} /></Field>
        <Field label="What are you grateful for?"><TextArea value={j.grateful} onChange={(e) => setJ("grateful", e.target.value)} placeholder="People, moments, comforts…" rows={2} /></Field>
        <Field label="One small win today?"><TextArea value={j.win} onChange={(e) => setJ("win", e.target.value)} placeholder="A tiny bit of progress." rows={2} /></Field>
      </Card>

      <Card className="!p-4 mt-3 flex items-start gap-3">
        <span className="grid place-items-center w-10 h-10 rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-300 shrink-0"><Icon name="heart" size={20} /></span>
        <p className="text-[13.5px] leading-relaxed text-muted">
          If low mood lasts more than a couple of weeks or feels heavy, please talk to a parent, carer, GP or trusted adult.
          Asking for help is a strength.
        </p>
      </Card>

      <DisclaimerFooter />
    </div>
  );
}

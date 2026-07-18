/* Compact stroke-icon set (Lucide-style geometry). */
type P = { [k: string]: string };

const PATHS: P = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.3"/><circle cx="3.5" cy="12" r="1.3"/><circle cx="3.5" cy="18" r="1.3"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  heart: '<path d="M12 20.5S3.5 15 3.5 8.9A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 8.5 2.1C20.5 15 12 20.5 12 20.5Z"/>',
  pill: '<path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  nutrition: '<path d="M12 8c-1-3-4-4-6-3 0 4 2 11 6 11s6-7 6-11c-2-1-5 0-6 3Z"/><path d="M12 8V4"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 5v14"/>',
  warning: '<path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  dumbbell: '<path d="M6 6v12M4 8v8M18 6v12M20 8v8M6 12h12"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  hospital: '<path d="M4 21V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v15"/><path d="M2 21h20"/><path d="M12 8v6M9 11h6"/>',
  flame: '<path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1 1.5 1.5 2 1 0-2-1-4 1-6Z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="m8.5 10.5-2.5-7M15.5 10.5l2.5-7M9 3h6"/><path d="M12 13.2l.9 1.9 2 .2-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 15.3l2-.2Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  camera: '<path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h5l1 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="12.5" r="3.2"/>',
  insights: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="m7 15 3-4 3 2 4-6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 12a7.4 7.4 0 0 0-.1-1l2-1.5-2-3.4-2.3.9a7.3 7.3 0 0 0-1.7-1l-.4-2.5H10l-.4 2.5a7.3 7.3 0 0 0-1.7 1l-2.3-.9-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a7.3 7.3 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.3 7.3 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5c.06-.33.1-.66.1-1Z"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  droplet: '<path d="M12 3s6 6.3 6 10.5a6 6 0 0 1-12 0C6 9.3 12 3 12 3Z"/>',
  bed: '<path d="M3 18V8M3 12h13a4 4 0 0 1 4 4v2M3 18h18M7 12V9h4v3"/>',
  footprints: '<path d="M8 16c-2 0-2.5-2-2.5-4S6 6 8 6s2 2 2 4-.5 6-2 6Z"/><path d="M16 20c-1.5 0-2-2-2-4s.5-4 2-4 2 2 2 4-.5 4-2 4Z"/>',
  walk: '<circle cx="13" cy="4.5" r="1.6"/><path d="M11 21l1.5-6-2.5-2 1-5 3 2 2 2M9 13l2-3M11 15l-2 6"/>',
  run: '<circle cx="15" cy="4.5" r="1.6"/><path d="m6 20 3-4 1-5 3 2 1 3M13 9l-3-2-3 2M18 11l-4-1"/>',
  activity: '<path d="M3 12h4l2 6 4-14 2 8h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 5-7 7 7 7"/>',
  share: '<path d="M12 15V3m0 0L8 7m4-4 4 4"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
  pencil: '<path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17Z"/><path d="m14 6 3 3"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  wind: '<path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5M3 14h15a2.5 2.5 0 1 1-2.5 2.5M3 12h7"/>',
  leaf: '<path d="M4 20C3 14 6 5 20 4c1 10-4 15-12 15a6 6 0 0 1-4-1Z"/><path d="M9 15c3-3 6-4 9-5"/>',
  message: '<path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4Z"/>',
  tv: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="m8 3 4 4 4-4"/>',
  sparkles: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  bolt: '<path d="M13 3 4 14h6l-1 7 9-11h-6Z"/>',
  cast: '<path d="M8 3h5l4 5v10a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 2-3Z"/><path d="M8 9h8M8 13h8"/>',
  boot: '<path d="M7 3h3v9c0 1 .5 2 2 3l6 3v3H5a2 2 0 0 1-2-2v-3l4-2Z"/>',
  steps: '<path d="M4 20h4v-4h4v-4h4V8h4"/>',
  physio: '<circle cx="12" cy="5" r="1.8"/><path d="M12 7v6M8 10h8M12 13l-3 6M12 13l3 6"/>',
  ball: '<circle cx="12" cy="12" r="8.5"/><path d="m12 7 3 2-1 3.5h-4L9 9Z"/><path d="M12 7V4M9 9 6 8M15 9l3-1M10 12.5 8 16M14 12.5l2 3.5"/>',
  jog: '<circle cx="14" cy="5" r="1.6"/><path d="m7 21 3-5 1-4 3 2 1 2M13 10l-3-2-3 1"/>',
  phone: '<path d="M4 5a2 2 0 0 1 2-2h2l2 4-2 2a12 12 0 0 0 5 5l2-2 4 2v2a2 2 0 0 1-2 2A16 16 0 0 1 4 5Z"/>',
  weight: '<path d="M5 8h14l-1.5 12a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1Z"/><circle cx="12" cy="6" r="2.5"/>',
  ruler: '<rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(0 12 12)"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  star: '<path d="m12 3 2.6 5.6L21 9.5l-4.5 4.3L17.6 21 12 17.8 6.4 21l1.1-7.2L3 9.5l6.4-.9Z"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  cloudSun: '<path d="M8 5a3 3 0 0 1 5.7 1.3A3.5 3.5 0 0 1 18 13H8a4 4 0 0 1 0-8Z"/><path d="M6 3.5 5 2.5M3 7H1.6M9.5 3 8.7 2M2.6 4.4l-.8-.8"/>',
  fileText: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-5"/><circle cx="12" cy="18" r="1"/>',
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name, size = 22, className = "", strokeWidth = 1.8, style,
}: { name: IconName; size?: number; className?: string; strokeWidth?: number; style?: React.CSSProperties }) {
  const inner = PATHS[name] ?? PATHS.circle;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

import { motion, AnimatePresence } from "framer-motion";
import {
  useEffect, useRef, useState, type ReactNode, type CSSProperties,
} from "react";
import { Icon, type IconName } from "./icons";
import { haptic } from "./lib";

/* ------------------------------------------------------------------ Card -- */
export function Card({
  children, className = "", onClick, delay = 0, style, as, hover = false,
}: {
  children: ReactNode; className?: string; onClick?: () => void; delay?: number;
  style?: CSSProperties; as?: "div" | "button"; hover?: boolean;
}) {
  const Comp: any = onClick ? motion.button : motion.div;
  return (
    <Comp
      onClick={onClick}
      style={style}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`card p-5 tap text-left w-full ${hover ? "transition-shadow hover:shadow-glass-lg" : ""} ${className}`}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------ PageHeader -- */
export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: IconName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-mint-500 text-white shadow-ring">
            <Icon name={icon} size={22} />
          </span>
        )}
        <div>
          <h1 className="text-[26px] leading-tight font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted text-[15px] mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-6 mb-2.5 px-1">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">{children}</h2>
      {right}
    </div>
  );
}

/* ---------------------------------------------------------------- Button -- */
export function Button({
  children, onClick, variant = "primary", size = "md", icon, className = "", disabled, type = "button", full,
}: {
  children?: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg"; icon?: IconName; className?: string; disabled?: boolean;
  type?: "button" | "submit"; full?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-ring",
    success: "bg-gradient-to-br from-mint-500 to-mint-600 text-white shadow-ring",
    secondary: "glass-strong hairline border",
    ghost: "hover:bg-black/5 dark:hover:bg-white/5",
    danger: "bg-gradient-to-br from-rose-500 to-red-500 text-white",
  };
  const sizes: Record<string, string> = {
    sm: "text-[13px] px-3 py-1.5 gap-1.5 rounded-xl",
    md: "text-[15px] px-4 py-2.5 gap-2 rounded-2xl",
    lg: "text-base px-5 py-3.5 gap-2 rounded-2xl",
  };
  return (
    <motion.button
      type={type} disabled={disabled}
      whileTap={{ scale: 0.96 }}
      onClick={() => { haptic(); onClick?.(); }}
      className={`tap inline-flex items-center justify-center font-semibold select-none disabled:opacity-40 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
    </motion.button>
  );
}

export function IconButton({
  name, onClick, label, size = 20, className = "", active = false,
}: { name: IconName; onClick?: () => void; label: string; size?: number; className?: string; active?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }} aria-label={label} title={label}
      onClick={() => { haptic(); onClick?.(); }}
      className={`tap grid place-items-center w-10 h-10 rounded-full ${active ? "bg-brand-500 text-white" : "glass-strong hairline border"} ${className}`}
    >
      <Icon name={name} size={size} />
    </motion.button>
  );
}

/* ----------------------------------------------------------- ProgressRing -- */
export function ProgressRing({
  value, size = 180, stroke = 16, children, gradient = true,
}: { value: number; size?: number; stroke?: number; children?: ReactNode; gradient?: boolean }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const id = useRef("rg" + Math.random().toString(36).slice(2, 7)).current;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#337dff" />
            <stop offset="1" stopColor="#12c98a" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="currentColor" strokeWidth={stroke} className="text-black/8 dark:text-white/10" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={gradient ? `url(#${id})` : "#337dff"} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/* --------------------------------------------------------------- ProgressBar */
export function ProgressBar({ value, className = "", tone = "brand" }: { value: number; className?: string; tone?: "brand" | "mint" | "amber" | "rose" }) {
  const tones: Record<string, string> = {
    brand: "from-brand-500 to-brand-600",
    mint: "from-mint-400 to-mint-600",
    amber: "from-amber-400 to-orange-500",
    rose: "from-rose-400 to-red-500",
  };
  return (
    <div className={`h-2.5 rounded-full bg-black/8 dark:bg-white/10 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${tones[tone]}`}
        initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- Segmented -- */
export function Segmented<T extends string>({
  options, value, onChange, className = "",
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`inline-flex p-1 rounded-2xl glass-strong hairline border ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => { haptic(); onChange(o.value); }}
          className="relative px-3.5 py-1.5 text-[13.5px] font-semibold rounded-xl tap"
        >
          {value === o.value && (
            <motion.span layoutId="seg" className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-ring"
              transition={{ type: "spring", stiffness: 400, damping: 32 }} />
          )}
          <span className={`relative z-10 ${value === o.value ? "text-white" : "text-muted"}`}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Slider -- */
export function Slider({
  value, onChange, min = 0, max = 10, step = 1, tone = "brand", labels,
}: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number;
  tone?: "brand" | "amber" | "rose" | "mint"; labels?: [string, string];
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const grad: Record<string, string> = {
    brand: "linear-gradient(90deg,#337dff,#59a1ff)",
    mint: "linear-gradient(90deg,#12c98a,#34e0a1)",
    amber: "linear-gradient(90deg,#fbbf24,#f97316)",
    rose: "linear-gradient(90deg,#fb7185,#ef4444)",
  };
  return (
    <div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => { onChange(Number(e.target.value)); }}
        onInput={() => haptic(4)}
        className="w-full h-7 cursor-pointer"
        style={{ background: `linear-gradient(90deg, transparent, transparent)`, // track drawn below
        }}
      />
      <div className="-mt-[26px] mb-[10px] mx-[2px] h-1.5 rounded-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 0)` }}>
        <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/12 relative">
          <div className="absolute left-0 top-0 h-1.5 rounded-full" style={{ width: `${pct}%`, background: grad[tone] }} />
        </div>
      </div>
      {labels && (
        <div className="flex justify-between text-[12px] text-muted mt-1.5">
          <span>{labels[0]}</span><span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Toggle -- */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch" aria-checked={checked} aria-label={label}
      onClick={() => { haptic(); onChange(!checked); }}
      className={`tap relative w-[52px] h-[31px] rounded-full transition-colors ${checked ? "bg-mint-500" : "bg-black/15 dark:bg-white/15"}`}
    >
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 34 }}
        className="absolute top-[3px] w-[25px] h-[25px] rounded-full bg-white shadow-md"
        style={{ left: checked ? 24 : 3 }} />
    </button>
  );
}

/* ------------------------------------------------------------------ Chip -- */
export function Chip({ children, tone = "neutral", icon }: { children: ReactNode; tone?: "neutral" | "brand" | "mint" | "amber" | "rose"; icon?: IconName }) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 dark:bg-white/8 text-muted",
    brand: "bg-brand-500/12 text-brand-600 dark:text-brand-300",
    mint: "bg-mint-500/14 text-mint-600 dark:text-mint-400",
    amber: "bg-amber-500/14 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500/14 text-rose-600 dark:text-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12.5px] font-semibold ${tones[tone]}`}>
      {icon && <Icon name={icon} size={14} />}{children}
    </span>
  );
}

/* ------------------------------------------------------------------ Stat -- */
export function Stat({ icon, label, value, sub, tone = "brand" }: { icon: IconName; label: string; value: ReactNode; sub?: string; tone?: string }) {
  const tones: Record<string, string> = {
    brand: "from-brand-500 to-brand-600", mint: "from-mint-400 to-mint-600",
    amber: "from-amber-400 to-orange-500", rose: "from-rose-400 to-red-500",
    violet: "from-violet-500 to-fuchsia-500",
  };
  return (
    <div className="flex items-center gap-3">
      <span className={`grid place-items-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${tones[tone] ?? tones.brand} shrink-0`}>
        <Icon name={icon} size={20} />
      </span>
      <div className="min-w-0">
        <div className="text-[22px] font-bold leading-none tracking-tight truncate">{value}</div>
        <div className="text-[12.5px] text-muted mt-1 truncate">{sub ?? label}</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Modal --- */
export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="relative glass-strong w-full sm:max-w-lg rounded-t-4xl sm:rounded-4xl shadow-glass-lg border hairline max-h-[92vh] overflow-hidden flex flex-col"
            initial={{ y: "100%", opacity: 0.6, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="mx-auto mt-3 mb-1 h-1.5 w-10 rounded-full bg-black/15 dark:bg-white/20 sm:hidden" />
            {title && (
              <div className="flex items-center justify-between px-5 pt-3 pb-2">
                <h3 className="text-lg font-bold">{title}</h3>
                <IconButton name="x" label="Close" onClick={onClose} size={18} />
              </div>
            )}
            <div className="px-5 pb-4 overflow-y-auto">{children}</div>
            {footer && <div className="px-5 py-3 border-t hairline flex gap-2 justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------ Form fields -- */
export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block mb-3.5">
      <span className="text-[13px] font-semibold text-muted px-1">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="text-[12px] text-muted px-1 mt-1 block">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-2xl bg-black/4 dark:bg-white/6 border hairline outline-none focus:ring-2 focus:ring-brand-500/50 text-[15px] transition-shadow";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none ${props.className ?? ""}`} rows={props.rows ?? 3} />;
}

/* ------------------------------------------------------------ EmptyState -- */
export function EmptyState({ icon, title, sub, action }: { icon: IconName; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-10 px-4">
      <span className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-black/5 dark:bg-white/8 text-muted mb-3">
        <Icon name={icon} size={28} />
      </span>
      <p className="font-semibold">{title}</p>
      {sub && <p className="text-muted text-[14px] mt-1 max-w-xs mx-auto">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- Disclaimer -- */
export function DisclaimerFooter() {
  return (
    <p className="text-[12px] text-muted text-center leading-relaxed mt-8 mb-2 px-5 max-w-md mx-auto">
      This app is for organisation and education only. It does not replace advice from your
      doctor or physiotherapist.
    </p>
  );
}

export function DoctorFirstBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-200 ${compact ? "px-3 py-2" : "px-4 py-3"}`}>
      <Icon name="shield" size={compact ? 16 : 18} className="mt-0.5 shrink-0" />
      <p className={`${compact ? "text-[12.5px]" : "text-[13.5px]"} font-medium leading-snug`}>
        Always follow your doctor’s instructions first.
      </p>
    </div>
  );
}

/* ------------------------------------------------------- Simple line chart -- */
export function LineChart({
  data, height = 120, min, max, tone = "#337dff", fill = true, labels,
}: { data: (number | null)[]; height?: number; min?: number; max?: number; tone?: string; fill?: boolean; labels?: string[] }) {
  const w = 320;
  const vals = data.filter((v): v is number => v != null);
  if (vals.length === 0) return <div className="h-[120px] grid place-items-center text-muted text-sm">No data yet</div>;
  const lo = min ?? Math.min(...vals);
  const hi = max ?? Math.max(...vals);
  const span = hi - lo || 1;
  const n = data.length;
  const x = (i: number) => (n === 1 ? w / 2 : (i / (n - 1)) * (w - 16) + 8);
  const y = (v: number) => height - 10 - ((v - lo) / span) * (height - 24);
  const pts = data.map((v, i) => (v == null ? null : [x(i), y(v)] as [number, number]));
  const present = pts.filter((p): p is [number, number] => p != null);
  const line = present.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const id = "lc" + Math.round(lo + hi + n);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity="0.28" />
          <stop offset="1" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && present.length > 1 && (
        <path d={`${line} L${present[present.length - 1][0]},${height} L${present[0][0]},${height} Z`} fill={`url(#${id})`} />
      )}
      <motion.path d={line} fill="none" stroke={tone} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />
      {present.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={tone} />)}
    </svg>
  );
}

/* -------------------------------------------------------- Simple bar chart -- */
export function BarChart({ data, height = 120, tone = "#12c98a", max }: { data: number[]; height?: number; tone?: string; max?: number }) {
  const hi = max ?? Math.max(1, ...data);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => (
        <motion.div key={i} className="flex-1 rounded-t-lg rounded-b-sm"
          style={{ background: tone, minHeight: 3 }}
          initial={{ height: 0 }} animate={{ height: `${(v / hi) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.02, ease: "easeOut" }} />
      ))}
    </div>
  );
}

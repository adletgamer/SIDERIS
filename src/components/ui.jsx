import React, { createContext, useContext } from 'react';

// ── Language context ──────────────────────────────────────────────────────────
export const LangCtx = createContext({ lang: 'en', t: (k) => k, toggle: () => {} });
export const useT = () => useContext(LangCtx);

// ── Pill ─────────────────────────────────────────────────────────────────────
export function Pill({ tone = 'muted', mono = false, children, className = '' }) {
  const tones = {
    muted:   'bg-white/5 text-muted border-white/10',
    cyan:    'bg-cyan-DEFAULT/10 text-cyan-hover border-cyan-DEFAULT/30',
    indigo:  'bg-indigo-DEFAULT/10 text-indigo-light border-indigo-DEFAULT/30',
    success: 'bg-success/10 text-success border-success/30',
    amber:   'bg-amber-DEFAULT/10 text-amber-light border-amber-DEFAULT/30',
    danger:  'bg-danger/10 text-danger border-danger/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-semibold ${mono ? 'font-mono tracking-normal normal-case' : 'tracking-[0.09em] uppercase'} ${tones[tone] ?? tones.muted} ${className}`}>
      {children}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', accent = false, accentColor = 'indigo' }) {
  const accentMap = {
    indigo: 'before:bg-indigo-DEFAULT',
    cyan:   'before:bg-cyan-DEFAULT',
    amber:  'before:bg-amber-DEFAULT',
  };
  return (
    <div className={`relative bg-card border border-line rounded-xl ${accent ? `before:content-[''] before:absolute before:left-0 before:right-0 before:top-0 before:h-px ${accentMap[accentColor] ?? accentMap.indigo} before:rounded-t-xl` : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── LabelCap ─────────────────────────────────────────────────────────────────
export function LabelCap({ children, className = '' }) {
  return (
    <div className={`text-[10px] font-semibold uppercase tracking-[0.14em] text-muted ${className}`}>
      {children}
    </div>
  );
}

// ── Hash ─────────────────────────────────────────────────────────────────────
export function Hash({ children, tone = 'indigo' }) {
  const map = {
    indigo:  'text-indigo-light bg-indigo-DEFAULT/10',
    cyan:    'text-cyan-hover bg-cyan-DEFAULT/10',
    amber:   'text-amber-light bg-amber-DEFAULT/10',
    muted:   'text-muted bg-white/5',
    success: 'text-success bg-success/10',
  };
  return (
    <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${map[tone] ?? map.muted}`}>
      {children}
    </span>
  );
}

// ── KPI ──────────────────────────────────────────────────────────────────────
export function KPI({ label, value, mono = false, accent = false, accentColor = 'indigo' }) {
  const accentMap = { indigo: 'text-indigo-light', cyan: 'text-cyan-DEFAULT', amber: 'text-amber-light' };
  return (
    <div className="bg-ink/40 border border-line rounded-lg p-3.5">
      <LabelCap>{label}</LabelCap>
      <div className={`mt-1 text-xl font-bold tabular-nums tracking-tight font-tabular ${mono ? 'font-mono' : ''} ${accent ? (accentMap[accentColor] ?? accentMap.indigo) : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className = '' }) {
  return <div className={`h-px bg-line ${className}`} />;
}

// ── ZkBadge ──────────────────────────────────────────────────────────────────
export function ZkBadge({ hash, verified = false, scanning = false }) {
  return (
    <div className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] overflow-hidden
      ${verified ? 'border-success/30 bg-success/5 text-success' : scanning ? 'border-indigo-DEFAULT/30 bg-indigo-DEFAULT/5 text-indigo-light zk-scan-line' : 'border-line bg-ink/50 text-muted'}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${verified ? 'bg-success' : scanning ? 'bg-indigo-DEFAULT animate-pulse' : 'bg-dim'}`} />
      {hash}
    </div>
  );
}

// ── TelRow ───────────────────────────────────────────────────────────────────
export function TelRow({ k, v, tone = 'muted', status }) {
  const tones = { muted:'text-muted', success:'text-success', indigo:'text-indigo-light', amber:'text-amber-light' };
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-line/50 last:border-0">
      <div className="text-[11px] text-dim font-mono truncate">{k}</div>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[11px] ${tones[tone]}`}>{v}</span>
        {status && <span className={`text-[10px] font-mono ${tones[tone]}`}>{status}</span>}
      </div>
    </div>
  );
}

// ── LedgerLine ───────────────────────────────────────────────────────────────
export function LedgerLine({ k, v, tone = 'muted', highlight = false }) {
  const tones = { muted:'text-slate-300', indigo:'text-indigo-light', success:'text-success', amber:'text-amber-light', cyan:'text-cyan-DEFAULT' };
  return (
    <div className={`flex items-start justify-between gap-4 py-1 border-b border-line/30 last:border-0 ${highlight ? 'bg-indigo-DEFAULT/5 -mx-2 px-2 rounded' : ''}`}>
      <span className="text-dim font-mono text-[12px] shrink-0">{k}</span>
      <span className={`font-mono text-[12px] text-right break-all ${tones[tone]}`}>{v}</span>
    </div>
  );
}

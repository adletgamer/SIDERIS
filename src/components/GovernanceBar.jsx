import React from 'react';
import { Languages, Wifi } from 'lucide-react';
import { useT, Pill } from './ui.jsx';

const STATES = {
  OPEN:     { dot: 'bg-success' },
  SEALED:   { dot: 'bg-indigo-DEFAULT' },
  RESOLVED: { dot: 'bg-amber-DEFAULT' },
};

export function GovernanceBar({ role, setRole, state }) {
  const { t, lang, toggle } = useT();

  const tabs = [
    { id: 'buyer',    label: t('tab.buyer'),    icon: '🏢' },
    { id: 'supplier', label: t('tab.supplier'), icon: '🚚' },
    { id: 'auditor',  label: t('tab.auditor'),  icon: '⚖️' },
  ];

  const avatarLabel = role === 'buyer' ? 'AP' : role === 'auditor' ? 'AU' : 'TA';
  const avatarGrad  = role === 'buyer'
    ? 'from-cyan-DEFAULT to-cyan-hover'
    : role === 'auditor'
    ? 'from-amber-DEFAULT to-amber-light'
    : 'from-indigo-DEFAULT to-indigo-light';

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-DEFAULT to-indigo-DEFAULT flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-widest">S</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[15px] tracking-[0.14em] text-white">SIDERIS</span>
            <span className="hidden md:inline text-[9px] font-mono text-dim mt-0.5 tracking-wider">
              v0.4 · {t('app.subtitle')}
            </span>
          </div>
        </div>

        {/* Network pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-success/30 bg-success/10">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[11px] font-mono text-success">{t('net.connected')}</span>
        </div>

        {/* Role tabs */}
        <nav className="ml-auto flex items-center bg-card border border-line rounded-lg p-1 overflow-x-auto no-scrollbar gap-0.5">
          {tabs.map(tab => {
            const active = role === tab.id;
            const activeStyles = active
              ? tab.id === 'buyer'
                ? 'bg-cyan-DEFAULT/15 text-white border-cyan-DEFAULT/40'
                : tab.id === 'auditor'
                ? 'bg-amber-DEFAULT/15 text-white border-amber-DEFAULT/40'
                : 'bg-indigo-DEFAULT/15 text-white border-indigo-DEFAULT/40'
              : 'text-muted border-transparent hover:text-white hover:bg-white/5';
            return (
              <button
                key={tab.id}
                onClick={() => setRole(tab.id)}
                className={`flex items-center gap-2 px-3 lg:px-4 py-1.5 rounded-md text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 border ${activeStyles}`}
              >
                <span className="text-[13px] leading-none">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Lang toggle + avatar */}
        <div className="flex items-center gap-2 ml-1 shrink-0">
          <button
            onClick={toggle}
            className="h-9 px-2.5 rounded-lg border border-line hover:border-line2 hover:bg-card2 flex items-center gap-1.5 transition-all duration-200 text-[11.5px] font-mono"
          >
            <Languages size={14} className="text-muted" />
            <span className="text-slate-300">{lang.toUpperCase()}</span>
            <span className="text-dim">→</span>
            <span className="text-indigo-light">{t('lang.to')}</span>
          </button>
          <div className={`hidden lg:flex w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad} items-center justify-center text-[11px] font-bold text-white`}>
            {avatarLabel}
          </div>
        </div>
      </div>

      <LifecycleStrip state={state} />
    </header>
  );
}

function LifecycleStrip({ state }) {
  const { t } = useT();
  const steps = [
    { key: 'OPEN',     label: t('step.1') },
    { key: 'SEALED',   label: t('step.2') },
    { key: 'RESOLVED', label: t('step.3') },
  ];
  const idx = steps.findIndex(s => s.key === state);

  const pillTone = state === 'OPEN' ? 'success' : state === 'SEALED' ? 'indigo' : 'amber';

  return (
    <div className="border-t border-line bg-ink/60">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-10 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted shrink-0">
          {t('lifecycle')}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {steps.map((s, i) => {
            const done   = i < idx;
            const active = i === idx;
            return (
              <React.Fragment key={s.key}>
                <div className={`flex items-center gap-2 text-[11px] font-mono ${active ? 'text-white' : done ? 'text-indigo-light' : 'text-dim'}`}>
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-indigo-DEFAULT animate-seal-pulse' : done ? 'bg-indigo-light' : 'bg-dim/50'}`} />
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <span className={`w-6 h-px ${i < idx ? 'bg-indigo-DEFAULT/60' : 'bg-line2'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="ml-auto shrink-0">
          <Pill tone={pillTone} mono>
            <span className={`w-1.5 h-1.5 rounded-full ${STATES[state].dot}`} />
            {t(`state.${state}`)}
          </Pill>
        </div>
      </div>
    </div>
  );
}

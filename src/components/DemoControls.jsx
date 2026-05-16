import React from 'react';
import { Timer, LockKeyhole, Sparkles, ChevronsRight } from 'lucide-react';
import { useT, Card } from './ui.jsx';
import { SUPPLIERS, fill, fmtCountdown } from '../lib/i18n.js';

export function DemoControls({ state, setState, countdown }) {
  const { t } = useT();
  const next = state === 'OPEN' ? 'SEALED' : state === 'SEALED' ? 'RESOLVED' : 'OPEN';

  const icons = { OPEN: Timer, SEALED: LockKeyhole, RESOLVED: Sparkles };
  const Ico = icons[state];

  const iconBg = state === 'OPEN'
    ? 'bg-success/15 text-success'
    : state === 'SEALED'
    ? 'bg-indigo-DEFAULT/15 text-indigo-light'
    : 'bg-amber-DEFAULT/15 text-amber-light';

  const btnStyle = state === 'OPEN'
    ? 'bg-indigo-DEFAULT hover:bg-indigo-light shadow-glow-indigo'
    : state === 'SEALED'
    ? 'bg-indigo-DEFAULT hover:bg-indigo-light shadow-glow-indigo'
    : 'bg-amber-DEFAULT hover:bg-amber-light shadow-glow-amber';

  const desc = fill(t(`demo.${state}.desc`), { n: SUPPLIERS.length });

  const countdownDisplay = state === 'OPEN'
    ? fmtCountdown(countdown)
    : state === 'SEALED'
    ? '— · — · —'
    : '✓ block #1,284,902';

  return (
    <Card className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Ico size={20} strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[11px] font-mono text-muted">{t(`demo.${state}.label`)}</div>
          <div className="text-base font-mono font-semibold tabular-nums text-white">{countdownDisplay}</div>
        </div>
      </div>

      <div className="hidden lg:block w-px h-10 bg-line" />

      <p className="flex-1 text-[12.5px] text-muted leading-relaxed">{desc}</p>

      <button
        onClick={() => setState(next)}
        className={`shrink-0 px-4 py-2.5 rounded-lg text-white font-semibold text-[13px] flex items-center gap-2 transition-all duration-200 ${btnStyle}`}
      >
        <ChevronsRight size={16} strokeWidth={2} />
        {t(`demo.next.${state}`)}
      </button>
    </Card>
  );
}

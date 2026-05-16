import React, { useState } from 'react';
import { Lock, ShieldCheck, Clock, Award, Fingerprint } from 'lucide-react';
import { useT, Card, LabelCap, Pill, ZkBadge, Hash } from '../components/ui.jsx';
import { SUPPLIERS, WINNER_ID, fmtUSD, fmtCountdown, fill } from '../lib/i18n.js';

export function SupplierView({ state, countdown }) {
  const { t } = useT();
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg border border-indigo-DEFAULT/25 bg-indigo-DEFAULT/5">
        <ShieldCheck size={16} className="text-indigo-light mt-0.5 shrink-0" strokeWidth={1.75} />
        <p className="text-[12px] text-muted leading-relaxed">{t('supplier.notice')}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 relative">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 hidden md:block">
          <div className="h-full border-l-2 border-dashed border-indigo-DEFAULT/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink border border-indigo-DEFAULT/30 rounded px-2 py-0.5">
            <span className="text-[9px] font-mono text-indigo-light uppercase tracking-widest">{t('supplier.boundary')}</span>
          </div>
        </div>
        {SUPPLIERS.map(s => <SupplierPanel key={s.id} supplier={s} state={state} countdown={countdown} />)}
      </div>
    </div>
  );
}

function SupplierPanel({ supplier: s, state, countdown }) {
  const { t } = useT();
  const [bid, setBid] = useState(s.bid);
  const [eta, setEta] = useState(s.eta);
  const [sustain, setSustain] = useState(s.sustain);
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning]   = useState(false);

  const isWinner = s.id === WINNER_ID;
  const resolved = state === 'RESOLVED';
  const sealed   = state === 'SEALED';
  const open     = state === 'OPEN';

  const handleSubmit = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setSubmitted(true); }, 2200);
  };

  const accentBorder = isWinner && resolved ? 'border-success/40' : 'border-indigo-DEFAULT/20';

  return (
    <Card className={`p-5 border ${accentBorder} relative`}>
      {/* Session tag */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-DEFAULT to-indigo-light flex items-center justify-center font-bold text-[11px] text-white">{s.id}</div>
          <div>
            <div className="text-[13px] font-semibold text-white">{s.name}</div>
            <div className="text-[10px] font-mono text-muted">{s.country} · {t('supplier.isolated')}</div>
          </div>
        </div>
        <Pill tone="indigo" mono>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-DEFAULT animate-seal-pulse" />
          {t('supplier.isolated')}
        </Pill>
      </div>

      {/* OPEN: bid form */}
      {open && !submitted && (
        <div className="space-y-4">
          <div>
            <LabelCap className="mb-1.5">{t('supplier.windowCloses')}</LabelCap>
            <div className="font-mono text-xl font-bold tabular-nums text-white">{fmtCountdown(countdown)}</div>
          </div>
          <div>
            <label className="block mb-1.5">
              <LabelCap>{t('supplier.bidLabel')}</LabelCap>
            </label>
            <input
              type="number"
              value={bid}
              onChange={e => setBid(Number(e.target.value))}
              className="w-full bg-ink border border-line rounded-lg px-3 py-2.5 font-mono text-[14px] text-white placeholder-dim focus:outline-none focus:border-indigo-DEFAULT focus:ring-1 focus:ring-indigo-DEFAULT/40 transition-all"
            />
            <div className="mt-1 text-[10.5px] text-dim font-mono">{t('supplier.bidHelp')}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <LabelCap className="mb-1.5">{t('supplier.eta')}</LabelCap>
              <input type="number" value={eta} onChange={e => setEta(Number(e.target.value))}
                className="w-full bg-ink border border-line rounded-lg px-3 py-2 font-mono text-[14px] text-white focus:outline-none focus:border-indigo-DEFAULT focus:ring-1 focus:ring-indigo-DEFAULT/40 transition-all" />
            </div>
            <div>
              <LabelCap className="mb-1.5">{t('supplier.sustain')}</LabelCap>
              <input type="text" value={sustain} onChange={e => setSustain(e.target.value)}
                className="w-full bg-ink border border-line rounded-lg px-3 py-2 font-mono text-[14px] text-white focus:outline-none focus:border-indigo-DEFAULT focus:ring-1 focus:ring-indigo-DEFAULT/40 transition-all" />
            </div>
          </div>
          <button onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-DEFAULT hover:bg-indigo-light text-white font-semibold text-[13px] transition-all duration-200 shadow-glow-indigo">
            <Fingerprint size={16} strokeWidth={2} />
            {t('supplier.submitBtn')}
          </button>
        </div>
      )}

      {/* OPEN: ZK scanning after submit */}
      {open && submitted && (
        <div className="space-y-3">
          <div className="text-[12.5px] text-muted">{t('supplier.sealed.wait')}</div>
          <ZkBadge hash={s.hash} scanning verified={false} />
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-ink/50 border border-line rounded p-2.5">
              <div className="text-dim mb-0.5">{t('supplier.sealed.bid')} <span className="text-[9px]">{t('supplier.sealed.visible')}</span></div>
              <div className="text-indigo-light font-semibold">{fmtUSD(bid)}</div>
            </div>
            <div className="bg-ink/50 border border-line rounded p-2.5">
              <div className="text-dim mb-0.5">{t('supplier.sealed.commit')}</div>
              <div className="text-muted truncate">{s.hash}</div>
            </div>
          </div>
        </div>
      )}

      {/* SEALED */}
      {sealed && (
        <div className="space-y-3">
          <div>
            <div className="text-[13px] font-semibold text-white mb-1">{t('supplier.sealed.title')}</div>
            <ZkBadge hash={s.hash} scanning />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-ink/50 border border-line rounded p-2.5">
              <div className="text-dim mb-0.5">{t('supplier.sealed.bid')} <span className="text-[9px]">{t('supplier.sealed.visible')}</span></div>
              <div className="text-indigo-light font-semibold">{fmtUSD(s.bid)}</div>
            </div>
            <div className="bg-ink/50 border border-line rounded p-2.5">
              <div className="text-dim mb-0.5">{t('supplier.sealed.block')}</div>
              <div className="text-muted">{s.block}</div>
            </div>
          </div>
          <div className="bg-ink/50 border border-line rounded p-2.5 text-[11px] font-mono">
            <div className="text-dim mb-0.5">{t('supplier.sealed.competitors')}</div>
            <div className="text-muted">{t('supplier.sealed.unknown')}</div>
          </div>
        </div>
      )}

      {/* RESOLVED */}
      {resolved && (
        <div className="space-y-3">
          {isWinner ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
              <Award size={18} className="text-success" strokeWidth={2} />
              <div>
                <div className="text-[13px] font-semibold text-success">{t('supplier.awarded')}</div>
                <div className="text-[11px] text-muted font-mono">{fill(t('supplier.resolved.win.sub'), { amount: fmtUSD(s.bid) })}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-line">
              <Lock size={18} className="text-muted" strokeWidth={2} />
              <div>
                <div className="text-[13px] font-semibold text-white">{t('supplier.notAwarded')}</div>
                <div className="text-[11px] text-muted">{t('supplier.resolved.lose.sub')}</div>
              </div>
            </div>
          )}
          <ZkBadge hash={s.hash} verified />
          <div className="bg-ink/50 border border-line rounded p-2.5 text-[11px] font-mono">
            <div className="text-dim mb-1">{t('supplier.resolved.competing')}</div>
            <div className="text-muted">{isWinner ? t('supplier.resolved.winnerOnly') : t('supplier.resolved.competingSealed')}</div>
          </div>
        </div>
      )}
    </Card>
  );
}

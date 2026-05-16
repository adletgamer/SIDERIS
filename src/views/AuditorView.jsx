import React, { useState } from 'react';
import { Eye, EyeOff, ScrollText, ShieldCheck, Download, KeyRound, CircuitBoard } from 'lucide-react';
import { useT, Card, LabelCap, Pill, Hash, ZkBadge } from '../components/ui.jsx';
import { SUPPLIERS, WINNER_ID, AUCTION, fmtUSD } from '../lib/i18n.js';

const LOG_ENTRIES = [
  { key: 'created',   ts: '2026-05-14 09:00 UTC', block: '#1,281,100', event: 'auction created', actor: 'buyer' },
  { key: 'sealed-A',  ts: '2026-05-14 10:22 UTC', block: '#1,284,791', event: 'bid sealed',       actor: 'supplier_A' },
  { key: 'sealed-B',  ts: '2026-05-14 10:31 UTC', block: '#1,284,803', event: 'bid sealed',       actor: 'supplier_B' },
  { key: 'closed',    ts: '2026-05-14 12:00 UTC', block: '#1,285,200', event: 'deadline reached', actor: 'autonomous' },
  { key: 'evaluated', ts: '2026-05-14 12:01 UTC', block: '#1,285,210', event: 'winner = supplier_A', actor: 'compact circuit' },
  { key: 'reveal',    ts: '2026-05-14 13:04 UTC', block: '#1,285,402', event: 'selective reveal', actor: 'auditor' },
  { key: 'signed',    ts: '2026-05-14 13:04 UTC', block: '#1,285,402', event: 'auditor signed',   actor: AUCTION.auditorKey },
];

export function AuditorView({ state }) {
  const { t } = useT();
  const [revealed, setRevealed] = useState({});
  const resolved = state === 'RESOLVED';

  const reveal = (id) => setRevealed(prev => ({ ...prev, [id]: true }));

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div className="space-y-5">
        {/* Identity card */}
        <Card accent accentColor="amber" className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill tone="amber" mono>
                  <KeyRound size={10} strokeWidth={2.5} />
                  {t('auditor.tag')}
                </Pill>
                <span className="text-[11px] text-muted font-mono">{t('auditor.subtag')}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{t('auditor.title')}</h2>
            </div>
            <ZkBadge hash={AUCTION.auditorKey} verified />
          </div>
          <p className="mt-3 text-[13px] text-muted leading-relaxed">{t('auditor.body')}</p>
        </Card>

        {/* Circuit evaluation */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <CircuitBoard size={16} className="text-indigo-light" strokeWidth={1.75} />
            <h3 className="text-[15px] font-semibold text-white">{t('auditor.eval.title')}</h3>
          </div>
          <div className="text-[12px] text-muted mb-4">{t('auditor.eval.sub')}</div>

          <div className={`relative rounded-lg border p-4 font-mono text-[12px] overflow-hidden
            ${resolved ? 'border-success/30 bg-success/5' : state === 'SEALED' ? 'border-indigo-DEFAULT/30 bg-indigo-DEFAULT/5 zk-scan-line' : 'border-line bg-ink/40'}`}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className={resolved ? 'text-success' : state === 'SEALED' ? 'text-indigo-light' : 'text-dim'}>
                {state === 'SEALED' ? t('auditor.eval.running') : resolved ? 'evaluate_auction() · ✓ resolved' : 'evaluate_auction() · queued'}
              </span>
              {state === 'SEALED' && (
                <span className="w-2 h-2 rounded-full bg-indigo-DEFAULT animate-pulse shrink-0" />
              )}
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-dim">{t('auditor.eval.input')}</span>
                <span className="text-muted">supplier_A · supplier_B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">verify_proofs()</span>
                <span className={resolved || state === 'SEALED' ? 'text-success' : 'text-dim'}>{resolved || state === 'SEALED' ? '✓ both valid' : t('auditor.eval.verifyPending')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">winner</span>
                <span className={resolved ? 'text-success font-semibold' : 'text-dim'}>{resolved ? `supplier_${WINNER_ID} · ${fmtUSD(SUPPLIERS.find(s => s.id === WINNER_ID).bid)}` : t('auditor.eval.verifyPending')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Selective reveal */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-amber-light" strokeWidth={1.75} />
            <h3 className="text-[15px] font-semibold text-white">{t('auditor.reveal.title')}</h3>
          </div>
          <div className="text-[12px] text-muted mb-4">{t('auditor.reveal.sub')}</div>
          <div className="space-y-3">
            {SUPPLIERS.map(s => {
              const isRev = revealed[s.id];
              return (
                <div key={s.id} className={`flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border ${isRev ? 'border-amber-DEFAULT/30 bg-amber-DEFAULT/5' : 'border-line bg-ink/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-DEFAULT/10 border border-indigo-DEFAULT/20 flex items-center justify-center font-mono text-[11px] font-semibold text-indigo-light">{s.id}</div>
                    <div>
                      <div className="text-[13px] font-medium text-white">{s.name}</div>
                      <ZkBadge hash={s.hash} verified={state !== 'OPEN'} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isRev && (
                      <div className="font-mono text-[12px]">
                        <span className="text-dim mr-1">bid</span>
                        <span className="text-amber-light font-semibold">{fmtUSD(s.bid)}</span>
                      </div>
                    )}
                    {resolved ? (
                      <button
                        onClick={() => !isRev && reveal(s.id)}
                        disabled={isRev}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${isRev ? 'bg-amber-DEFAULT/10 text-amber-light border border-amber-DEFAULT/30 cursor-default' : 'bg-amber-DEFAULT hover:bg-amber-light text-ink border border-transparent shadow-glow-amber'}`}
                      >
                        {isRev ? <><EyeOff size={13} />{t('auditor.reveal.done')}</> : <><Eye size={13} />{t('auditor.reveal.btn')}</>}
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-dim">{t('auditor.reveal.locked')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right rail */}
      <aside className="space-y-5">
        {/* On-chain log */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ScrollText size={15} className="text-amber-light" strokeWidth={1.75} />
              <LabelCap>{t('auditor.log.title')}</LabelCap>
            </div>
            <Pill tone="amber" mono>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-DEFAULT" />
              {t('auditor.log.immutable')}
            </Pill>
          </div>
          <div className="space-y-0">
            {LOG_ENTRIES.map((entry, i) => (
              <LogEntry key={entry.key} entry={entry} isLast={i === LOG_ENTRIES.length - 1} visible={logEntryVisible(entry.key, state)} />
            ))}
          </div>
        </Card>

        {/* Capabilities */}
        <Card className="p-5">
          <LabelCap className="mb-3">{t('auditor.caps.title')}</LabelCap>
          <ul className="space-y-2.5 text-[12.5px] text-slate-300">
            {['1','2','3','4'].map(n => (
              <li key={n} className="flex gap-2.5">
                <ShieldCheck size={15} className={n === '4' ? 'text-danger shrink-0 mt-0.5' : 'text-success shrink-0 mt-0.5'} strokeWidth={2} />
                {t(`auditor.caps.${n}`)}
              </li>
            ))}
          </ul>
        </Card>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-amber-DEFAULT/40 bg-amber-DEFAULT/5 text-amber-light hover:bg-amber-DEFAULT/15 font-semibold text-[13px] transition-all duration-200">
          <Download size={15} strokeWidth={2} />
          {t('auditor.export')}
        </button>
      </aside>
    </div>
  );
}

function logEntryVisible(key, state) {
  const show = {
    OPEN:     ['created', 'sealed-A'],
    SEALED:   ['created', 'sealed-A', 'sealed-B', 'closed'],
    RESOLVED: ['created', 'sealed-A', 'sealed-B', 'closed', 'evaluated', 'reveal', 'signed'],
  };
  return (show[state] || []).includes(key);
}

function LogEntry({ entry, isLast, visible }) {
  if (!visible) return (
    <div className="flex gap-3 py-2 opacity-20">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-dim mt-1" />
        {!isLast && <div className="w-px flex-1 bg-dim/30 mt-1" />}
      </div>
      <div className="text-[11px] font-mono text-dim pb-2">···</div>
    </div>
  );
  return (
    <div className="flex gap-3 py-2">
      <div className="flex flex-col items-center">
        <div className={`w-2 h-2 rounded-full mt-1 ${entry.key === 'evaluated' ? 'bg-success' : entry.key.startsWith('reveal') || entry.key === 'signed' ? 'bg-amber-DEFAULT' : 'bg-indigo-DEFAULT'}`} />
        {!isLast && <div className="w-px flex-1 bg-line mt-1" />}
      </div>
      <div className="text-[11px] font-mono pb-2">
        <div className="text-white">{entry.event}</div>
        <div className="text-dim mt-0.5">{entry.ts}</div>
        <div className="text-dim">{entry.block} · {entry.actor}</div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link, Gavel, Check, X, TriangleAlert } from 'lucide-react';
import { useT, Card, KPI, LabelCap, LedgerLine, Pill, TelRow, ZkBadge } from '../components/ui.jsx';
import { AUCTION, SUPPLIERS, WINNER_ID, fmtUSD, fmtCountdown, fill } from '../lib/i18n.js';

export function BuyerView({ state, countdown }) {
  const { t } = useT();
  const bidsCount = state === 'OPEN' ? 1 : SUPPLIERS.length;
  const winner    = SUPPLIERS.find(s => s.id === WINNER_ID);
  const finalAmt  = winner.bid;
  const resolved  = state === 'RESOLVED';

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-5">
      <div className="space-y-5">
        <Card accent accentColor="cyan" className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Pill tone="muted" mono>{AUCTION.id}</Pill>
                <Pill tone="muted">{t('auction.subtype')}</Pill>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{t('auction.title')}</h1>
              <div className="mt-1.5 text-[13px] text-muted">{t('auction.category')}</div>
            </div>
            <div className="text-right">
              <LabelCap>{t('auction.buyer.lbl')}</LabelCap>
              <div className="text-[14px] font-semibold mt-0.5 text-white">{t('auction.buyer.name')}</div>
              <div className="text-[11px] font-mono text-muted mt-0.5">{AUCTION.buyerKey}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <KPI label={t('kpi.invited')}   value={AUCTION.invited.toString()} />
            <KPI label={t('kpi.submitted')} value={`${bidsCount} / ${AUCTION.invited}`} accent={state !== 'OPEN'} accentColor="cyan" />
            <KPI label={t('kpi.budget')}    value={fmtUSD(AUCTION.budget)} mono />
            <KPI label={resolved ? t('kpi.final') : t('kpi.budget')} value={resolved ? fmtUSD(finalAmt) : '—'} mono accent={resolved} accentColor="cyan" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Link size={16} className="text-cyan-DEFAULT" />
                <h3 className="text-[15px] font-semibold text-white">{t('ledger.title')}</h3>
              </div>
              <div className="text-[12px] text-muted mt-1">{t('ledger.sub')}</div>
            </div>
            <Pill tone="cyan" mono>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-DEFAULT" />
              {t('ledger.tag')}
            </Pill>
          </div>
          <div className="rounded-lg border border-line bg-ink/60 p-4 space-y-0.5">
            <LedgerLine k="auction_id"         v={AUCTION.id} tone="muted" />
            <LedgerLine k="auction_deadline"   v={state === 'OPEN' ? fmtCountdown(countdown) : '00:00:00'} tone="muted" />
            <LedgerLine k="buyer_public_key"   v={AUCTION.buyerKey} tone="muted" />
            <LedgerLine k="auditor_public_key" v={AUCTION.auditorKey} tone="amber" />
            <LedgerLine k="bids_count"         v={bidsCount.toString()} tone="cyan" highlight={state === 'SEALED'} />
            <LedgerLine k="winner_id"          v={resolved ? `supplier_${WINNER_ID} · ${winner.name}` : `— ${t('ledger.sealed.suffix')}`} tone={resolved ? 'success' : 'muted'} />
            <LedgerLine k="final_price"        v={resolved ? fmtUSD(finalAmt) + ' USD' : `— ${t('ledger.sealed.suffix')}`} tone={resolved ? 'success' : 'muted'} />
            <LedgerLine k="losing_margins"     v={resolved ? `⊘ ${t('ledger.never')}` : `— ${t('ledger.sealed.suffix')}`} tone="amber" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Gavel size={16} className="text-indigo-light" />
                <h3 className="text-[15px] font-semibold text-white">{t('sealed.title')}</h3>
              </div>
              <div className="text-[12px] text-muted mt-1">{t('sealed.sub')}</div>
            </div>
            {state === 'SEALED' && (
              <span className="text-[11px] font-mono text-indigo-light flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-DEFAULT animate-pulse" />
                {t('sealed.awaiting')}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {SUPPLIERS.map((s, i) => <SealedBidRow key={s.id} supplier={s} state={state} index={i} />)}
            {state === 'OPEN' && Array.from({ length: AUCTION.invited - 1 }).map((_, i) => (
              <div key={'p' + i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-dashed border-line text-dim text-[12.5px] font-mono">
                <span>{fill(t('sealed.pendingSupplier'), { id: String.fromCharCode(67 + i) })}</span>
                <span className="text-[10px]">{t('sealed.noProof')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <LabelCap className="mb-3">{t('telemetry.title')}</LabelCap>
          <TelRow k="contract" v="sideris_bid.compact" tone="muted" />
          <TelRow k="submit_bid()" v="circuit" tone={state !== 'OPEN' ? 'success' : 'muted'} status={state !== 'OPEN' ? t('tel.accepted') : t('tel.awaiting')} />
          <TelRow k="evaluate_auction()" v="circuit" tone={resolved ? 'success' : state === 'SEALED' ? 'indigo' : 'muted'} status={resolved ? t('tel.resolved') : state === 'SEALED' ? t('tel.running') : t('tel.queued')} />
          <TelRow k="selective_reveal()" v="circuit" tone={resolved ? 'amber' : 'muted'} status={resolved ? t('tel.available') : t('tel.locked')} />
        </Card>
        <Card className="p-5">
          <LabelCap className="mb-3">{t('buyer.canDo')}</LabelCap>
          <ul className="space-y-2.5 text-[12.5px] text-slate-300">
            <li className="flex gap-2.5"><Check size={16} className="text-success shrink-0 mt-0.5" strokeWidth={2.2} />{t('buyer.can.1')}</li>
            <li className="flex gap-2.5"><Check size={16} className="text-success shrink-0 mt-0.5" strokeWidth={2.2} />{t('buyer.can.2')}</li>
            <li className="flex gap-2.5"><X     size={16} className="text-danger  shrink-0 mt-0.5" strokeWidth={2.2} />{t('buyer.cant.1')}</li>
            <li className="flex gap-2.5"><X     size={16} className="text-danger  shrink-0 mt-0.5" strokeWidth={2.2} />{t('buyer.cant.2')}</li>
          </ul>
        </Card>
        <Card className="p-5 border-amber-DEFAULT/30 bg-amber-DEFAULT/5">
          <div className="flex items-center gap-2 mb-2">
            <TriangleAlert size={16} className="text-amber-light" strokeWidth={2} />
            <LabelCap className="text-amber-light">{t('compliance.label')}</LabelCap>
          </div>
          <p className="text-[12.5px] text-slate-300 leading-relaxed">{t('compliance.body')}</p>
        </Card>
      </aside>
    </div>
  );
}

function SealedBidRow({ supplier: s, state, index }) {
  const { t } = useT();
  const isWinner = s.id === WINNER_ID;
  const resolved = state === 'RESOLVED';
  const sealed   = state === 'SEALED';
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg border ${resolved && isWinner ? 'border-success/40 bg-success/5' : 'border-line bg-ink/30'}`}>
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-indigo-DEFAULT/10 border border-indigo-DEFAULT/20 flex items-center justify-center font-mono text-[11px] font-semibold text-indigo-light">{s.id}</span>
        <div>
          <div className="text-[13px] font-medium text-white">supplier_{s.id}</div>
          <ZkBadge hash={s.hash} verified={state !== 'OPEN'} scanning={sealed} />
        </div>
      </div>
      {resolved && isWinner
        ? <Pill tone="success">{t('sealed.winner')}</Pill>
        : sealed
        ? <span className="text-[11px] font-mono text-indigo-light">{t('sealed.awaiting')}</span>
        : state === 'OPEN' && index === 0
        ? <ZkBadge hash={s.hash} verified={false} />
        : null}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { LangCtx } from './components/ui.jsx';
import { GovernanceBar } from './components/GovernanceBar.jsx';
import { DemoControls } from './components/DemoControls.jsx';
import { BuyerView }    from './views/BuyerView.jsx';
import { SupplierView } from './views/SupplierView.jsx';
import { AuditorView }  from './views/AuditorView.jsx';
import { I18N } from './lib/i18n.js';

const INITIAL_COUNTDOWN = 2 * 3600 + 14 * 60 + 36; // 02:14:36

export default function App() {
  const [lang, setLang]       = useState('en');
  const [role, setRole]       = useState('buyer');
  const [state, setState]     = useState('OPEN');
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);

  // Tick countdown when auction is OPEN
  useEffect(() => {
    if (state !== 'OPEN') return;
    if (countdown <= 0) { setState('SEALED'); return; }
    const id = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [state, countdown]);

  // Reset countdown when going back to OPEN
  useEffect(() => {
    if (state === 'OPEN') setCountdown(INITIAL_COUNTDOWN);
  }, [state]);

  const dict = I18N[lang];
  const t = (k) => dict[k] ?? I18N.en[k] ?? k;
  const toggle = () => setLang(l => l === 'en' ? 'es' : 'en');
  const langCtx = useMemo(() => ({ lang, t, toggle }), [lang]);

  return (
    <LangCtx.Provider value={langCtx}>
      <div className="min-h-screen bg-ink text-fg font-sans">
        <GovernanceBar role={role} setRole={setRole} state={state} />

        <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 space-y-5">
          <DemoControls state={state} setState={setState} countdown={countdown} />

          {role === 'buyer'    && <BuyerView    state={state} countdown={countdown} />}
          {role === 'supplier' && <SupplierView state={state} countdown={countdown} />}
          {role === 'auditor'  && <AuditorView  state={state} />}
        </main>

        <footer className="border-t border-line mt-8 py-5">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-DEFAULT to-indigo-DEFAULT flex items-center justify-center">
                <span className="text-white font-bold text-[8px]">S</span>
              </div>
              <span className="text-[11px] font-mono text-dim tracking-widest">SIDERIS · Midnight Mainnet</span>
            </div>
            <span className="text-[11px] font-mono text-dim">{t('footer.mock')}</span>
          </div>
        </footer>
      </div>
    </LangCtx.Provider>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

// Each field knows which context(s) it belongs to. `id` is shared by all three.
type Ctx = 'billing' | 'shipping' | 'support';

interface Field {
  name: string;
  ctx: Ctx[];
}

const FIELDS: Field[] = [
  { name: 'id', ctx: ['billing', 'shipping', 'support'] },
  { name: 'items', ctx: ['billing', 'shipping'] },
  { name: 'total', ctx: ['billing'] },
  { name: 'tax', ctx: ['billing'] },
  { name: 'discount', ctx: ['billing'] },
  { name: 'paymentMethod', ctx: ['billing'] },
  { name: 'invoiceNumber', ctx: ['billing'] },
  { name: 'shippingAddress', ctx: ['shipping'] },
  { name: 'trackingNumber', ctx: ['shipping'] },
  { name: 'status', ctx: ['support'] },
  { name: 'cancellationReason', ctx: ['support'] },
];

const CONTEXTS: { key: Ctx; label: string; team: string; color: string; ring: string; text: string; bg: string }[] = [
  {
    key: 'billing',
    label: 'Billing',
    team: 'finance team',
    color: '#10b981',
    ring: 'border-emerald-500/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
  },
  {
    key: 'shipping',
    label: 'Shipping',
    team: 'logistics team',
    color: '#6366f1',
    ring: 'border-indigo-500/50',
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/5 dark:bg-indigo-500/10',
  },
  {
    key: 'support',
    label: 'Customer Support',
    team: 'support team',
    color: '#f59e0b',
    ring: 'border-amber-500/50',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/5 dark:bg-amber-500/10',
  },
];

function FieldChip({ name, shared, dim }: { name: string; shared?: boolean; dim?: boolean }) {
  return (
    <span
      className={cn(
        'inline-block rounded-md border px-2 py-0.5 font-mono text-[11px] leading-tight transition-all duration-500 ease-in-out',
        shared
          ? 'border-slate-400/60 bg-slate-100 text-slate-700 dark:border-slate-500/60 dark:bg-slate-800 dark:text-slate-200 font-semibold'
          : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300',
        dim ? 'opacity-30' : 'opacity-100',
      )}
    >
      {name}
    </span>
  );
}

export default function BoundedContexts() {
  // step 0 = monolith Order, step 1 = split into three contexts,
  // step 2 = highlight that a change to one context is isolated.
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const el = ref.current;
    if (!el) return;

    let timers: ReturnType<typeof setTimeout>[] = [];

    const runLoop = () => {
      // clear any pending
      timers.forEach(clearTimeout);
      timers = [];
      const cycle = () => {
        setStep(0);
        timers.push(setTimeout(() => setStep(1), 1600));
        timers.push(setTimeout(() => setStep(2), 4200));
        timers.push(setTimeout(cycle, 7600));
      };
      cycle();
    };

    if (mq.matches) {
      // Reduced motion: jump straight to the split, no looping.
      setStep(1);
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        const e = entries[0];
        if (e && e.isIntersecting) {
          runLoop();
        } else {
          timers.forEach(clearTimeout);
          timers = [];
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const split = step >= 1;
  // In step 2 we pretend Billing gets a new field; only Billing "lights up".
  const changing: Ctx | null = step >= 2 ? 'billing' : null;

  return (
    <div className="my-8 md:my-12">
      <div
        ref={ref}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm"
      >
        {/* Step caption / legend */}
        <div className="mb-4 flex items-center justify-center gap-2 text-center">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-500 ease-in-out',
              split
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
            )}
          >
            {!split
              ? 'One shared Order — every team couples to it'
              : changing
                ? 'Billing adds a field — Shipping & Support untouched'
                : 'Three bounded contexts — each owns its own Order'}
          </span>
        </div>

        {/* The monolith card */}
        <div
          className={cn(
            'mx-auto overflow-hidden transition-all duration-700 ease-in-out',
            split ? 'max-h-0 opacity-0 -translate-y-2' : 'max-h-[400px] opacity-100',
          )}
          aria-hidden={split}
        >
          <div className="mx-auto max-w-md rounded-lg border border-rose-400/50 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20 p-4">
            <div className="mb-3 text-center text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">Order</div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {FIELDS.map(f => (
                <FieldChip key={f.name} name={f.name} shared={f.name === 'id'} />
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] italic text-slate-500 dark:text-slate-400">
              Marketing, warehouse, finance, and support all change this one type.
            </p>
          </div>
        </div>

        {/* The three context cards */}
        <div
          className={cn(
            'transition-all duration-700 ease-in-out',
            split ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden',
          )}
          aria-hidden={!split}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {CONTEXTS.map((c, idx) => {
              const isChanging = changing === c.key;
              const isDimmed = changing != null && changing !== c.key;
              const ctxFields = FIELDS.filter(f => f.ctx.includes(c.key));
              return (
                <div
                  key={c.key}
                  className={cn(
                    'relative rounded-lg border p-4 transition-all duration-500 ease-in-out',
                    c.ring,
                    c.bg,
                    isDimmed ? 'opacity-50' : 'opacity-100',
                    isChanging && 'ring-1 ring-emerald-400/70 dark:ring-emerald-400/60',
                  )}
                  style={{ transitionDelay: split ? `${idx * 120}ms` : '0ms' }}
                >
                  {/* "change isolated here" badge */}
                  {isChanging && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      + new field here only
                    </span>
                  )}
                  <div className={cn('mb-1 text-center text-sm font-bold', c.text)}>{c.label}</div>
                  <div className="mb-3 text-center text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {c.team}
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {ctxFields.map(f => (
                      <FieldChip key={c.key + f.name} name={f.name} shared={f.name === 'id'} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shared id connector note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span>
              All three share only{' '}
              <code className="font-mono font-semibold text-slate-700 dark:text-slate-200">id</code> for
              cross-referencing — nothing else.
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm italic text-slate-500 dark:text-slate-400">
        {reduced
          ? 'One bloated Order type split into three bounded contexts — Billing, Shipping, and Customer Support — each owning only the fields it needs, sharing just the id.'
          : 'A single shared Order, coupled to every team, splits into three bounded contexts that share only id — so a change in Billing leaves Shipping and Customer Support untouched.'}
      </p>
    </div>
  );
}

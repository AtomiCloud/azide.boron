import React from 'react';

export default function TriageSpecPlan() {
  // Three boxes narrowing left -> right: Interrogation -> Declaration -> Decomposition.
  const stages = [
    {
      key: 'triage',
      kicker: 'Triage',
      title: 'Interrogation',
      blurb: 'Surface and fact-check every assumption, gap and risk against the actual code.',
      width: 'md:w-full',
      color: 'border-indigo-300 dark:border-indigo-700',
      dot: 'bg-indigo-500',
    },
    {
      key: 'spec',
      kicker: 'Spec',
      title: 'Declaration',
      blurb: 'Declare what "done" means — a Definition of Done. Behaviour, not code.',
      width: 'md:w-[82%]',
      color: 'border-violet-300 dark:border-violet-700',
      dot: 'bg-violet-500',
    },
    {
      key: 'plan',
      kicker: 'Plan',
      title: 'Decomposition',
      blurb: 'Break it into committable, independently verifiable file-level slices.',
      width: 'md:w-[64%]',
      color: 'border-emerald-300 dark:border-emerald-700',
      dot: 'bg-emerald-500',
    },
  ];

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3 md:gap-2">
          {stages.map((s, i) => (
            <React.Fragment key={s.key}>
              <div
                className={`w-full ${s.width} rounded-lg border ${s.color} bg-slate-50 p-3 dark:bg-slate-950/40 md:p-4`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.dot}`} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {s.kicker}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{s.title}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-600 dark:text-slate-300">{s.blurb}</p>
              </div>
              {i < stages.length - 1 && (
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                  &#8595;
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="mt-5 text-center text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">
          Front-load the thinking, then narrow: from open questions, to a definition of done, to verifiable slices.
        </p>
      </div>
    </div>
  );
}

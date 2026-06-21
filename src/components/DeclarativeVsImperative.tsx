import React from 'react';

export default function DeclarativeVsImperative() {
  // Left: a noisy chat of corrections that drifts with every message.
  // Right: a small, stable goal.md that does not move.
  const chat = [
    { who: 'you', text: 'Add a soft-delete endpoint for orders.' },
    { who: 'ai', text: 'Done — added DELETE /orders/:id.' },
    { who: 'you', text: 'No, soft delete. Set deleted_at, do not remove the row.' },
    { who: 'ai', text: 'Updated. Removed the hard delete.' },
    { who: 'you', text: 'It still 404s deleted orders on GET. Keep them, just flag them.' },
    { who: 'ai', text: 'Fixed the filter.' },
    { who: 'you', text: 'A test broke. The list endpoint now shows deleted rows.' },
  ];

  return (
    <div className="my-8 md:my-12">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {/* LEFT — imperative chat, noisy */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Imperative chat
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] rounded-lg px-3 py-1.5 text-[13px] leading-snug ${
                    m.who === 'you'
                      ? 'self-end bg-indigo-500/10 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200'
                      : 'self-start bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
              Each turn steers off your <em>last</em> sentence. The target drifts.
            </p>
          </div>

          {/* RIGHT — declarative goal.md, stable */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Declarative goal.md
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
              <div className="border-b border-slate-200 px-3 py-1.5 font-mono text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                goal.md
              </div>
              <pre className="overflow-x-auto p-3 text-[12.5px] leading-relaxed text-slate-700 dark:text-slate-200">
                <code>{`# Goal: orders support soft delete

End state:
- DELETE /orders/:id sets deleted_at,
  keeps the row.
- GET /orders/:id returns deleted orders
  with a deleted flag.
- GET /orders (list) excludes deleted
  rows by default.
- All existing tests pass.`}</code>
              </pre>
            </div>
            <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
              One end state. Re-read fresh every loop. It does not move.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-sm italic leading-relaxed text-slate-500 dark:text-slate-400">
          The goal does not move.
        </p>
      </div>
    </div>
  );
}

import React from 'react';

interface Bubble {
  who: 'you' | 'ai';
  text: string;
}

const chat: Bubble[] = [
  { who: 'you', text: 'Rename the user table to accounts.' },
  { who: 'ai', text: 'Done — updated the migration and the model.' },
  { who: 'you', text: 'Now add an email column.' },
];

interface SentLine {
  label: string;
  detail: string;
  tone: 'system' | 'history' | 'new';
}

const sent: SentLine[] = [
  { label: 'System prompt', detail: 'hidden instructions, tools, persona', tone: 'system' },
  { label: 'Memory / files', detail: 'CLAUDE.md, attached context', tone: 'system' },
  { label: 'Turn 1 — you', detail: 'Rename the user table to accounts.', tone: 'history' },
  { label: 'Turn 1 — model', detail: 'Done — updated the migration…', tone: 'history' },
  { label: 'Turn 2 — you (new)', detail: 'Now add an email column.', tone: 'new' },
];

export default function ChatVsApi() {
  return (
    <div className="my-8">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* What you see */}
          <div className="flex flex-col">
            <div className="mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              What you see
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
              {chat.map((b, i) => (
                <div key={i} className={b.who === 'you' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm ' +
                      (b.who === 'you'
                        ? 'rounded-br-sm bg-indigo-500 text-white'
                        : 'rounded-bl-sm bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100')
                    }
                  >
                    {b.text}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">A tidy back-and-forth. Feels like memory.</p>
          </div>

          {/* What's actually sent */}
          <div className="flex flex-col">
            <div className="mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              What's actually sent (every turn)
            </div>
            <div className="flex flex-1 flex-col gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-3">
              {sent.map((s, i) => (
                <div
                  key={i}
                  className={
                    'rounded-md border px-2.5 py-1.5 ' +
                    (s.tone === 'system'
                      ? 'border-amber-500/40 bg-amber-500/10'
                      : s.tone === 'new'
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-slate-300/60 bg-white dark:border-slate-700 dark:bg-slate-900')
                  }
                >
                  <div
                    className={
                      'text-[11px] font-bold ' +
                      (s.tone === 'system'
                        ? 'text-amber-600 dark:text-amber-400'
                        : s.tone === 'new'
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-slate-700 dark:text-slate-200')
                    }
                  >
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.detail}</div>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-slate-400 dark:text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </div>
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Response</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">one fresh output, then discarded</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              The whole transcript is re-sent and re-read from scratch.
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm italic text-slate-500 dark:text-slate-400">
          The chat window is a view. Under the hood, each turn re-sends everything — the model keeps no memory between
          calls.
        </p>
      </div>
    </div>
  );
}

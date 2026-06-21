import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 or 3
}

interface Props {
  items: TocItem[];
  variant?: 'sidebar' | 'mobile';
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? '');
  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const offset = 140; // account for sticky header
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids.join('|')]);
  return active;
}

function scrollToId(e: React.MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${id}`);
}

/**
 * Article table of contents (sidebar on desktop, collapsible on mobile).
 * Used by BlogPostLayout.astro; knip can't trace `.astro` template usage,
 * so it's tagged public to avoid a false unused-export report.
 * @public
 */
export default function ArticleToc({ items, variant = 'sidebar' }: Props) {
  const active = useActiveHeading(items.map(i => i.id));
  if (!items.length) return null;

  const list = (
    <ul className="space-y-0.5">
      {items.map(item => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={e => scrollToId(e, item.id)}
              className={[
                'group flex items-start gap-2 rounded-md py-1.5 text-sm leading-snug transition-colors',
                item.level === 3 ? 'pl-5' : 'pl-3',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <span
                className={[
                  'mt-[0.45rem] h-px w-3 shrink-0 transition-all',
                  isActive ? 'bg-primary w-4' : 'bg-border group-hover:bg-muted-foreground',
                ].join(' ')}
              />
              <span className="text-pretty">{item.text}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === 'mobile') {
    return (
      <details className="group lg:hidden mb-8 rounded-xl border border-border bg-card/60">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">On this page</span>
          <svg
            className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <nav className="border-t border-border px-3 pb-3 pt-2">{list}</nav>
      </details>
    );
  }

  return (
    <nav aria-label="Table of contents" className="text-[0.9rem]">
      <p className="mb-3 pl-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">On this page</p>
      {list}
    </nav>
  );
}

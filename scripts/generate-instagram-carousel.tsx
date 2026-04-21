import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import type { FontWeight } from 'satori';
import sharp from 'sharp';

// ── Color palette (Okabe-Ito safe for color vision deficiency) ──
const C = {
  bg: '#f5f3ee',
  text: '#1d1d1f',
  sub: '#515154',
  muted: '#86868b',
  white: '#ffffff',
  blue: '#0072b2',
  orange: '#d55e00',
  green: '#009e73',
  amber: '#e69f00',
};

// ── Emoji Loading (Twemoji SVG → base64 data URI) ──
const emojiCache = new Map<string, string>();

async function loadEmoji(emoji: string): Promise<string> {
  if (emojiCache.has(emoji)) return emojiCache.get(emoji)!;
  const cp = emoji.codePointAt(0)!.toString(16);
  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch emoji ${emoji}: ${res.status}`);
  const svg = await res.text();
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  emojiCache.set(emoji, dataUri);
  return dataUri;
}

type EmojiPos = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function emojiBackdrop(src: string, pos: EmojiPos, size: number = 180, opacity: number = 0.07) {
  const map: Record<EmojiPos, Record<string, string>> = {
    'top-left': { left: '40px', top: '80px' },
    'top-right': { right: '40px', top: '80px' },
    'bottom-left': { left: '40px', bottom: '40px' },
    'bottom-right': { right: '40px', bottom: '40px' },
  };
  return <img src={src} width={size} height={size} style={{ position: 'absolute', ...map[pos], opacity }} />;
}

function emojiInline(src: string, size: number = 44) {
  return <img src={src} width={size} height={size} style={{ display: 'flex', flexShrink: 0 }} />;
}

// ── Decorative Shapes ──

function decorDiamond(x: number, y: number, size: number, color: string, opacity: number = 0.06) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        transform: 'rotate(45deg)',
        borderRadius: size * 0.1,
      }}
    />
  );
}

function decorCircle(x: number, y: number, size: number, color: string, opacity: number = 0.05) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        borderRadius: size / 2,
      }}
    />
  );
}

function decorPlus(x: number, y: number, size: number, color: string, opacity: number = 0.07) {
  const t = Math.max(2, size * 0.15);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, opacity, display: 'flex' }}>
      <div
        style={{ position: 'absolute', left: size / 2 - t / 2, top: 0, width: t, height: size, backgroundColor: color }}
      />
      <div
        style={{ position: 'absolute', left: 0, top: size / 2 - t / 2, width: size, height: t, backgroundColor: color }}
      />
    </div>
  );
}

// ── Font Loading ──
const FONT_URLS: Record<string, string> = {
  'Outfit:400': 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4E.ttf',
  'Outfit:600': 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e6yC4E.ttf',
  'Outfit:700': 'https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4E.ttf',
  'Plus Jakarta Sans:700':
    'https://fonts.gstatic.com/s/plusjakartasans/v12/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_TknNSg.ttf',
};

async function loadFont(font: string, weight: number) {
  const key = `${font}:${weight}`;
  const url = FONT_URLS[key];
  if (!url) throw new Error(`No font URL for ${key}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font ${key}: ${res.status}`);
  return await res.arrayBuffer();
}

// ── Shared Components ──

function brandBar(num: string, total: string) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 56px',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '3px',
          color: C.muted,
          fontFamily: 'Outfit',
        }}
      >
        ATOMICLOUD
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: '2px',
          color: C.muted,
          fontFamily: 'Outfit',
        }}
      >
        {num} / {total}
      </div>
    </div>
  );
}

function sectionLabel(text: string) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          display: 'flex',
          fontSize: '26px',
          fontWeight: 600,
          letterSpacing: '6px',
          color: C.blue,
          fontFamily: 'Outfit',
        }}
      >
        {text}
      </div>
      <div style={{ display: 'flex', width: '48px', height: '2px', backgroundColor: C.blue }} />
    </div>
  );
}

function rule(w: string = '32px', color: string = C.muted, mb: string = '20px') {
  return <div style={{ display: 'flex', width: w, height: '2px', backgroundColor: color, marginBottom: mb }} />;
}

// ── Diagram: Implicit vs Explicit code comparison ──

function implicitExplicitDiagram() {
  function codeColumn(
    label: string,
    deps: { name: string; visible: boolean }[],
    sigColor: string,
    borderColor: string,
    tagText: string,
    tagColor: string,
  ) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            borderRadius: 12,
            border: '3px solid ' + borderColor,
            backgroundColor: C.white,
            padding: '14px 24px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '24px', fontWeight: 600, color: sigColor, fontFamily: 'Outfit' }}>
            {label}
          </div>
        </div>
        <div style={{ display: 'flex', width: 3, height: 20, backgroundColor: C.muted + '40' }} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
          {deps.map(d => (
            <div
              style={{
                display: 'flex',
                borderRadius: 10,
                border: '2px solid ' + (d.visible ? C.green + '50' : C.orange + '50'),
                backgroundColor: d.visible ? C.green + '10' : C.orange + '10',
                padding: '10px 18px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: d.visible ? C.green : C.orange,
                  fontFamily: 'Outfit',
                }}
              >
                {d.name}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: '20px', fontWeight: 600, color: tagColor, fontFamily: 'Outfit' }}>
          {tagText}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', gap: '48px', justifyContent: 'center', alignItems: 'flex-start' }}
    >
      {codeColumn(
        'processOrder(order)',
        [
          { name: 'Logger', visible: false },
          { name: 'Database', visible: false },
        ],
        C.orange,
        C.orange + '40',
        "Can't see dependencies",
        C.orange,
      )}
      {codeColumn(
        'OrderService(repo, logger)',
        [
          { name: 'repo', visible: true },
          { name: 'logger', visible: true },
        ],
        C.green,
        C.green + '40',
        'Everything visible',
        C.green,
      )}
    </div>
  );
}

// ── Diagram: Quadrant (3 combinations, not 4) ──

function quadrantDiagram() {
  function cell(
    title: string,
    subtitle: string,
    bgColor: string,
    borderColor: string,
    textColor: string,
    crossed: boolean,
  ) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 12,
          border: '2px solid ' + borderColor,
          backgroundColor: bgColor,
          padding: '14px 16px',
          gap: '6px',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '190px',
          height: '120px',
        }}
      >
        {crossed ? (
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '240px',
              height: '4px',
              backgroundColor: C.orange,
              marginLeft: '-120px',
              marginTop: '-2px',
              transform: 'rotate(-20deg)',
            }}
          />
        ) : (
          ''
        )}
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            fontWeight: 700,
            color: textColor,
            fontFamily: 'Outfit',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '17px',
            fontWeight: 400,
            color: C.sub,
            fontFamily: 'Outfit',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: '120px' }} />
        <div style={{ display: 'flex', width: '190px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.orange, fontFamily: 'Outfit' }}>
            FIXED
          </div>
        </div>
        <div style={{ display: 'flex', width: '190px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.green, fontFamily: 'Outfit' }}>
            FLEXIBLE
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: '120px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: '20px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}>
            IMPLICIT
          </div>
        </div>
        {cell('Worst case', 'Hidden + locked in', C.orange + '10', C.orange + '40', C.orange, false)}
        {cell('Dangerous', 'Hidden + swappable', C.amber + '10', C.amber + '40', C.amber, false)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', width: '120px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: '20px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}>
            EXPLICIT
          </div>
        </div>
        {cell('Impossible', 'Cannot exist', C.muted + '08', C.muted + '30', C.muted, true)}
        {cell('The Goal', 'Visible + swappable', C.green + '10', C.green + '40', C.green, false)}
      </div>
    </div>
  );
}

// ── Diagram: Fixed vs Flexible ──

function fixedVsFlexibleDiagram() {
  function column(title: string, subtitleLines: string[], code: string[], color: string) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 600, color, fontFamily: 'Outfit' }}>{title}</div>
        <div
          style={{
            display: 'flex',
            borderRadius: 12,
            border: '2px solid ' + color + '40',
            backgroundColor: color + '08',
            padding: '20px 24px',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {code.map(line => (
            <div style={{ display: 'flex', fontSize: '20px', fontWeight: 400, color: C.text, fontFamily: 'Outfit' }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          {subtitleLines.map(line => (
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 400,
                color: C.sub,
                fontFamily: 'Outfit',
                textAlign: 'center',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '36px', justifyContent: 'center' }}>
      {column(
        'Fixed',
        ['Hardcoded. Locked in.', 'Nothing can change it.'],
        ['new TaxCalculator()', '// always this one'],
        C.orange,
      )}
      {column(
        'Flexible',
        ['Received. Swappable.', 'The caller decides.'],
        ['con\u200Bstructor(taxCalc)', '// pass anything'],
        C.green,
      )}
    </div>
  );
}

// ── Slide Renderer ──

const EK = {
  eye: '\u{1F441}',
  link: '\u{1F517}',
  mag: '\u{1F50D}',
  warning: '\u{26A0}',
  check: '\u{2705}',
  wrench: '\u{1F527}',
  chart: '\u{1F4CA}',
  x: '\u{274C}',
  fire: '\u{1F525}',
  arrow: '\u{27A1}',
  bulb: '\u{1F4A1}',
  bookmark: '\u{1F516}',
  bell: '\u{1F514}',
  speech: '\u{1F4AC}',
  target: '\u{1F3AF}',
  lock: '\u{1F512}',
  scale: '\u2696',
} as const;

function renderSlide(i: number, total: number, emojis: Record<string, string>) {
  const E = (k: string) => emojis[k]!;
  const num = (i + 1).toString();

  // SLIDE 1: HOOK — eye backdrop
  if (i === 0) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.eye), 'top-right', 200, 0.5)}
        {decorDiamond(60, 180, 22, C.blue, 0.06)}
        {decorCircle(960, 960, 36, C.orange, 0.05)}
        {decorPlus(900, 200, 20, C.muted, 0.07)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '26px',
              fontWeight: 600,
              color: C.muted,
              letterSpacing: '4px',
              marginBottom: '40px',
              fontFamily: 'Outfit',
            }}
          >
            PART 2 OF 8
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '58px',
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.1,
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '920px',
            }}
          >
            There's code inside your function you can't see.
          </div>
          {rule('56px', C.blue, '36px')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: '30px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
              Not hidden on purpose.
            </div>
            <div style={{ display: 'flex', fontSize: '30px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
              Not because someone was careless.
            </div>
            <div style={{ display: 'flex', fontSize: '30px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
              It's how most code is written.
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '24px',
            }}
          >
            There's a framework to understand why.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 2: CONTEXT — Two Dimensions
  if (i === 1) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.link), 'top-right', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.blue, 0.06)}
        {decorCircle(80, 900, 36, C.green, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE FRAMEWORK')}
          <div
            style={{
              display: 'flex',
              fontSize: '50px',
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '920px',
              marginBottom: '8px',
            }}
          >
            Every dependency has two properties
          </div>
          {rule('56px', C.blue, '36px')}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: C.blue + '18', borderRadius: 12, padding: '12px 32px' }}>
                <div
                  style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: C.blue, fontFamily: 'Outfit' }}
                >
                  Explicitness
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                Can you see it?
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: C.green + '18', borderRadius: 12, padding: '12px 32px' }}>
                <div
                  style={{ display: 'flex', fontSize: '36px', fontWeight: 700, color: C.green, fontFamily: 'Outfit' }}
                >
                  Flexibility
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                Can you change it?
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
            }}
          >
            Together, they determine whether your code is solid or fragile.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            Let's zoom into the first one.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 3: EXPLICITNESS — visual comparison
  if (i === 2) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.mag), 'bottom-right', 180, 0.5)}
        {decorDiamond(60, 200, 22, C.orange, 0.06)}
        {decorCircle(940, 920, 32, C.blue, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 48px',
          }}
        >
          {sectionLabel('EXPLICITNESS')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.blue,
              lineHeight: 1.15,
              marginBottom: '24px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Can you see it?
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.5,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: '36px',
            }}
          >
            Is the dependency declared in the interface, or buried inside the implementation?
          </div>
          {implicitExplicitDiagram()}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '24px',
            }}
          >
            So what's the cost of hiding things?
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 4: LOCALITY
  if (i === 3) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.target), 'bottom-left', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.blue, 0.06)}
        {decorCircle(80, 900, 30, C.green, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('WHY IT MATTERS')}
          <div
            style={{
              display: 'flex',
              fontSize: '46px',
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: '28px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            Explicitness creates locality
          </div>
          {rule('56px', C.blue, '32px')}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', maxWidth: '860px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  1
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{ display: 'flex', fontSize: '28px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}
                >
                  From the outside in
                </div>
                <div style={{ display: 'flex', fontSize: '26px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                  Read the con{'\u200B'}structor. Know everything it needs.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  2
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  style={{ display: 'flex', fontSize: '28px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}
                >
                  From the inside out
                </div>
                <div style={{ display: 'flex', fontSize: '26px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                  All dependencies declared. Understand in isolation.
                </div>
              </div>
            </div>
          </div>
          {rule('56px', C.blue, '28px')}
          <div
            style={{
              display: 'flex',
              borderRadius: 14,
              border: '3px solid ' + C.blue + '40',
              backgroundColor: C.blue + '08',
              padding: '20px 36px',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 400,
                color: C.sub,
                fontFamily: 'Outfit',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              The first protects the person
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 600,
                color: C.blue,
                fontFamily: 'Outfit',
                justifyContent: 'center',
              }}
            >
              using the code.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 400,
                color: C.sub,
                fontFamily: 'Outfit',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              The second protects the person
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 600,
                color: C.blue,
                fontFamily: 'Outfit',
                justifyContent: 'center',
              }}
            >
              reading the code.
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            Together, they are what locality looks like.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 5: IMPLICIT DEEP DIVE
  if (i === 4) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.warning), 'top-left', 180, 0.5)}
        {decorDiamond(900, 180, 20, C.orange, 0.06)}
        {decorCircle(80, 900, 30, C.blue, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE PROBLEM')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.orange,
              lineHeight: 1.15,
              marginBottom: '32px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Implicit dependencies
          </div>
          <div
            style={{
              display: 'flex',
              borderRadius: 14,
              border: '3px solid ' + C.orange + '30',
              backgroundColor: C.orange + '08',
              padding: '28px 36px',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}>
              processOrder(order)
            </div>
            <div style={{ display: 'flex', width: '100%', height: '2px', backgroundColor: C.muted + '20' }} />
            <div
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', fontSize: '24px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                Logger.log("Processing")
              </div>
              <div
                style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.orange, fontFamily: 'Outfit' }}
              >
                hidden
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', fontSize: '24px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
                Database.query(...)
              </div>
              <div
                style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.orange, fontFamily: 'Outfit' }}
              >
                hidden
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.5,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            The signature says one thing. The code does another.
          </div>
          {rule('32px', C.orange, '20px')}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.55,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
            }}
          >
            You discover hidden dependencies when something breaks. Not when you read the code.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            But visibility alone isn't enough.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 6: FLEXIBILITY
  if (i === 5) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.wrench), 'top-right', 180, 0.5)}
        {decorDiamond(60, 200, 22, C.green, 0.06)}
        {decorCircle(940, 920, 32, C.orange, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 48px',
          }}
        >
          {sectionLabel('FLEXIBILITY')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.green,
              lineHeight: 1.15,
              marginBottom: '28px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Can you change it?
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.5,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: '36px',
            }}
          >
            Can you swap the dependency from outside, or is it locked in?
          </div>
          {fixedVsFlexibleDiagram()}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '24px',
            }}
          >
            Now put both dimensions together.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 7: IMMUTABLE SINGLETON
  if (i === 6) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.lock), 'top-right', 180, 0.5)}
        {decorDiamond(60, 200, 22, C.amber, 0.06)}
        {decorCircle(940, 920, 32, C.orange, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('A SUBTLER FORM')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.amber,
              lineHeight: 1.15,
              marginBottom: '24px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            The immutable singleton
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.55,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: '28px',
            }}
          >
            Not all fixed dependencies use new. Some use globals that look safe.
          </div>
          <div
            style={{
              display: 'flex',
              borderRadius: 14,
              border: '3px solid ' + C.amber + '30',
              backgroundColor: C.amber + '08',
              padding: '24px 36px',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 600, color: C.text, fontFamily: 'Outfit' }}>
              Global.TaxCalculator = new USTaxCalculator()
            </div>
            <div style={{ display: 'flex', width: '100%', height: '2px', backgroundColor: C.muted + '20' }} />
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 400, color: C.sub, fontFamily: 'Outfit' }}>
              Set once. Never changed.
            </div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', maxWidth: '800px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.amber,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Looks immutable. Looks safe.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.amber,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                But the dependency is still fixed.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.amber,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                You can't swap it for tests or staging.
              </div>
            </div>
          </div>
          {rule('32px', C.amber, '20px')}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
            }}
          >
            Immutable, hidden, and locked in. The code that uses a dependency also decides which one to use.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            Now put both dimensions together.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 8: THE QUADRANT
  if (i === 7) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.chart), 'bottom-left', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.blue, 0.06)}
        {decorCircle(80, 900, 30, C.green, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE QUADRANT')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: '8px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Three combinations. Not four.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.5,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
              marginBottom: '36px',
            }}
          >
            Two binary dimensions should give four quadrants. But one is impossible.
          </div>
          {quadrantDiagram()}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            One quadrant is missing. Here's why.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 9: IMPOSSIBLE
  if (i === 8) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.x), 'top-right', 180, 0.5)}
        {decorDiamond(60, 200, 22, C.orange, 0.06)}
        {decorCircle(940, 920, 32, C.blue, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE KEY INSIGHT')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.2,
              marginBottom: '8px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            Explicit + Fixed =
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '60px',
              fontWeight: 700,
              color: C.orange,
              lineHeight: 1.1,
              marginBottom: '8px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Impossible
          </div>
          {rule('56px', C.orange, '32px')}
          <div style={{ display: 'flex', width: '800px', flexDirection: 'column', gap: '4px', alignItems: 'stretch' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                fontWeight: 400,
                color: C.sub,
                lineHeight: 1.3,
                fontFamily: 'Outfit',
                textAlign: 'center',
              }}
            >
              If a dependency appears in the con{'\u200B'}structor, the caller provides it.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                fontWeight: 400,
                color: C.sub,
                lineHeight: 1.3,
                fontFamily: 'Outfit',
                textAlign: 'center',
              }}
            >
              And if the caller provides it, they can provide different things.
            </div>
          </div>
          {rule('32px', C.blue, '20px')}
          <div
            style={{
              display: 'flex',
              fontSize: '34px',
              fontWeight: 600,
              color: C.blue,
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            That's flexibility by definition.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            So people try a shortcut.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 10: WEAKER VS STRONGER ARGUMENT
  if (i === 9) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.scale), 'bottom-right', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.blue, 0.06)}
        {decorCircle(80, 900, 30, C.green, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('TWO ROADS')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: '8px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Why talk about two properties?
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.5,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
              marginBottom: '32px',
            }}
          >
            If explicitness implies flexibility, why bother separating them?
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'flex-start' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '380px' }}
            >
              <div
                style={{ display: 'flex', backgroundColor: C.orange + '18', borderRadius: 12, padding: '12px 24px' }}
              >
                <div
                  style={{ display: 'flex', fontSize: '30px', fontWeight: 700, color: C.orange, fontFamily: 'Outfit' }}
                >
                  Explicitness
                </div>
              </div>
              <div
                style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.orange, fontFamily: 'Outfit' }}
              >
                The weaker argument
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.5,
                  fontFamily: 'Outfit',
                  textAlign: 'center',
                }}
              >
                "Why should I care what database it uses? That's an implementation detail."
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: C.muted,
                  lineHeight: 1.5,
                  fontFamily: 'Outfit',
                  textAlign: 'center',
                }}
              >
                Many developers push back.
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '380px' }}
            >
              <div style={{ display: 'flex', backgroundColor: C.green + '18', borderRadius: 12, padding: '12px 24px' }}>
                <div
                  style={{ display: 'flex', fontSize: '30px', fontWeight: 700, color: C.green, fontFamily: 'Outfit' }}
                >
                  Flexibility
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '22px', fontWeight: 600, color: C.green, fontFamily: 'Outfit' }}>
                The stronger argument
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.5,
                  fontFamily: 'Outfit',
                  textAlign: 'center',
                }}
              >
                "I want to test this without a real database."
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: C.muted,
                  lineHeight: 1.5,
                  fontFamily: 'Outfit',
                  textAlign: 'center',
                }}
              >
                Almost no one disagrees.
              </div>
            </div>
          </div>
          {rule('56px', C.blue, '24px')}
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 600,
              color: C.blue,
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            Start with flexibility. Everyone wants it.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            But how you get it matters. There are two paths.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 11: DANGEROUS PATH — Mutable globals
  if (i === 10) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.fire), 'bottom-right', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.orange, 0.06)}
        {decorCircle(80, 900, 30, C.green, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE DANGEROUS PATH')}
          <div
            style={{
              display: 'flex',
              fontSize: '44px',
              fontWeight: 700,
              color: C.orange,
              lineHeight: 1.15,
              marginBottom: '28px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Mutable globals
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.55,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              marginBottom: '24px',
            }}
          >
            They give you flexibility. You can swap the dependency at runtime.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            But the cost is steep:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.orange,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Temporal coupling
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.orange,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Test pollution
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: C.orange,
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Race conditions
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              lineHeight: 1.55,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
            }}
          >
            Any code anywhere can change it. Your function depends on what happened before the call.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            If not globals, then what?
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 12: INEVITABLE RESULT
  if (i === 11) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.arrow), 'top-right', 180, 0.5)}
        {decorDiamond(60, 200, 22, C.green, 0.06)}
        {decorCircle(940, 920, 32, C.blue, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('THE INEVITABLE RESULT')}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', maxWidth: '800px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  1
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Start with flexibility. Everyone wants it.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  2
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Reject mutable state. Everyone agrees.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  3
                </div>
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                What's left? Construction-time injection.
              </div>
            </div>
          </div>
          {rule('56px', C.green, '28px')}
          <div
            style={{
              display: 'flex',
              borderRadius: 14,
              border: '3px solid ' + C.green + '40',
              backgroundColor: C.green + '10',
              padding: '20px 48px',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '30px',
                fontWeight: 400,
                color: C.sub,
                lineHeight: 1.2,
                fontFamily: 'Outfit',
                textAlign: 'center',
                width: '100%',
              }}
            >
              The dependency is now
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '38px',
                fontWeight: 700,
                color: C.green,
                lineHeight: 1.15,
                fontFamily: 'Plus Jakarta Sans',
                textAlign: 'center',
                width: '100%',
              }}
            >
              explicit in the con{'\u200B'}structor.
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.55,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
              marginTop: '24px',
            }}
          >
            You didn't set out to make it explicit. Explicitness was the inevitable result.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.sub,
              fontFamily: 'Outfit',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            Here's what to remember.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 13: SUMMARY
  if (i === 12) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {emojiBackdrop(E(EK.bulb), 'bottom-right', 180, 0.5)}
        {decorDiamond(920, 120, 20, C.blue, 0.06)}
        {decorCircle(80, 900, 30, C.orange, 0.05)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          {sectionLabel('KEY TAKEAWAYS')}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '860px', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: C.blue,
                  fontFamily: 'Outfit',
                  flexShrink: 0,
                }}
              >
                01
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.4,
                  fontFamily: 'Outfit',
                }}
              >
                Dependencies have 2 dimensions: explicitness and flexibility.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: C.blue,
                  fontFamily: 'Outfit',
                  flexShrink: 0,
                }}
              >
                02
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.4,
                  fontFamily: 'Outfit',
                }}
              >
                Explicit + Fixed is impossible. Explicitness implies flexibility.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: C.blue,
                  fontFamily: 'Outfit',
                  flexShrink: 0,
                }}
              >
                03
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.4,
                  fontFamily: 'Outfit',
                }}
              >
                Explicitness creates locality in both directions.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: C.blue,
                  fontFamily: 'Outfit',
                  flexShrink: 0,
                }}
              >
                04
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.4,
                  fontFamily: 'Outfit',
                }}
              >
                Explicitness is a consequence, not a choice.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: C.blue,
                  fontFamily: 'Outfit',
                  flexShrink: 0,
                }}
              >
                05
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '28px',
                  fontWeight: 400,
                  color: C.text,
                  lineHeight: 1.4,
                  fontFamily: 'Outfit',
                }}
              >
                Mutable globals are the wrong path to flexibility.
              </div>
            </div>
          </div>
          {rule('56px', C.blue, '28px')}
          <div
            style={{
              display: 'flex',
              backgroundColor: C.blue + '18',
              borderRadius: 12,
              padding: '16px 36px',
              flexDirection: 'column',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 600,
                color: C.blue,
                fontFamily: 'Outfit',
                justifyContent: 'center',
              }}
            >
              Pursue flexibility + immutability.
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 400,
                color: C.sub,
                fontFamily: 'Outfit',
                justifyContent: 'center',
              }}
            >
              Explicitness follows inevitably.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 14: CTA
  if (i === 13) {
    return (
      <div
        style={{
          width: '1080px',
          height: '1080px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: C.bg,
          position: 'relative',
        }}
      >
        {brandBar(num, total.toString())}
        {decorDiamond(900, 180, 24, C.green, 0.06)}
        {decorCircle(80, 900, 34, C.orange, 0.05)}
        {decorPlus(940, 920, 20, C.blue, 0.06)}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderRadius: 14,
              border: '3px solid ' + C.blue + '30',
              backgroundColor: C.blue + '08',
              padding: '32px 44px',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '12px',
              maxWidth: '880px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '32px',
                fontWeight: 400,
                color: C.text,
                lineHeight: 1.4,
                fontFamily: 'Outfit',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              Ever wanted to write a simple test, but couldn't because the code was hardcoded to a real database?
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '48px',
              justifyContent: 'center',
            }}
          >
            {emojiInline(E(EK.speech), 28)}
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: C.blue, fontFamily: 'Outfit' }}>
              Comment your experience below
            </div>
          </div>
          {rule('36px', C.muted, '20px')}
          <div
            style={{
              display: 'flex',
              fontSize: '36px',
              fontWeight: 700,
              color: C.text,
              marginBottom: '28px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Found this useful?
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'center', marginBottom: '48px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: C.green,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {emojiInline(E(EK.bookmark), 28)}
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Save this
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: C.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {emojiInline(E(EK.bell), 28)}
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 500, color: C.text, fontFamily: 'Outfit' }}>
                Follow for the series
              </div>
            </div>
          </div>
          {rule('36px', C.muted, '20px')}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 600,
              color: C.blue,
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            Next: Part 3 — SOLID Principles
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              marginTop: '12px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '760px',
            }}
          >
            How to organize code so dependencies are placed well.
          </div>
        </div>
      </div>
    );
  }

  return <div style={{ width: '1080px', height: '1080px', display: 'flex', backgroundColor: C.bg }} />;
}

// ── Main ──
async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: bun run scripts/generate-instagram-carousel.tsx <slug>');
    process.exit(1);
  }

  // Pre-fetch all emoji SVGs
  const allEmojiKeys = Object.values(EK);
  const E: Record<string, string> = {};
  await Promise.all(
    allEmojiKeys.map(async e => {
      E[e] = await loadEmoji(e);
    }),
  );

  const [jakarta700, outfit400, outfit600, outfit700] = await Promise.all([
    loadFont('Plus Jakarta Sans', 700),
    loadFont('Outfit', 400),
    loadFont('Outfit', 600),
    loadFont('Outfit', 700),
  ]);

  const fonts = [
    { name: 'Plus Jakarta Sans', data: jakarta700, weight: 700 as FontWeight, style: 'normal' as const },
    { name: 'Outfit', data: outfit400, weight: 400 as FontWeight, style: 'normal' as const },
    { name: 'Outfit', data: outfit600, weight: 600 as FontWeight, style: 'normal' as const },
    { name: 'Outfit', data: outfit700, weight: 700 as FontWeight, style: 'normal' as const },
  ];

  const outDir = join(process.cwd(), 'instagram', slug);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const total = 14;

  for (let i = 0; i < total; i++) {
    try {
      const el = renderSlide(i, total, E);
      const svg = await satori(el as any, { width: 1080, height: 1080, fonts });
      const png = await sharp(Buffer.from(svg)).png({ quality: 95 }).toBuffer();
      const filePath = join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
      writeFileSync(filePath, new Uint8Array(png));
      console.log(`Generated: ${filePath}`);
    } catch (err) {
      console.error(`Error on slide ${i + 1}:`, (err as Error).message);
    }
  }
  console.log(`\nDone! ${total} slides saved to ${outDir}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

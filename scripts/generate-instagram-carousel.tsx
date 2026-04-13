import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import type { FontWeight } from 'satori';
import sharp from 'sharp';

// ── Brand palette: 3 colors with clear semantic meaning ──
//   Brand indigo (#414C9F) — structural: section labels, key insights, brand identity
//   Teal (#0e7490) — "good" concepts: explicit, flexible, positive outcomes
//   Coral (#c2410c) — "bad" concepts: implicit, fixed, traps, warnings
const C = {
  bg: '#faf7f2',
  text: '#1c1917',
  sub: '#57534e',
  muted: '#a8a29e',
  white: '#ffffff',
  brand: '#414C9F',
  teal: '#0e7490',
  coral: '#c2410c',
};

// ── Font Loading ──
async function loadFont(font: string, weight: number) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1' },
  });
  const m = (await css.text()).match(/src: url\((.+?)\) format\('((?:opentype|truetype|woff2?))'\)/);
  if (!m?.[1]) throw new Error(`No font URL for ${font}:${weight}`);
  return await fetch(m[1]).then(r => r.arrayBuffer());
}

// ── Icon Components (CSS shapes, 100% Satori-compatible) ──

function iconLink(color: string) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
      <div style={{ width: '14px', height: '2px', backgroundColor: color }} />
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
    </div>
  );
}

function iconGrid(color: string) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }} />
      </div>
    </div>
  );
}

function iconEye(color: string) {
  return (
    <div
      style={{
        display: 'flex',
        width: '28px',
        height: '16px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color }} />
    </div>
  );
}

function iconTool(color: string) {
  return (
    <div
      style={{
        display: 'flex',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', width: '2px', height: '10px', backgroundColor: color }} />
    </div>
  );
}

function iconBulb(color: string) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${color}` }} />
      <div
        style={{ width: '6px', height: '3px', backgroundColor: color, marginTop: '1px', borderRadius: '0 0 2px 2px' }}
      />
    </div>
  );
}

function iconWarning(color: string) {
  return (
    <div
      style={{
        display: 'flex',
        width: '20px',
        height: '20px',
        borderRadius: '3px',
        backgroundColor: color,
        transform: 'rotate(45deg)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{ display: 'flex', fontSize: '12px', color: '#faf7f2', fontWeight: 700, transform: 'rotate(-45deg)' }}
      >
        !
      </div>
    </div>
  );
}

function iconTarget(color: string) {
  return (
    <div
      style={{
        display: 'flex',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        border: `2px solid ${color}`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#faf7f2' }} />
      </div>
    </div>
  );
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
        padding: '30px 56px',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '4px',
          color: C.muted,
          fontFamily: 'Outfit',
        }}
      >
        ATOMICLOUD
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: '16px',
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

function sectionLabel(text: string, icon: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '36px', alignItems: 'center' }}>
      <div
        style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center' }}
      >
        {icon}
        <div
          style={{
            display: 'flex',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '4px',
            color: C.brand,
            fontFamily: 'Outfit',
            justifyContent: 'center',
          }}
        >
          {text}
        </div>
      </div>
      <div style={{ display: 'flex', width: '40px', height: '3px', backgroundColor: C.brand, marginTop: '10px' }}></div>
    </div>
  );
}

// Highlighter mark — colored bg behind text, like a real highlighter pen
function hl(text: string, fontSize: number, fontFamily?: string) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: C.brand + '22',
        borderRadius: '8px',
        padding: '4px 12px',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: fontSize,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.3,
          fontFamily: fontFamily,
          justifyContent: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ── Slide Renderer ──

function renderSlide(i: number, total: number) {
  const num = (i + 1).toString();

  // SLIDE 1: HOOK
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '90px',
            backgroundColor: C.brand,
            opacity: 0.05,
            bottom: '80px',
            right: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              marginBottom: '40px',
              letterSpacing: '6px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            EVERY DEVELOPER KNOWS THIS FEELING
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '68px',
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.15,
                fontFamily: 'Plus Jakarta Sans',
                justifyContent: 'center',
              }}
            >
              You change
            </div>
            <div style={{ display: 'flex', transform: 'rotate(-2deg)' }}>
              {hl('ONE thing.', 68, 'Plus Jakarta Sans')}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '68px',
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.15,
                fontFamily: 'Plus Jakarta Sans',
                justifyContent: 'center',
              }}
            >
              Everything
            </div>
            <div style={{ display: 'flex', transform: 'rotate(2deg)' }}>{hl('breaks.', 68, 'Plus Jakarta Sans')}</div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 400,
              color: C.muted,
              marginTop: '40px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            Why does this keep happening?
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 2: THE REAL CAUSE
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '80px',
            backgroundColor: C.brand,
            opacity: 0.05,
            top: '80px',
            right: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('THE REAL CAUSE', iconLink(C.brand))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              width: '100%',
              maxWidth: '840px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.35,
                  fontFamily: 'Plus Jakarta Sans',
                  justifyContent: 'center',
                }}
              >
                Your code depends on other things.
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Libraries. APIs. Databases. Configs. Other modules.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.35,
                  fontFamily: 'Plus Jakarta Sans',
                  justifyContent: 'center',
                }}
              >
                When those things change...
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Your code breaks. Not because you wrote bad code.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              color: C.brand,
              marginTop: '36px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            There's a simple way to think about this.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 3: THE FRAMEWORK
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '70px',
            backgroundColor: C.teal,
            opacity: 0.05,
            bottom: '80px',
            right: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('THE FRAMEWORK', iconGrid(C.brand))}
          <div
            style={{
              display: 'flex',
              fontSize: '40px',
              fontWeight: 700,
              color: C.text,
              marginBottom: '40px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Every dependency has two sides:
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              width: '100%',
              maxWidth: '840px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: C.brand,
                  lineHeight: 1.3,
                  fontFamily: 'Plus Jakarta Sans',
                  marginBottom: '8px',
                  justifyContent: 'center',
                }}
              >
                1. Can you SEE it?
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.65,
                  justifyContent: 'center',
                }}
              >
                Is the dependency visible in the function signature? Or is it hidden inside the code?
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: C.brand,
                  lineHeight: 1.3,
                  fontFamily: 'Plus Jakarta Sans',
                  marginBottom: '8px',
                  justifyContent: 'center',
                }}
              >
                2. Can you CHANGE it?
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.65,
                  justifyContent: 'center',
                }}
              >
                Can you swap it from the outside? Or is it hardcoded inside?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 4: CAN YOU SEE IT?
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '75px',
            backgroundColor: C.teal,
            opacity: 0.05,
            bottom: '100px',
            left: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('CAN YOU SEE IT?', iconEye(C.brand))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              width: '100%',
              maxWidth: '780px',
              alignItems: 'center',
            }}
          >
            {/* EXPLICIT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', transform: 'rotate(-2deg)' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: C.teal + '22',
                    borderRadius: '8px',
                    padding: '4px 16px',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '44px',
                      fontWeight: 700,
                      color: C.teal,
                      fontFamily: 'Outfit',
                      letterSpacing: '3px',
                      justifyContent: 'center',
                    }}
                  >
                    EXPLICIT
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Visible in the signature — the input list. The caller — whoever uses it — knows exactly what to provide.
              </div>
            </div>
            {/* handwritten "vs" */}
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 600,
                color: C.muted,
                fontFamily: 'Outfit',
                transform: 'rotate(3deg)',
                justifyContent: 'center',
              }}
            >
              ~ vs ~
            </div>
            {/* IMPLICIT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', transform: 'rotate(1.5deg)' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: C.coral + '22',
                    borderRadius: '8px',
                    padding: '4px 16px',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '44px',
                      fontWeight: 700,
                      color: C.coral,
                      fontFamily: 'Outfit',
                      letterSpacing: '3px',
                      justifyContent: 'center',
                    }}
                  >
                    IMPLICIT
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Buried inside the code. Hidden until something breaks.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.7,
              marginTop: '28px',
              justifyContent: 'center',
            }}
          >
            Explicit means no surprises. Just honest code.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 5: CAN YOU CHANGE IT?
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '130px',
            height: '130px',
            borderRadius: '65px',
            backgroundColor: C.coral,
            opacity: 0.05,
            top: '80px',
            right: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('CAN YOU CHANGE IT?', iconTool(C.brand))}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              width: '100%',
              maxWidth: '780px',
              alignItems: 'center',
            }}
          >
            {/* FLEXIBLE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', transform: 'rotate(-1.5deg)' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: C.teal + '22',
                    borderRadius: '8px',
                    padding: '4px 16px',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '44px',
                      fontWeight: 700,
                      color: C.teal,
                      fontFamily: 'Outfit',
                      letterSpacing: '3px',
                      justifyContent: 'center',
                    }}
                  >
                    FLEXIBLE
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Provided from outside. Swap it for testing, staging, or different situations.
              </div>
            </div>
            {/* handwritten "vs" */}
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                fontWeight: 600,
                color: C.muted,
                fontFamily: 'Outfit',
                transform: 'rotate(-3deg)',
                justifyContent: 'center',
              }}
            >
              ~ vs ~
            </div>
            {/* FIXED */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', transform: 'rotate(2deg)' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: C.coral + '22',
                    borderRadius: '8px',
                    padding: '4px 16px',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '44px',
                      fontWeight: 700,
                      color: C.coral,
                      fontFamily: 'Outfit',
                      letterSpacing: '3px',
                      justifyContent: 'center',
                    }}
                  >
                    FIXED
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 400,
                  color: C.sub,
                  lineHeight: 1.6,
                  justifyContent: 'center',
                }}
              >
                Hardcoded — baked in permanently. Locked in. No one can change it from the outside.
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              color: C.brand,
              marginTop: '28px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            Everyone agrees flexibility is valuable. But here's the twist...
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 6: THE TWIST
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '170px',
            height: '170px',
            borderRadius: '85px',
            backgroundColor: C.brand,
            opacity: 0.05,
            bottom: '60px',
            right: '60px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('THE TWIST', iconBulb(C.brand))}
          <div style={{ display: 'flex', transform: 'rotate(-1.5deg)' }}>
            {hl('Explicit + Fixed = IMPOSSIBLE', 44, 'Plus Jakarta Sans')}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.7,
              marginTop: '36px',
              justifyContent: 'center',
            }}
          >
            If it's in the signature (the input list), the caller (whoever uses it) must provide it. They can provide
            anything. So explicit automatically means flexible.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              color: C.coral,
              marginTop: '32px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            But not everyone wants to be explicit. They find another way.
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 7: THE TRAP — mutable globals: hidden + globally mutable = unpredictable
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '14px',
            backgroundColor: C.coral,
            opacity: 0.05,
            transform: 'rotate(45deg)',
            top: '60px',
            left: '60px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('THE TRAP', iconWarning(C.coral))}
          <div
            style={{
              display: 'flex',
              fontSize: '40px',
              fontWeight: 600,
              color: C.text,
              lineHeight: 1.35,
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            Mutable globals.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.6,
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            They seem like a clever shortcut. But there's a catch.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: C.coral,
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                }}
              >
                No one can see them
              </div>
              <div
                style={{ display: 'flex', fontSize: '24px', fontWeight: 400, color: C.sub, justifyContent: 'center' }}
              >
                They're invisible from the outside.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: C.coral,
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                }}
              >
                Anyone can change them
              </div>
              <div
                style={{ display: 'flex', fontSize: '24px', fontWeight: 400, color: C.sub, justifyContent: 'center' }}
              >
                At any time. From anywhere. Without telling anyone.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '40px', transform: 'rotate(1.5deg)' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: C.coral + '22',
                borderRadius: '8px',
                padding: '4px 16px',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 700,
                  color: C.coral,
                  fontFamily: 'Outfit',
                  letterSpacing: '2px',
                  justifyContent: 'center',
                }}
              >
                = Unpredictable
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              color: C.brand,
              marginTop: '32px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            So this path is off the table. What's left?
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 8: THE REAL INSIGHT — remove other paths, explicitness follows
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '80px',
            backgroundColor: C.teal,
            opacity: 0.05,
            bottom: '80px',
            right: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 72px',
          }}
        >
          {sectionLabel('THE REAL INSIGHT', iconTarget(C.teal))}
          <div
            style={{
              display: 'flex',
              fontSize: '40px',
              fontWeight: 600,
              color: C.text,
              lineHeight: 1.35,
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            Just one path remains.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 400,
              color: C.sub,
              lineHeight: 1.6,
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            Make dependencies visible and swappable.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 700,
                  color: C.brand,
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                }}
              >
                1.
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 600,
                  color: C.text,
                  justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans',
                }}
              >
                Let the user provide each dependency
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 700,
                  color: C.coral,
                  justifyContent: 'center',
                  fontFamily: 'Outfit',
                }}
              >
                2.
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '36px',
                  fontWeight: 600,
                  color: C.text,
                  justifyContent: 'center',
                  fontFamily: 'Plus Jakarta Sans',
                }}
              >
                Shut the door on shared variables
              </div>
            </div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '36px', gap: '12px' }}
          >
            <div
              style={{ display: 'flex', fontSize: '24px', fontWeight: 400, color: C.muted, justifyContent: 'center' }}
            >
              You don't argue for visibility. It's what's left.
            </div>
            <div style={{ display: 'flex', transform: 'rotate(-1.5deg)' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: C.teal + '22',
                  borderRadius: '8px',
                  padding: '6px 20px',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: C.teal,
                    fontFamily: 'Plus Jakarta Sans',
                    justifyContent: 'center',
                  }}
                >
                  Explicitness follows
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SLIDE 9: CTA
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
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            backgroundColor: C.brand,
            opacity: 0.04,
            top: '80px',
            left: '80px',
          }}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              fontWeight: 700,
              color: C.text,
              marginBottom: '44px',
              fontFamily: 'Plus Jakarta Sans',
              justifyContent: 'center',
            }}
          >
            Liked this?
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              width: '100%',
              maxWidth: '840px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                  backgroundColor: C.teal,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '24px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  1
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: 'Outfit',
                  justifyContent: 'center',
                }}
              >
                Save this for later
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                  backgroundColor: C.brand,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '24px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  2
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: 'Outfit',
                  justifyContent: 'center',
                }}
              >
                Follow for more insights
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                  backgroundColor: C.coral,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{ display: 'flex', fontSize: '24px', fontWeight: 700, color: C.white, fontFamily: 'Outfit' }}
                >
                  3
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '30px',
                  fontWeight: 600,
                  color: C.text,
                  fontFamily: 'Outfit',
                  justifyContent: 'center',
                }}
              >
                Comment your experience below
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '22px',
              fontWeight: 400,
              color: C.muted,
              marginTop: '44px',
              fontFamily: 'Outfit',
              justifyContent: 'center',
            }}
          >
            blog.atomi.cloud
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

  const [outfit400, outfit600, jakarta700] = await Promise.all([
    loadFont('Outfit', 400),
    loadFont('Outfit', 600),
    loadFont('Plus+Jakarta+Sans', 700),
  ]);

  const fonts = [
    { name: 'Outfit', data: outfit400, weight: 400 as FontWeight, style: 'normal' as const },
    { name: 'Outfit', data: outfit600, weight: 600 as FontWeight, style: 'normal' as const },
    { name: 'Plus Jakarta Sans', data: jakarta700, weight: 700 as FontWeight, style: 'normal' as const },
  ];

  const outDir = join(process.cwd(), 'instagram', slug);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const total = 9;

  for (let i = 0; i < total; i++) {
    try {
      const el = renderSlide(i, total);
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

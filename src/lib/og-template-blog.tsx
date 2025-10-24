import type { ReactElement } from 'react';
import type { BlogTheme } from './blog-themes';

export interface BlogOgImageProps {
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  blogName: string;
  logo?: string;
  theme: BlogTheme;
  topic?: string;
}

/**
 * Geometric shape decorations - floating isometric cubes and hexagons
 */
function GeometricShapes({ color }: { color: string }) {
  return (
    <>
      {/* Isometric cubes - top left */}
      <div style={{ display: 'flex', position: 'absolute', top: '30px', left: '30px', opacity: 0.1 }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* Cube 1 */}
          <path d="M 30 40 L 60 25 L 90 40 L 90 70 L 60 85 L 30 70 Z" fill={color} opacity="0.6" />
          <path d="M 60 25 L 60 55 L 90 70 L 90 40 Z" fill={color} opacity="0.8" />
          <path d="M 30 40 L 60 55 L 60 85 L 30 70 Z" fill={color} opacity="0.4" />

          {/* Cube 2 */}
          <path d="M 70 80 L 100 65 L 130 80 L 130 110 L 100 125 L 70 110 Z" fill={color} opacity="0.6" />
          <path d="M 100 65 L 100 95 L 130 110 L 130 80 Z" fill={color} opacity="0.8" />
          <path d="M 70 80 L 100 95 L 100 125 L 70 110 Z" fill={color} opacity="0.4" />
        </svg>
      </div>

      {/* Hexagon grid - bottom right */}
      <div style={{ display: 'flex', position: 'absolute', bottom: '30px', right: '30px', opacity: 0.08 }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {[0, 1, 2].map(row =>
            [0, 1, 2].map(col => {
              const x = 35 + col * 50 + (row % 2) * 25;
              const y = 35 + row * 43;
              return (
                <polygon
                  key={`${row}-${col}`}
                  points={`${x},${y - 20} ${x + 17},${y - 10} ${x + 17},${y + 10} ${x},${y + 20} ${x - 17},${y + 10} ${x - 17},${y - 10}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                />
              );
            }),
          )}
        </svg>
      </div>

      {/* Triangle pattern - top right corner */}
      <div style={{ display: 'flex', position: 'absolute', top: '0', right: '0', opacity: 0.06 }}>
        <svg width="250" height="250" viewBox="0 0 250 250">
          {[0, 1, 2, 3].map(i => (
            <polygon
              key={i}
              points={`${250 - i * 60},0 ${250},${i * 60} ${250 - i * 60 - 60},${i * 60}`}
              fill={color}
            />
          ))}
        </svg>
      </div>
    </>
  );
}

/**
 * Topic-specific iconic decorations - awe-inspiring designs
 */
function TopicDecoration({ topic, color }: { topic?: string; color: string }) {
  const normalizedTopic = topic?.toLowerCase() || '';

  // Tech: Futuristic hexagonal grid with glowing nodes
  if (normalizedTopic === 'tech' || normalizedTopic === 'technology') {
    return (
      <div style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px', opacity: 0.18 }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          {/* Central hexagon with tech grid */}
          <polygon points="140,40 190,70 190,130 140,160 90,130 90,70" fill="none" stroke={color} strokeWidth="4" />
          <polygon points="140,70 170,87 170,117 140,134 110,117 110,87" fill={color} opacity="0.3" />

          {/* Circuit lines radiating out */}
          <line x1="140" y1="40" x2="140" y2="10" stroke={color} strokeWidth="3" />
          <line x1="190" y1="70" x2="220" y2="50" stroke={color} strokeWidth="3" />
          <line x1="190" y1="130" x2="220" y2="150" stroke={color} strokeWidth="3" />
          <line x1="140" y1="160" x2="140" y2="190" stroke={color} strokeWidth="3" />
          <line x1="90" y1="130" x2="60" y2="150" stroke={color} strokeWidth="3" />
          <line x1="90" y1="70" x2="60" y2="50" stroke={color} strokeWidth="3" />

          {/* Glowing nodes */}
          <circle cx="140" cy="10" r="6" fill={color} />
          <circle cx="220" cy="50" r="6" fill={color} />
          <circle cx="220" cy="150" r="6" fill={color} />
          <circle cx="140" cy="190" r="6" fill={color} />
          <circle cx="60" cy="150" r="6" fill={color} />
          <circle cx="60" cy="50" r="6" fill={color} />

          {/* Inner tech detail */}
          <circle cx="140" cy="100" r="20" fill="none" stroke={color} strokeWidth="2" />
          <circle cx="140" cy="100" r="10" fill={color} opacity="0.5" />
        </svg>
      </div>
    );
  }

  // Marketing: Megaphone with explosive sound waves
  if (normalizedTopic === 'marketing') {
    return (
      <div style={{ display: 'flex', position: 'absolute', bottom: '20px', right: '20px', opacity: 0.18 }}>
        <svg width="280" height="220" viewBox="0 0 280 220">
          {/* Megaphone body */}
          <path d="M 80 80 L 120 100 L 120 120 L 80 140 Z" fill={color} opacity="0.6" />
          <ellipse cx="80" cy="110" rx="15" ry="30" fill={color} opacity="0.8" />
          <rect x="120" y="95" width="30" height="30" fill={color} opacity="0.7" />

          {/* Sound waves - expanding circles */}
          <circle cx="150" cy="110" r="40" fill="none" stroke={color} strokeWidth="4" opacity="0.8" />
          <circle cx="150" cy="110" r="60" fill="none" stroke={color} strokeWidth="4" opacity="0.6" />
          <circle cx="150" cy="110" r="80" fill="none" stroke={color} strokeWidth="4" opacity="0.4" />
          <circle cx="150" cy="110" r="100" fill="none" stroke={color} strokeWidth="4" opacity="0.2" />

          {/* Radiating lines for emphasis */}
          <line x1="150" y1="110" x2="240" y2="40" stroke={color} strokeWidth="3" opacity="0.5" />
          <line x1="150" y1="110" x2="260" y2="110" stroke={color} strokeWidth="3" opacity="0.5" />
          <line x1="150" y1="110" x2="240" y2="180" stroke={color} strokeWidth="3" opacity="0.5" />
        </svg>
      </div>
    );
  }

  // Entrepreneurship: Rocket launching with flame trail and stars
  if (normalizedTopic === 'entrepreneurship') {
    return (
      <div style={{ display: 'flex', position: 'absolute', top: '15px', right: '15px', opacity: 0.18 }}>
        <svg width="240" height="300" viewBox="0 0 240 300">
          {/* Rocket body */}
          <path d="M 120 40 L 140 80 L 140 180 L 120 200 L 100 180 L 100 80 Z" fill={color} opacity="0.7" />

          {/* Rocket nose cone */}
          <path d="M 120 20 L 145 80 L 95 80 Z" fill={color} opacity="0.9" />

          {/* Window */}
          <circle cx="120" cy="110" r="18" fill="white" opacity="0.8" />
          <circle cx="120" cy="110" r="12" fill={color} opacity="0.3" />

          {/* Wings */}
          <path d="M 100 140 L 70 180 L 100 170 Z" fill={color} opacity="0.6" />
          <path d="M 140 140 L 170 180 L 140 170 Z" fill={color} opacity="0.6" />

          {/* Flame trail */}
          <ellipse cx="120" cy="210" rx="30" ry="25" fill={color} opacity="0.7" />
          <ellipse cx="120" cy="230" rx="25" ry="30" fill={color} opacity="0.5" />
          <ellipse cx="120" cy="255" rx="20" ry="25" fill={color} opacity="0.3" />

          {/* Stars around rocket */}
          <path
            d="M 40 60 L 45 75 L 60 75 L 48 83 L 52 98 L 40 88 L 28 98 L 32 83 L 20 75 L 35 75 Z"
            fill={color}
            opacity="0.6"
          />
          <path
            d="M 180 100 L 183 110 L 193 110 L 185 115 L 188 125 L 180 118 L 172 125 L 175 115 L 167 110 L 177 110 Z"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M 200 40 L 202 47 L 209 47 L 203 51 L 205 58 L 200 53 L 195 58 L 197 51 L 191 47 L 198 47 Z"
            fill={color}
            opacity="0.7"
          />
        </svg>
      </div>
    );
  }

  // Productivity: Lightning bolt with gears and focus beam
  if (normalizedTopic === 'productivity') {
    return (
      <div style={{ display: 'flex', position: 'absolute', top: '20px', right: '20px', opacity: 0.18 }}>
        <svg width="260" height="280" viewBox="0 0 260 280">
          {/* Lightning bolt */}
          <path
            d="M 140 30 L 120 120 L 150 120 L 130 210"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M 145 30 L 125 120 L 155 120 L 135 210" fill={color} opacity="0.8" />

          {/* Gear 1 - top right */}
          <circle cx="200" cy="60" r="35" fill="none" stroke={color} strokeWidth="4" />
          <circle cx="200" cy="60" r="20" fill={color} opacity="0.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 200 + Math.cos(angle) * 30;
            const y1 = 60 + Math.sin(angle) * 30;
            const x2 = 200 + Math.cos(angle) * 40;
            const y2 = 60 + Math.sin(angle) * 40;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="6" />;
          })}

          {/* Gear 2 - bottom left */}
          <circle cx="70" cy="180" r="30" fill="none" stroke={color} strokeWidth="4" />
          <circle cx="70" cy="180" r="17" fill={color} opacity="0.5" />
          {[0, 1, 2, 3, 4, 5].map(i => {
            const angle = (i * 60 * Math.PI) / 180;
            const x1 = 70 + Math.cos(angle) * 25;
            const y1 = 180 + Math.sin(angle) * 25;
            const x2 = 70 + Math.cos(angle) * 35;
            const y2 = 180 + Math.sin(angle) * 35;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5" />;
          })}

          {/* Energy sparks */}
          <circle cx="140" cy="30" r="8" fill={color} opacity="0.8" />
          <circle cx="150" cy="20" r="5" fill={color} opacity="0.6" />
          <circle cx="130" cy="210" r="8" fill={color} opacity="0.8" />
          <circle cx="140" cy="220" r="5" fill={color} opacity="0.6" />
        </svg>
      </div>
    );
  }

  // Health: DNA double helix with glowing particles
  if (normalizedTopic === 'health') {
    return (
      <div style={{ display: 'flex', position: 'absolute', bottom: '20px', right: '20px', opacity: 0.18 }}>
        <svg width="200" height="280" viewBox="0 0 200 280">
          {/* DNA helix structure */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
            const y = 30 + i * 22;
            const offset = Math.sin((i * Math.PI) / 3) * 40;
            const x1 = 100 + offset;
            const x2 = 100 - offset;
            return (
              <g key={i}>
                {/* Connecting line */}
                <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="2" opacity="0.5" />

                {/* Base pairs */}
                <circle cx={x1} cy={y} r="6" fill={color} opacity="0.8" />
                <circle cx={x2} cy={y} r="6" fill={color} opacity="0.8" />
              </g>
            );
          })}

          {/* Helix curves */}
          <path
            d="M 100 30 Q 140 70 100 110 Q 60 150 100 190 Q 140 230 100 270"
            stroke={color}
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 100 30 Q 60 70 100 110 Q 140 150 100 190 Q 60 230 100 270"
            stroke={color}
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />

          {/* Glowing particles around helix */}
          <circle cx="60" cy="100" r="4" fill={color} opacity="0.7" />
          <circle cx="140" cy="150" r="4" fill={color} opacity="0.7" />
          <circle cx="75" cy="200" r="3" fill={color} opacity="0.6" />
          <circle cx="125" cy="50" r="3" fill={color} opacity="0.6" />
        </svg>
      </div>
    );
  }

  // Default: Abstract geometric burst
  return (
    <div style={{ display: 'flex', position: 'absolute', top: '30px', right: '30px', opacity: 0.12 }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="3" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = 100 + Math.cos(angle) * 100;
          const y = 100 + Math.sin(angle) * 100;
          return <line key={i} x1="100" y1="100" x2={x} y2={y} stroke={color} strokeWidth="2" opacity="0.6" />;
        })}
        <circle cx="100" cy="100" r="30" fill={color} opacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * Blog-specific OG Image Template - 1200x630px
 * Enhanced with stunning geometric patterns and awe-inspiring topic icons
 */
export function BlogOgImageTemplate({
  title,
  subtitle,
  author,
  date,
  blogName,
  logo,
  theme,
  topic,
}: BlogOgImageProps): ReactElement {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        backgroundImage: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Geometric grid pattern background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          backgroundImage: `
            linear-gradient(${theme.primaryColor}22 1.5px, transparent 1.5px),
            linear-gradient(90deg, ${theme.primaryColor}22 1.5px, transparent 1.5px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5,
        }}
      />

      {/* Large decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-180px',
          right: '-180px',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
        }}
      />

      {/* Geometric shapes decoration */}
      <GeometricShapes color="rgba(255, 255, 255, 0.95)" />

      {/* Topic-specific decoration */}
      <TopicDecoration topic={topic} color="rgba(255, 255, 255, 0.95)" />

      {/* Main card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1050px',
          height: '520px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '32px',
          padding: '50px 55px',
          boxShadow: `
            0 40px 100px rgba(0, 0, 0, 0.3),
            0 15px 40px rgba(0, 0, 0, 0.2),
            0 5px 15px rgba(0, 0, 0, 0.1)
          `,
          border: '2px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header: Logo + Blog Name + Topic Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Logo + Blog Name */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {logo ? (
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  display: 'flex',
                  overflow: 'hidden',
                  boxShadow: `0 6px 16px ${theme.primaryColor}50`,
                  border: `2px solid ${theme.primaryColor}30`,
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  width={70}
                  height={70}
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientEnd})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: '800',
                  color: 'white',
                  boxShadow: `0 6px 16px ${theme.primaryColor}50`,
                }}
              >
                B
              </div>
            )}
            <div
              style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#0f172a',
                display: 'flex',
              }}
            >
              {blogName}
            </div>
          </div>

          {/* Right: Topic Badge */}
          <div
            style={{
              display: 'flex',
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientEnd})`,
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              boxShadow: `0 6px 16px ${theme.primaryColor}50`,
            }}
          >
            {theme.name}
          </div>
        </div>

        {/* Content: Title + Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Title with gradient */}
          <div
            style={{
              fontSize: title.length > 50 ? '52px' : '64px',
              fontWeight: '800',
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientEnd})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: '26px',
                color: '#475569',
                lineHeight: 1.4,
                display: 'flex',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer: Author + Date */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '28px',
            borderTop: `3px solid ${theme.primaryColor}30`,
          }}
        >
          {/* Author */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '26px',
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.gradientEnd})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: '700',
                color: 'white',
                boxShadow: `0 4px 12px ${theme.primaryColor}35`,
              }}
            >
              {author.charAt(0).toUpperCase()}
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
                display: 'flex',
              }}
            >
              {author}
            </div>
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#64748b',
              display: 'flex',
            }}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { ReactElement } from 'react';

export interface OgImageProps {
  title: string;
  subtitle?: string;
  author?: string;
  siteName?: string;
  themeColor?: string;
  logo?: string; // Base64 data URL or image URL
}

/**
 * Satori-compatible OG Image Template - 1200x630px
 * Following proven patterns for Satori's strict layout requirements
 */
export function OgImageTemplate({
  title,
  subtitle,
  author,
  siteName = 'Azide Boron',
  themeColor = '#4F46E5',
  logo,
}: OgImageProps): ReactElement {
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
        backgroundImage: `linear-gradient(135deg, ${themeColor} 0%, #7c3aed 100%)`,
      }}
    >
      {/* Main card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1080px',
          height: '550px',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '60px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header with logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Logo */}
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              width={80}
              height={80}
              style={{
                borderRadius: '16px',
              }}
            />
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                backgroundColor: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: '800',
                color: 'white',
              }}
            >
              B
            </div>
          )}
          {/* Site name */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
            }}
          >
            {siteName}
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? '48px' : '64px',
              fontWeight: '800',
              color: '#1f2937',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontSize: '32px',
                color: '#6b7280',
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer with author */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '30px',
            borderTop: '3px solid #e5e7eb',
          }}
        >
          {/* Author or date */}
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6b7280',
              display: 'flex',
            }}
          >
            {author || `${new Date().getFullYear()}`}
          </div>
          {/* Theme color indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: themeColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

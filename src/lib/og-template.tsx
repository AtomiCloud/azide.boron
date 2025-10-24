import type { ReactElement } from 'react';

export interface OgImageProps {
  title: string;
  description?: string;
  siteName?: string;
  logo?: string;
}

/**
 * OG Image Template - Renders a beautiful 1200x630 Open Graph image
 * Uses Tailwind-like styles (Satori supports a subset of CSS)
 */
export function OgImageTemplate({ title, description, siteName = 'Azide Boron', logo }: OgImageProps): ReactElement {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        backgroundImage:
          'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
        backgroundSize: '100px 100px',
      }}
    >
      {/* Main content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: '90%',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '60px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Logo or Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '16px',
              backgroundColor: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            B
          </div>
        </div>

        {/* Title and description container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? '56px' : '72px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0',
              marginBottom: '30px',
              lineHeight: '1.1',
              maxWidth: '90%',
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '32px',
              color: '#6b7280',
              margin: '0',
              marginBottom: description ? '40px' : '0',
              maxWidth: '85%',
              lineHeight: '1.4',
              display: description ? 'block' : 'none',
            }}
          >
            {description || ''}
          </p>
        </div>

        {/* Site name footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 'auto',
            paddingTop: '40px',
            borderTop: '2px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '28px',
              fontWeight: '600',
              color: '#4F46E5',
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#9ca3af',
            }}
          >
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}

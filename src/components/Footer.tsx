import type { Config } from '../lib/config';
import {
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaInstagram,
  FaTelegram,
  FaEnvelope,
  FaWhatsapp,
  FaBluesky,
  FaReddit,
} from 'react-icons/fa6';

interface FooterProps {
  config: Config;
}

export function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Normalize WhatsApp number by removing all non-digit characters
  const whatsappNumber = config.social?.whatsapp?.replace(/\D/g, '');

  // Build array of all possible social platforms with their icons and URL generators
  // Filter to only include items where the social platform has a non-empty value
  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: config.social?.github },
    { name: 'Twitter', icon: FaTwitter, url: config.social?.twitter },
    { name: 'Discord', icon: FaDiscord, url: config.social?.discord },
    { name: 'YouTube', icon: FaYoutube, url: config.social?.youtube },
    { name: 'TikTok', icon: FaTiktok, url: config.social?.tiktok },
    { name: 'LinkedIn', icon: FaLinkedin, url: config.social?.linkedin },
    { name: 'Instagram', icon: FaInstagram, url: config.social?.instagram },
    { name: 'Telegram', icon: FaTelegram, url: config.social?.telegram },
    { name: 'Bluesky', icon: FaBluesky, url: config.social?.bluesky },
    { name: 'Reddit', icon: FaReddit, url: config.social?.reddit },
    {
      name: 'Email',
      icon: FaEnvelope,
      url: config.social?.email ? `mailto:${config.social.email}` : undefined,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined,
    },
  ].filter(link => {
    const url = link.url?.trim();
    return Boolean(url && url !== '#');
  });

  return (
    <footer className="mt-auto border-t border-border bg-background relative z-20 container mx-auto px-6 py-8 max-w-4xl flex flex-col items-center gap-6">
      {/* Links - use div instead of nav to reduce nesting */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
        role="navigation"
        aria-label="Footer navigation"
      >
        <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </a>
        <span className="text-muted-foreground">•</span>
        <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
        <span className="text-muted-foreground">•</span>
        <a href="/legal" className="text-muted-foreground hover:text-foreground transition-colors">
          Legal
        </a>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {socialLinks.map(({ name, icon: Icon, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label={name}
            title={name}
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-xs text-muted-foreground text-center">
        &copy; {currentYear} {config.app.name}. All rights reserved.
      </p>
    </footer>
  );
}

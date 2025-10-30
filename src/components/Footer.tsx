import type { Config } from '../lib/config';
import { Button } from './ui/button';
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
} from 'react-icons/fa6';

interface FooterProps {
  config: Config;
}

export function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', icon: FaGithub, url: config.social.github || '#' },
    { name: 'Twitter', icon: FaTwitter, url: config.social.twitter || '#' },
    { name: 'Discord', icon: FaDiscord, url: config.social.discord || '#' },
    { name: 'YouTube', icon: FaYoutube, url: config.social.youtube || '#' },
    { name: 'TikTok', icon: FaTiktok, url: config.social.tiktok || '#' },
    { name: 'LinkedIn', icon: FaLinkedin, url: config.social.linkedin || '#' },
    { name: 'Instagram', icon: FaInstagram, url: config.social.instagram || '#' },
    { name: 'Telegram', icon: FaTelegram, url: config.social.telegram || '#' },
    { name: 'Email', icon: FaEnvelope, url: config.social.email ? `mailto:${config.social.email}` : '#' },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: config.social.whatsapp ? `https://wa.me/${config.social.whatsapp}` : '#',
    },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-background relative z-20">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex flex-col items-center gap-6">
          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
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
          </nav>

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
        </div>
      </div>
    </footer>
  );
}

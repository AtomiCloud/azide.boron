import { FaTwitter, FaLinkedin, FaFacebook, FaReddit, FaTelegram, FaWhatsapp } from 'react-icons/fa6';

interface SocialShareButtonsProps {
  title: string;
  description: string;
  url: string;
}

export function SocialShareButtons({ title, description, url }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} - ${description}`);

  const handleShareClick = (platform: string) => {
    // Track share button click with Plausible
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Share Click', { props: { platform } });
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-[#1DA1F2]',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-[#0A66C2]',
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877F2]',
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:text-[#FF4500]',
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#26A5E4]',
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
      color: 'hover:text-[#25D366]',
    },
  ];

  return (
    <div className="border-t border-border pt-8 mt-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Enjoyed this? Share it with your friends!</h3>
      <div className="flex flex-wrap items-center gap-3">
        {shareLinks.map(({ name, icon: Icon, url, color }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${name}`}
            onClick={() => handleShareClick(name)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-muted-foreground transition-colors ${color} hover:border-current`}
          >
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  );
}

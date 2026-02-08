import { Phone, MapPin, Youtube, Facebook, Instagram } from 'lucide-react';
import { businessInfo, socialLinks } from '../../data/siteData';

interface ContactBarProps {
  variant?: 'default' | 'compact';
}

export default function ContactBar({ variant = 'default' }: ContactBarProps) {
  const isCompact = variant === 'compact';

  const buttonClass = isCompact
    ? 'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
    : 'inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className={`flex flex-wrap items-center ${isCompact ? 'gap-1' : 'gap-2'}`}>
      <a
        href={businessInfo.phoneLink}
        className={`${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90`}
        aria-label="Call us"
      >
        <Phone className={`${isCompact ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {!isCompact && <span>Call Now</span>}
      </a>

      <a
        href={socialLinks.maps}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="View location on Google Maps"
      >
        <MapPin className={`${isCompact ? 'h-4 w-4' : 'mr-2 h-4 w-4'}`} />
        {!isCompact && <span>Location</span>}
      </a>

      <a
        href={socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Visit our YouTube channel"
      >
        <Youtube className={`h-4 w-4 ${isCompact ? '' : 'mr-2'}`} />
        {!isCompact && <span>YouTube</span>}
      </a>

      <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Visit our Facebook page"
      >
        <Facebook className={`h-4 w-4 ${isCompact ? '' : 'mr-2'}`} />
        {!isCompact && <span>Facebook</span>}
      </a>

      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Visit our Instagram account"
      >
        <Instagram className={`h-4 w-4 ${isCompact ? '' : 'mr-2'}`} />
        {!isCompact && <span>Instagram</span>}
      </a>
    </div>
  );
}

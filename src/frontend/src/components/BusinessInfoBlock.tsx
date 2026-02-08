import { MapPin, Phone } from 'lucide-react';
import { businessInfo } from '../data/siteData';

export default function BusinessInfoBlock() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-card-foreground">{businessInfo.name}</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">{businessInfo.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary" />
          <a
            href={businessInfo.phoneLink}
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            {businessInfo.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

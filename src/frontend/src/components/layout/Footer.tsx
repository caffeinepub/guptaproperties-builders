import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { businessInfo } from '../../data/siteData';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">{businessInfo.name}</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in real estate. We help you find your dream property with
              professional service and expert guidance.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{businessInfo.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href={businessInfo.phoneLink}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {businessInfo.phone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Business Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

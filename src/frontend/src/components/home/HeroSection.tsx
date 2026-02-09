import { ArrowRight } from 'lucide-react';
import { businessInfo } from '../../data/siteData';
import ContactBar from '../layout/ContactBar';
import HomepageAuthButton from '../auth/HomepageAuthButton';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Trusted Real Estate Partner
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Find Your Dream Property in{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                New Delhi
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Expert guidance, premium properties, and personalized service. Let us help you make
              the right investment decision.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ContactBar />
              <HomepageAuthButton />
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-border shadow-2xl">
              <img
                src="/assets/generated/hero-illustration.dim_1600x700.png"
                alt="Real Estate"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -left-6 -top-6 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

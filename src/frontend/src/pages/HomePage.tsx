import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Building2, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import BusinessInfoBlock from '../components/BusinessInfoBlock';
import InquiryForm from '../components/inquiries/InquiryForm';

export default function HomePage() {
  useEffect(() => {
    document.title = 'GuptaProperties&Builders - Your Trusted Real Estate Partner';
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="border-t border-border/40 bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Why Choose Us</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We bring years of experience and dedication to help you find the perfect property
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Premium Properties
              </h3>
              <p className="text-sm text-muted-foreground">
                Carefully curated selection of residential and commercial properties
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Professional advice from experienced real estate consultants
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Trusted Service</h3>
              <p className="text-sm text-muted-foreground">
                Years of satisfied clients and successful transactions
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">Best Deals</h3>
              <p className="text-sm text-muted-foreground">
                Competitive pricing and excellent investment opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Get in Touch
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Ready to find your dream property? Contact us today and let our experts guide you
                through every step of your real estate journey.
              </p>
              <BusinessInfoBlock />
              
              <div className="mt-8 space-y-6">
                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-semibold text-card-foreground">
                    Browse Our Properties
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Explore our latest listings of residential and commercial properties across New
                    Delhi
                  </p>
                  <Link
                    to="/properties"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    View All Properties
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-semibold text-card-foreground">
                    Visit Our Office
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Come visit us at our office in Uttam Nagar. We&apos;re here to help you Monday through
                    Saturday.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rp9nw7uf3LgE3nZV9?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect } from 'react';
import InquiryForm from '../components/inquiries/InquiryForm';

export default function InquiriesPage() {
  useEffect(() => {
    document.title = 'Inquiries - GuptaProperties&Builders';
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Get in Touch</h1>
            <p className="mt-2 text-muted-foreground">
              Interested in a property? Send us your inquiry and we'll get back to you soon.
            </p>
          </div>

          <InquiryForm />
        </div>
      </div>
    </div>
  );
}

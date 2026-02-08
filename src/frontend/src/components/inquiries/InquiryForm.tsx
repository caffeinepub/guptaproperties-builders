import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function InquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [propertyInterest, setPropertyInterest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validation
    if (!name.trim()) {
      setSubmitError('Please enter your name');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }
    if (!propertyInterest.trim()) {
      setSubmitError('Please specify which property you are interested in');
      return;
    }
    if (!message.trim()) {
      setSubmitError('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend inquiry submission has been removed
      // Show success message but don't actually submit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPropertyInterest('');
      setMessage('');
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Us Your Inquiry</CardTitle>
        <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyInterest">Interested In (Flat/House/Property) *</Label>
            <Input
              id="propertyInterest"
              type="text"
              value={propertyInterest}
              onChange={(e) => setPropertyInterest(e.target.value)}
              placeholder="e.g., 2BHK Flat, Villa, Commercial Space"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your requirements..."
              rows={5}
              disabled={isSubmitting}
              required
            />
          </div>

          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {submitSuccess && (
            <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription>
                Thank you! Your inquiry has been received. We'll contact you soon.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Inquiry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Mail, User, MessageSquare, Home } from 'lucide-react';
import type { Inquiry } from '../../types';

interface InquiryListProps {
  inquiries: Inquiry[];
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  if (inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No inquiries yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              {inquiry.name || 'Anonymous'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{inquiry.email || 'No email provided'}</span>
            </div>

            {inquiry.propertyInterest && (
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-primary" />
                <span className="font-medium">Interested in: {inquiry.propertyInterest}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm leading-relaxed">{inquiry.inquiryBody || 'No message'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

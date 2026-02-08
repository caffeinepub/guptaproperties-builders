import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, Check } from 'lucide-react';

export default function MyPrincipalCard() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) {
    return null;
  }

  const principalText = identity.getPrincipal().toString();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Principal ID</CardTitle>
        <CardDescription>
          Share this ID with an admin to receive admin privileges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <code className="flex-1 overflow-hidden text-ellipsis rounded bg-muted px-3 py-2 text-xs">
            {principalText}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

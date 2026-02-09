import { useState } from 'react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Shield, AlertCircle, Copy, CheckCircle } from 'lucide-react';

export default function BootstrapAdminHelper() {
  const [showHelper, setShowHelper] = useState(true);
  const [copiedCurrent, setCopiedCurrent] = useState(false);
  const { 
    data: isAdmin = false, 
    isLoading: adminLoading,
    isError: adminCheckError,
  } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();

  const handleCopyCurrent = async () => {
    if (!currentPrincipal) return;
    try {
      await navigator.clipboard.writeText(currentPrincipal);
      setCopiedCurrent(true);
      setTimeout(() => setCopiedCurrent(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!showHelper) {
    return null;
  }

  // If user is already admin, no need to show
  if (isAdmin && !adminCheckError) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>How to Get Admin Access</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelper(false)}
          >
            Dismiss
          </Button>
        </div>
        <CardDescription>
          Learn how admin access works for this application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Admin Access System</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>
              <strong>First User (Bootstrap Admin):</strong> A specific Principal ID has been configured as the bootstrap admin. If you log in with that identity, you will have full admin access automatically.
            </p>
            <p>
              <strong>Additional Admins:</strong> Once a bootstrap admin or owner is active, they can grant admin access to other users through the Admin Management panel on this page.
            </p>
          </AlertDescription>
        </Alert>

        {currentPrincipal && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Your Principal ID</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyCurrent}
                className="h-8"
              >
                {copiedCurrent ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <code className="block break-all text-xs font-mono text-foreground">
              {currentPrincipal}
            </code>
            <p className="mt-2 text-xs text-muted-foreground">
              Share this Principal ID with an existing admin to request access.
            </p>
          </div>
        )}

        {!adminLoading && !isAdmin && !adminCheckError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You do not currently have admin access. To obtain admin privileges, contact an existing administrator and provide them with your Principal ID shown above. They can grant you access through the Admin Management panel.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

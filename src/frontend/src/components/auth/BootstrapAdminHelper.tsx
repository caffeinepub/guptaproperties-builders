import { useState } from 'react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const BOOTSTRAP_PRINCIPAL = 'enn3j-adkwy-i7cxf-gi4bs-ihisb-mpsqc-lozg5-coeen-cba7n-y352m-4ae';

export default function BootstrapAdminHelper() {
  const [showHelper, setShowHelper] = useState(true);
  const { 
    data: isAdmin = false, 
    isLoading: adminLoading,
    isError: adminCheckError,
    error: adminError
  } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toString();
  const isBootstrapPrincipal = currentPrincipal === BOOTSTRAP_PRINCIPAL;

  if (!showHelper) {
    return null;
  }

  // If user is already admin and is the bootstrap principal, no need to show
  if (isAdmin && isBootstrapPrincipal && !adminCheckError) {
    return null;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Admin Access Information</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelper(false)}
            className="h-6 px-2 text-xs"
          >
            Dismiss
          </Button>
        </div>
        <CardDescription>
          How to get admin access in this application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Bootstrap Principal ID:</strong>
            <br />
            <code className="mt-1 block rounded bg-muted px-2 py-1 text-xs font-mono break-all">
              {BOOTSTRAP_PRINCIPAL}
            </code>
          </AlertDescription>
        </Alert>

        {adminCheckError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Backend Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p className="text-sm">
                Unable to check admin status. The backend may still be initializing after deployment.
              </p>
              <p className="text-xs font-mono">
                {adminError instanceof Error ? adminError.message : 'Unknown error'}
              </p>
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Refresh Page
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!adminCheckError && isBootstrapPrincipal && !isAdmin && !adminLoading && (
          <Alert className="border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription>
              <strong>You are logged in as the bootstrap principal!</strong>
              <br />
              The backend automatically grants admin access to this Principal ID after deployment or upgrade.
              If you don't see admin features yet, try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {!adminCheckError && isBootstrapPrincipal && !isAdmin && !adminLoading && (
          <Button
            onClick={handleRefresh}
            className="w-full"
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page to Load Admin Features
          </Button>
        )}

        {!adminCheckError && !isBootstrapPrincipal && currentPrincipal && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>You are logged in as a different Principal ID.</strong>
              <br />
              To get automatic admin access, you must log in as the bootstrap principal shown above.
              Alternatively, an existing admin can grant you admin access using your Principal ID.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">How Admin Access Works</h4>
            <p className="text-sm text-muted-foreground">
              This application uses Principal ID-based authorization via Internet Identity. There are no admin tokens or passwords.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>The bootstrap Principal ID (shown above) automatically becomes admin after deployment or upgrade</li>
              <li>If you're logged in as the bootstrap principal but don't see admin features, refresh the page</li>
              <li>Existing admins can grant admin access to other Principal IDs using the Admin Management panel</li>
              <li>To get admin access, either log in as the bootstrap principal or ask an existing admin to grant you access</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Getting Admin Access</h4>
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium mb-2">Option 1: Log in as Bootstrap Principal</p>
              <p className="text-muted-foreground text-xs mb-3">
                Use Internet Identity with the bootstrap Principal ID shown above. After logging in, refresh the page to see admin features.
              </p>
              
              <p className="font-medium mb-2">Option 2: Get Access from Existing Admin</p>
              <p className="text-muted-foreground text-xs">
                Share your Principal ID (shown in "My Principal ID" card below) with an existing admin. They can grant you admin access through the Admin Management panel.
              </p>
            </div>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Still having issues?</strong> If you're logged in as the bootstrap principal and still don't have admin access after refreshing,
            the canister may need to be redeployed. Contact your system administrator.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

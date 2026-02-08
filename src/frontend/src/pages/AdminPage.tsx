import { useEffect } from 'react';
import { useGetInquiries } from '../hooks/useInquiries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import InquiryList from '../components/inquiries/InquiryList';
import MyPrincipalCard from '../components/auth/MyPrincipalCard';
import AdminManagementPanel from '../components/admin/AdminManagementPanel';
import BootstrapAdminHelper from '../components/auth/BootstrapAdminHelper';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { RefreshCw, Loader2, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: inquiries = [], isLoading, isError, error, refetch } = useGetInquiries();
  const { 
    data: isAdmin = false, 
    isLoading: adminLoading, 
    isError: adminCheckError,
    error: adminError,
    refetch: refetchAdmin 
  } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    document.title = 'Admin Panel - GuptaProperties&Builders';
  }, []);

  // Refetch admin status when identity changes
  useEffect(() => {
    if (isAuthenticated) {
      refetchAdmin();
    }
  }, [isAuthenticated, refetchAdmin]);

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardContent className="py-12 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Authentication Required</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Please log in to access the admin panel
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated but admin check failed - show error state
  if (!adminLoading && adminCheckError) {
    return (
      <div className="min-h-screen bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Panel</h1>
            <p className="mt-2 text-muted-foreground">
              Unable to verify admin status
            </p>
          </div>

          <div className="space-y-6">
            <BootstrapAdminHelper />
            <MyPrincipalCard />
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Status Check Failed</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>
                  We couldn't verify your admin status due to a backend error. This may happen if:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>The canister is still initializing after deployment</li>
                  <li>There's a temporary connection issue</li>
                  <li>The backend needs to be redeployed</li>
                </ul>
                <p className="text-sm font-medium mt-3">
                  Error: {adminError instanceof Error ? adminError.message : 'Unknown error'}
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={() => refetchAdmin()}
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated but not admin - show access denied
  if (!adminLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/20 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Panel</h1>
            <p className="mt-2 text-muted-foreground">
              Administrative access required
            </p>
          </div>

          <div className="space-y-6">
            <BootstrapAdminHelper />
            <MyPrincipalCard />
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Access Denied</strong>
                <br />
                You don't have admin access. To become an admin, log in as the bootstrap principal and refresh the page,
                or share your Principal ID with an existing admin who can grant you access.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated and admin - show admin panel
  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Panel</h1>
              </div>
              <p className="mt-2 text-muted-foreground">
                Manage customer inquiries and admin access
              </p>
            </div>
            <Button
              onClick={() => {
                refetchAdmin();
                refetch();
              }}
              variant="outline"
              size="sm"
              disabled={adminLoading || isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${(adminLoading || isLoading) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Bootstrap Admin Helper */}
          <BootstrapAdminHelper />

          {/* My Principal Card */}
          <MyPrincipalCard />

          {/* Admin Management Panel */}
          {!adminLoading && isAdmin && (
            <>
              <Separator />
              <AdminManagementPanel />
            </>
          )}

          {/* Inquiries Section */}
          {!adminLoading && isAdmin && (
            <>
              <Separator />
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Customer Inquiries</h2>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {isLoading && (
                  <Card>
                    <CardContent className="flex min-h-[200px] items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">Loading inquiries...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error instanceof Error && error.message.includes('Unauthorized')
                        ? 'Admin access required to view inquiries'
                        : 'Failed to load inquiries. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {!isLoading && !isError && <InquiryList inquiries={inquiries} />}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

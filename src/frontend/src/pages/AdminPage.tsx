import { useEffect } from 'react';
import { useGetInquiries } from '../hooks/useInquiries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useAdminDiagnostics } from '../hooks/useAdminDiagnostics';
import InquiryList from '../components/inquiries/InquiryList';
import MyPrincipalCard from '../components/auth/MyPrincipalCard';
import AdminManagementPanel from '../components/admin/AdminManagementPanel';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { RefreshCw, Loader2, Lock, AlertCircle, ShieldCheck, Info, Globe } from 'lucide-react';

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

  const {
    data: diagnostics,
    isLoading: diagnosticsLoading,
    refetch: refetchDiagnostics,
  } = useAdminDiagnostics();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    document.title = 'Admin Panel - GuptaProperties&Builders';
  }, []);

  const handleRefreshAll = () => {
    refetchAdmin();
    refetchDiagnostics();
    refetch();
  };

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
    const errorMessage = adminError instanceof Error ? adminError.message : 'Unknown error';
    
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
            {/* Deployment Environment Card */}
            {diagnostics && (
              <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Globe className="h-5 w-5" />
                    Deployment Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Environment:</p>
                    <p className="font-mono text-sm text-blue-900 dark:text-blue-100">{diagnostics.environmentLabel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Current URL:</p>
                    <p className="font-mono text-xs break-all text-blue-900 dark:text-blue-100">{diagnostics.currentOrigin}</p>
                  </div>
                  <Alert className="mt-3 border-blue-600 bg-blue-100 dark:bg-blue-900">
                    <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Testing Checklist:</strong> To verify admin access across deployments, log in as <code className="font-mono text-xs bg-blue-200 dark:bg-blue-800 px-1 rounded">fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe</code> in BOTH your draft and production URLs and confirm this page shows "Admin Access Active" in both environments.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            <MyPrincipalCard />
            
            {/* Admin Diagnostics Section */}
            {diagnostics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Admin Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Internet Identity Principal:</p>
                    <p className="font-mono text-sm break-all">{identity?.getPrincipal().toString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Caller Principal:</p>
                    <p className="font-mono text-sm break-all">{diagnostics.backendCallerPrincipal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Reports Admin Status:</p>
                    <p className="font-mono text-sm">{diagnostics.backendReportsIsAdmin ? 'true' : 'false'}</p>
                  </div>
                  {diagnostics.backendAdminList.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Backend Admin List:</p>
                      <ul className="mt-1 space-y-1">
                        {diagnostics.backendAdminList.map((admin, idx) => (
                          <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Checking Admin Status</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>
                  We couldn't verify your admin status. This may happen if:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>The canister is still initializing after deployment</li>
                  <li>There's a temporary connection issue</li>
                  <li>The backend needs to be redeployed</li>
                </ul>
                <p className="text-xs font-mono mt-3 p-2 bg-muted rounded">
                  {errorMessage}
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={handleRefreshAll}
                variant="default"
                disabled={diagnosticsLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${diagnosticsLoading ? 'animate-spin' : ''}`} />
                Refresh Diagnostics
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

  // Authenticated but not admin - show access denied with diagnostics
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
            {/* Deployment Environment Card */}
            {diagnostics && (
              <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Globe className="h-5 w-5" />
                    Deployment Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Environment:</p>
                    <p className="font-mono text-sm text-blue-900 dark:text-blue-100">{diagnostics.environmentLabel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Current URL:</p>
                    <p className="font-mono text-xs break-all text-blue-900 dark:text-blue-100">{diagnostics.currentOrigin}</p>
                  </div>
                  <Alert className="mt-3 border-blue-600 bg-blue-100 dark:bg-blue-900">
                    <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                    <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Testing Checklist:</strong> To verify admin access across deployments, log in as <code className="font-mono text-xs bg-blue-200 dark:bg-blue-800 px-1 rounded">fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe</code> in BOTH your draft and production URLs and confirm this page shows "Admin Access Active" in both environments.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            <MyPrincipalCard />
            
            {/* Admin Diagnostics Section */}
            {diagnostics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Admin Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Internet Identity Principal:</p>
                    <p className="font-mono text-sm break-all">{identity?.getPrincipal().toString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Sees Your Principal As:</p>
                    <p className="font-mono text-sm break-all">{diagnostics.backendCallerPrincipal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Admin Check Result:</p>
                    <p className="font-mono text-sm">{diagnostics.backendReportsIsAdmin ? 'Admin ✓' : 'Not Admin ✗'}</p>
                  </div>
                  {diagnostics.backendAdminList.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Admin Principals in Backend:</p>
                      <ul className="mt-1 space-y-1">
                        {diagnostics.backendAdminList.map((admin, idx) => (
                          <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>
                  You don't have admin privileges. To request access, share your Principal ID (shown above) with an existing admin.
                </p>
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleRefreshAll}
              variant="outline"
              disabled={diagnosticsLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${diagnosticsLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - show full admin panel
  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Admin Panel</h1>
            <p className="mt-2 text-muted-foreground">
              Manage properties, inquiries, and admin access
            </p>
          </div>
          <Button
            onClick={handleRefreshAll}
            variant="outline"
            size="sm"
            disabled={diagnosticsLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${diagnosticsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-8">
          {/* Admin Status Card */}
          <Card className="border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="flex items-center gap-3 py-4">
              <ShieldCheck className="h-5 w-5 text-green-700 dark:text-green-300" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Admin Access Active</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You have full administrative privileges
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Deployment Environment Card */}
          {diagnostics && (
            <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Globe className="h-5 w-5" />
                  Deployment Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Environment:</p>
                  <p className="font-mono text-sm text-blue-900 dark:text-blue-100">{diagnostics.environmentLabel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Current URL:</p>
                  <p className="font-mono text-xs break-all text-blue-900 dark:text-blue-100">{diagnostics.currentOrigin}</p>
                </div>
                <Alert className="mt-3 border-blue-600 bg-blue-100 dark:bg-blue-900">
                  <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                  <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Testing Checklist:</strong> To verify admin access across deployments, log in as <code className="font-mono text-xs bg-blue-200 dark:bg-blue-800 px-1 rounded">fxms2-qslpu-4ybaz-kouy4-mpule-mqqq5-7grvy-gyikf-o6pvz-zqvgd-hqe</code> in BOTH your draft and production URLs and confirm this page shows "Admin Access Active" in both environments.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Principal ID Card */}
          <MyPrincipalCard />

          {/* Admin Diagnostics Section */}
          {diagnostics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Admin Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Internet Identity Principal:</p>
                  <p className="font-mono text-sm break-all">{identity?.getPrincipal().toString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Backend Sees Your Principal As:</p>
                  <p className="font-mono text-sm break-all">{diagnostics.backendCallerPrincipal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Backend Admin Check Result:</p>
                  <p className="font-mono text-sm">{diagnostics.backendReportsIsAdmin ? 'Admin ✓' : 'Not Admin ✗'}</p>
                </div>
                {diagnostics.backendAdminList.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Admin Principals in Backend:</p>
                    <ul className="mt-1 space-y-1">
                      {diagnostics.backendAdminList.map((admin, idx) => (
                        <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Admin Management Panel */}
          <AdminManagementPanel />

          <Separator />

          {/* Inquiries Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Customer Inquiries</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Inquiries</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load inquiries'}
                </AlertDescription>
              </Alert>
            ) : (
              <InquiryList inquiries={inquiries} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

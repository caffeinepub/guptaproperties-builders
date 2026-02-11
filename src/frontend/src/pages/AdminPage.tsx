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

  // Callback for AdminManagementPanel to trigger refresh after grant/revoke
  const handleAdminChange = () => {
    // Refresh admin status and diagnostics after successful grant/revoke
    refetchAdmin();
    refetchDiagnostics();
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
                  
                  {/* Backend Admin List - Always show with appropriate message */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Admin List:</p>
                    {diagnostics.backendAdminListStatus === 'loaded' && (
                      <ul className="mt-1 space-y-1">
                        {diagnostics.backendAdminList.map((admin, idx) => (
                          <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                        ))}
                      </ul>
                    )}
                    {diagnostics.backendAdminListStatus === 'empty' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        No admins were returned by the backend.
                      </p>
                    )}
                    {diagnostics.backendAdminListStatus === 'unauthorized' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        Access to admin list requires admin privileges.
                      </p>
                    )}
                    {diagnostics.backendAdminListStatus === 'unavailable' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        Admin list is not available from the backend.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Check Failed</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>

            <Button onClick={handleRefreshAll} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Admin Check
            </Button>
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
              Access restricted to administrators
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
                  
                  {/* Backend Admin List - Always show with appropriate message */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backend Admin List:</p>
                    {diagnostics.backendAdminListStatus === 'loaded' && (
                      <ul className="mt-1 space-y-1">
                        {diagnostics.backendAdminList.map((admin, idx) => (
                          <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                        ))}
                      </ul>
                    )}
                    {diagnostics.backendAdminListStatus === 'empty' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        No admins were returned by the backend.
                      </p>
                    )}
                    {diagnostics.backendAdminListStatus === 'unauthorized' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        Access to admin list requires admin privileges.
                      </p>
                    )}
                    {diagnostics.backendAdminListStatus === 'unavailable' && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        Admin list is not available from the backend.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Admin Access Required</AlertTitle>
              <AlertDescription>
                You need admin privileges to access this panel. Share your Principal ID with an existing admin to request access.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (adminLoading || diagnosticsLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Admin authenticated - show full admin panel
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
          <Button onClick={handleRefreshAll} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
        </div>

        <div className="space-y-8">
          {/* Admin Access Active Alert */}
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">Admin Access Active</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              You have full administrative privileges
            </AlertDescription>
          </Alert>

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
                
                {/* Backend Admin List - Always show with appropriate message */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Backend Admin List:</p>
                  {diagnostics.backendAdminListStatus === 'loaded' && (
                    <ul className="mt-1 space-y-1">
                      {diagnostics.backendAdminList.map((admin, idx) => (
                        <li key={idx} className="font-mono text-sm break-all">{admin}</li>
                      ))}
                    </ul>
                  )}
                  {diagnostics.backendAdminListStatus === 'empty' && (
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      No admins were returned by the backend.
                    </p>
                  )}
                  {diagnostics.backendAdminListStatus === 'unauthorized' && (
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      Access to admin list requires admin privileges.
                    </p>
                  )}
                  {diagnostics.backendAdminListStatus === 'unavailable' && (
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      Admin list is not available from the backend.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Admin Management Panel with refresh callback */}
          <AdminManagementPanel onAdminChange={handleAdminChange} />

          <Separator />

          {/* Inquiries Section */}
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Inquiries</h2>
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

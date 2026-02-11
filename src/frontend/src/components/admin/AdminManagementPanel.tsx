import { useState, useEffect } from 'react';
import { useGrantAdmin, useRevokeAdmin } from '../../hooks/useAdminManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Loader2, UserPlus, UserMinus, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface AdminManagementPanelProps {
  onAdminChange?: () => void;
}

export default function AdminManagementPanel({ onAdminChange }: AdminManagementPanelProps) {
  const [grantPrincipal, setGrantPrincipal] = useState('');
  const [revokePrincipal, setRevokePrincipal] = useState('');

  const grantMutation = useGrantAdmin();
  const revokeMutation = useRevokeAdmin();

  // Reset success/error states when input changes
  useEffect(() => {
    if (grantMutation.isSuccess || grantMutation.isError) {
      grantMutation.reset();
    }
  }, [grantPrincipal]);

  useEffect(() => {
    if (revokeMutation.isSuccess || revokeMutation.isError) {
      revokeMutation.reset();
    }
  }, [revokePrincipal]);

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantPrincipal.trim()) return;

    grantMutation.mutate(grantPrincipal.trim(), {
      onSuccess: () => {
        setGrantPrincipal('');
        // Notify parent to refresh admin status and diagnostics
        onAdminChange?.();
      },
    });
  };

  const handleRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokePrincipal.trim()) return;

    revokeMutation.mutate(revokePrincipal.trim(), {
      onSuccess: () => {
        setRevokePrincipal('');
        // Notify parent to refresh admin status and diagnostics
        onAdminChange?.();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Management</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant or revoke admin access for users
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How to manage admins</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p className="text-sm">
            To grant or revoke admin access, you need the user's Principal ID. Users can find their Principal ID
            by logging in and visiting this admin page.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Grant Admin Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Grant Admin Access
            </CardTitle>
            <CardDescription>
              Add a new admin by entering their Principal ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGrant} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grant-principal">Principal ID</Label>
                <Input
                  id="grant-principal"
                  value={grantPrincipal}
                  onChange={(e) => setGrantPrincipal(e.target.value)}
                  placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                  disabled={grantMutation.isPending}
                />
              </div>

              {grantMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {grantMutation.error instanceof Error
                      ? grantMutation.error.message
                      : 'Failed to grant admin access'}
                  </AlertDescription>
                </Alert>
              )}

              {grantMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Admin access granted successfully</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={grantMutation.isPending || !grantPrincipal.trim()}
                className="w-full"
              >
                {grantMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Granting...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Grant Admin Access
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Revoke Admin Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5" />
              Revoke Admin Access
            </CardTitle>
            <CardDescription>
              Remove admin privileges from a user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRevoke} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revoke-principal">Principal ID</Label>
                <Input
                  id="revoke-principal"
                  value={revokePrincipal}
                  onChange={(e) => setRevokePrincipal(e.target.value)}
                  placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                  disabled={revokeMutation.isPending}
                />
              </div>

              {revokeMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {revokeMutation.error instanceof Error
                      ? revokeMutation.error.message
                      : 'Failed to revoke admin access'}
                  </AlertDescription>
                </Alert>
              )}

              {revokeMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Admin access revoked successfully</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                variant="destructive"
                disabled={revokeMutation.isPending || !revokePrincipal.trim()}
                className="w-full"
              >
                {revokeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Revoke Admin Access
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

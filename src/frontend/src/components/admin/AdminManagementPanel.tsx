import { useState } from 'react';
import { useGrantAdmin, useRevokeAdmin } from '../../hooks/useAdminManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { UserPlus, UserMinus, Loader2, AlertCircle } from 'lucide-react';

export default function AdminManagementPanel() {
  const [principalInput, setPrincipalInput] = useState('');
  const grantAdmin = useGrantAdmin();
  const revokeAdmin = useRevokeAdmin();

  const handleGrant = async () => {
    if (!principalInput.trim()) {
      return;
    }

    try {
      await grantAdmin.mutateAsync(principalInput.trim());
      setPrincipalInput('');
    } catch (error) {
      console.error('Failed to grant admin:', error);
    }
  };

  const handleRevoke = async () => {
    if (!principalInput.trim()) {
      return;
    }

    if (!window.confirm('Are you sure you want to revoke admin access for this user?')) {
      return;
    }

    try {
      await revokeAdmin.mutateAsync(principalInput.trim());
      setPrincipalInput('');
    } catch (error) {
      console.error('Failed to revoke admin:', error);
    }
  };

  const isLoading = grantAdmin.isPending || revokeAdmin.isPending;
  const error = grantAdmin.error || revokeAdmin.error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>
          Grant or revoke admin access for users. The user must share their Principal ID with you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To make someone an admin: Ask them to log in to this site, copy their Principal ID
            (shown in "Your Principal ID" section), and share it with you. Then paste it below and
            click "Grant Admin Access".
          </AlertDescription>
        </Alert>

        <Separator />

        <div className="space-y-3">
          <div>
            <Label htmlFor="principal-input">User Principal ID</Label>
            <Input
              id="principal-input"
              type="text"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              placeholder="Enter Principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGrant}
              disabled={!principalInput.trim() || isLoading}
              className="flex-1"
            >
              {grantAdmin.isPending ? (
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

            <Button
              onClick={handleRevoke}
              disabled={!principalInput.trim() || isLoading}
              variant="destructive"
              className="flex-1"
            >
              {revokeAdmin.isPending ? (
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
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'An error occurred'}
              </AlertDescription>
            </Alert>
          )}

          {grantAdmin.isSuccess && (
            <Alert>
              <AlertDescription className="text-green-600">
                Admin access granted successfully!
              </AlertDescription>
            </Alert>
          )}

          {revokeAdmin.isSuccess && (
            <Alert>
              <AlertDescription className="text-green-600">
                Admin access revoked successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

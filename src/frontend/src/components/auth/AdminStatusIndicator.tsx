import { RefreshCw } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function AdminStatusIndicator() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false, isLoading, refetch, isFetching } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  // Don't show anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          Checking...
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
        {isAdmin ? 'Admin' : 'Not admin'}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => refetch()}
        disabled={isFetching}
        title="Refresh admin status"
      >
        <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}

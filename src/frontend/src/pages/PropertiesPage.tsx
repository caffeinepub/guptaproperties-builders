import { useEffect, useState } from 'react';
import { usePropertyListings } from '../hooks/usePropertyListings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import PropertyList from '../components/properties/PropertyList';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Loader2, Lock, AlertCircle } from 'lucide-react';

export default function PropertiesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { properties, isLoading } = usePropertyListings();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const [showEditor, setShowEditor] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    document.title = 'Properties - GuptaProperties&Builders';
  }, []);

  const handleAddProperty = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Our Properties</h1>
            <p className="mt-2 text-muted-foreground">
              Browse our collection of premium properties
            </p>
          </div>

          {!adminLoading && isAdmin && (
            <Alert className="sm:hidden">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Property management features have been temporarily disabled
              </AlertDescription>
            </Alert>
          )}
        </div>

        {!adminLoading && isAdmin && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Note: Backend property management has been removed. Only seed properties are displayed.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <PropertyList properties={properties} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
}

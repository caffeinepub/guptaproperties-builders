import { useEffect, useState } from 'react';
import { usePropertyListings, useCreateProperty, useUpdateProperty, useDeleteProperty } from '../hooks/usePropertyListings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import PropertyList from '../components/properties/PropertyList';
import InlinePropertyForm from '../components/properties/InlinePropertyForm';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Loader2, AlertCircle, Shield, Info } from 'lucide-react';

export default function PropertiesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { properties, isLoading, error: fetchError } = usePropertyListings();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();
  const [showAddForm, setShowAddForm] = useState(false);

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    document.title = 'Properties - GuptaProperties&Builders';
  }, []);

  // Close add form on successful creation
  useEffect(() => {
    if (createMutation.isSuccess) {
      setShowAddForm(false);
      createMutation.reset();
    }
  }, [createMutation.isSuccess]);

  // Close edit mode on successful update
  useEffect(() => {
    if (updateMutation.isSuccess) {
      updateMutation.reset();
    }
  }, [updateMutation.isSuccess]);

  const handleAddProperty = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setShowAddForm(true);
  };

  const handleCreateSave = (data: {
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: string | null;
  }) => {
    createMutation.mutate(data);
  };

  const handleUpdateSave = (data: {
    id: bigint;
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: string | null;
  }) => {
    updateMutation.mutate(data);
  };

  const handleDelete = (id: bigint) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Properties</h1>
        <p className="text-muted-foreground">Browse our available properties</p>
      </div>

      {fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* Show guidance for authenticated non-admins */}
      {isAuthenticated && !adminLoading && !isAdmin && (
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Admin Access Required</AlertTitle>
          <AlertDescription>
            You are logged in but do not have admin access. Property management (adding, editing, and deleting listings) is restricted to administrators only.
            {' '}
            <span className="font-medium">To request admin access, visit the Admin page and share your Principal ID with an existing administrator.</span>
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && (
        <div className="mb-6">
          {!showAddForm ? (
            <Button onClick={handleAddProperty} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </>
              )}
            </Button>
          ) : (
            <InlinePropertyForm
              onSave={handleCreateSave}
              onCancel={() => setShowAddForm(false)}
              isSaving={createMutation.isPending}
              error={createMutation.error ? (createMutation.error as Error).message : null}
            />
          )}
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <PropertyList
          properties={properties}
          isAdmin={isAdmin}
          onUpdate={handleUpdateSave}
          onDelete={handleDelete}
          updatingId={updateMutation.isPending && updateMutation.variables ? updateMutation.variables.id : null}
          deletingId={deleteMutation.isPending && deleteMutation.variables ? deleteMutation.variables : null}
          updateError={updateMutation.error ? (updateMutation.error as Error).message : null}
        />
      )}
    </div>
  );
}

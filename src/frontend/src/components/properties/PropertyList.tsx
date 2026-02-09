import PropertyCard from './PropertyCard';
import { Card, CardContent } from '../ui/card';
import { Home } from 'lucide-react';
import type { Property } from '../../backend';

interface PropertyListProps {
  properties: Property[];
  isAdmin: boolean;
  onUpdate?: (data: {
    id: bigint;
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: string | null;
  }) => void;
  onDelete?: (id: bigint) => void;
  updatingId?: bigint | null;
  deletingId?: bigint | null;
  updateError?: string | null;
}

export default function PropertyList({
  properties,
  isAdmin,
  onUpdate,
  onDelete,
  updatingId = null,
  deletingId = null,
  updateError = null,
}: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
          <Home className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No Properties Available</h3>
          <p className="text-center text-muted-foreground">
            {isAdmin 
              ? 'Click "Add Property" above to create your first listing' 
              : 'Check back soon for new listings. Only administrators can add properties.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id.toString()}
          property={property}
          isAdmin={isAdmin}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isUpdating={updatingId === property.id}
          isDeleting={deletingId === property.id}
          updateError={updatingId === property.id ? updateError : null}
        />
      ))}
    </div>
  );
}

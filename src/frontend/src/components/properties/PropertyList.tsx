import PropertyCard from './PropertyCard';
import { Card, CardContent } from '../ui/card';
import { Home } from 'lucide-react';
import type { Property } from '../../types';

interface PropertyListProps {
  properties: Property[];
  isAdmin: boolean;
}

export default function PropertyList({ properties, isAdmin }: PropertyListProps) {
  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
          <Home className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No Properties Available</h3>
          <p className="text-center text-muted-foreground">
            Check back soon for new listings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isAdmin={isAdmin}
          isCustomProperty={false}
        />
      ))}
    </div>
  );
}

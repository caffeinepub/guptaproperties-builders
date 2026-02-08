import { useState } from 'react';
import PropertyImageGallery from './PropertyImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, IndianRupee, Edit, Trash2 } from 'lucide-react';
import type { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  isAdmin: boolean;
  isCustomProperty: boolean;
}

export default function PropertyCard({ property, isAdmin, isCustomProperty }: PropertyCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    // Edit functionality disabled - backend removed
    console.log('Edit disabled - backend property management removed');
  };

  const handleDelete = () => {
    // Delete functionality disabled - backend removed
    console.log('Delete disabled - backend property management removed');
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <PropertyImageGallery images={property.images} title={property.title} />
      
      <CardHeader>
        <CardTitle className="line-clamp-2">{property.title}</CardTitle>
        {property.location && (
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {property.location}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {property.price && (
          <div className="flex items-center gap-1 text-xl font-bold text-primary">
            <IndianRupee className="h-5 w-5" />
            {property.price}
          </div>
        )}

        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
          {property.description}
        </p>

        {isAdmin && isCustomProperty && (
          <div className="flex gap-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1"
              disabled
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1"
              disabled
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

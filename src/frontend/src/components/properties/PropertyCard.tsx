import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Edit, Trash2, MapPin, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import PropertyImageGallery from './PropertyImageGallery';
import InlinePropertyForm from './InlinePropertyForm';
import { getEmbedUrl } from '../../utils/youtube';
import { useChunkedVideoPlayback } from '../../hooks/useChunkedVideoPlayback';
import { getVideoType } from '../../types/propertyVideo';
import type { Property, ExternalBlob } from '../../backend';

interface PropertyCardProps {
  property: Property;
  onUpdate?: (data: {
    id: bigint;
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: ExternalBlob | string | null;
  }) => void;
  onDelete?: (id: bigint) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  updateError?: string | null;
  deleteError?: string | null;
  isAdmin?: boolean;
}

export default function PropertyCard({
  property,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  updateError = null,
  deleteError = null,
  isAdmin = false,
}: PropertyCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (data: {
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: ExternalBlob | string | null;
  }) => {
    if (onUpdate) {
      onUpdate({
        id: property.id,
        ...data,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this property?')) {
      onDelete(property.id);
    }
  };

  // Determine video type
  const videoType = getVideoType(property.video);
  const videoPlayback = useChunkedVideoPlayback(
    videoType.type === 'uploaded' ? videoType.blob : null
  );

  if (isEditing) {
    return (
      <InlinePropertyForm
        property={property}
        onSave={handleUpdate}
        onCancel={() => setIsEditing(false)}
        isSaving={isUpdating}
        error={updateError}
      />
    );
  }

  const embedUrl = videoType.type === 'youtube' ? getEmbedUrl(videoType.url) : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{property.title}</CardTitle>
          {isAdmin && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={isUpdating || isDeleting}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isUpdating || isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Messages */}
        {(updateError || deleteError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{updateError || deleteError}</AlertDescription>
          </Alert>
        )}

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <PropertyImageGallery images={property.images} title={property.title} />
        )}

        {/* Video Section */}
        {videoType.type === 'youtube' && embedUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              title="Property video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {videoType.type === 'uploaded' && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {videoPlayback.isLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {videoPlayback.error && (
              <div className="flex h-full items-center justify-center p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{videoPlayback.error}</AlertDescription>
                </Alert>
              </div>
            )}
            {videoPlayback.objectUrl && !videoPlayback.isLoading && !videoPlayback.error && (
              <video
                src={videoPlayback.objectUrl}
                controls
                className="h-full w-full"
                onError={() => {
                  console.error('Video playback error');
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        {/* Property Details */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{property.description}</p>

          <div className="flex flex-wrap gap-2">
            {property.price && (
              <Badge variant="secondary" className="gap-1">
                <DollarSign className="h-3 w-3" />
                ₹{property.price.toString()}
              </Badge>
            )}
            {property.location && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {property.location}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

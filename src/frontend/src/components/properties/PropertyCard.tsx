import { useState } from 'react';
import PropertyImageGallery from './PropertyImageGallery';
import InlinePropertyForm from './InlinePropertyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { MapPin, IndianRupee, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { getYouTubeEmbedUrl, isYouTubeUrl } from '../../utils/youtube';
import type { Property } from '../../backend';

interface PropertyCardProps {
  property: Property;
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
  isUpdating?: boolean;
  isDeleting?: boolean;
  updateError?: string | null;
}

export default function PropertyCard({
  property,
  isAdmin,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  updateError = null,
}: PropertyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (data: {
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: string | null;
  }) => {
    if (onUpdate) {
      onUpdate({
        id: property.id,
        ...data,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(property.id);
    }
    setShowDeleteConfirm(false);
  };

  // Render video component with improved error handling
  const renderVideo = () => {
    if (!property.video) return null;

    // Check if it's a YouTube URL
    if (isYouTubeUrl(property.video)) {
      const embedUrl = getYouTubeEmbedUrl(property.video);
      if (embedUrl) {
        return (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <iframe
              src={embedUrl}
              title="Property video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      } else {
        return (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Unable to load YouTube video. Please check the URL.</AlertDescription>
          </Alert>
        );
      }
    }

    // Check if it's a data URL (uploaded video)
    if (property.video.startsWith('data:video/')) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-black">
          <video
            src={property.video}
            controls
            className="h-full w-full"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Invalid video format
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid video format. Videos must be YouTube URLs or uploaded video files.
        </AlertDescription>
      </Alert>
    );
  };

  // Show form when editing
  if (isEditing) {
    return (
      <InlinePropertyForm
        property={property}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isUpdating}
        error={updateError}
      />
    );
  }

  // Show normal card when not editing
  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        {property.video ? renderVideo() : <PropertyImageGallery images={property.images} title={property.title} />}
        
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
              {property.price.toString()}
            </div>
          )}

          <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
            {property.description}
          </p>

          {/* Show image gallery below description if video is present */}
          {property.video && property.images.length > 0 && (
            <div className="border-t pt-4">
              <PropertyImageGallery images={property.images} title={property.title} />
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2 border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1"
                disabled={isUpdating || isDeleting}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1"
                disabled={isUpdating || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{property.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Link as LinkIcon, Upload, Loader2 } from 'lucide-react';
import type { Property } from '../../data/siteData';

interface PropertyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Omit<Property, 'id'>) => void;
  property: Property | null;
  isSaving?: boolean;
}

export default function PropertyEditorModal({
  isOpen,
  onClose,
  onSave,
  property,
  isSaving = false,
}: PropertyEditorModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setPrice(property.price || '');
      setLocation(property.location || '');
      setDescription(property.description);
      setImages(property.images);
    } else {
      setTitle('');
      setPrice('');
      setLocation('');
      setDescription('');
      setImages([]);
    }
    setNewImageUrl('');
  }, [property, isOpen]);

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    onSave({
      title: title.trim(),
      price: price.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim(),
      images,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-2xl font-semibold text-card-foreground">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
                Property Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                placeholder="e.g., 3 BHK Luxury Apartment"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-foreground">
                  Price
                </label>
                <input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSaving}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  placeholder="e.g., ₹85 Lakhs"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSaving}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  placeholder="e.g., Uttam Nagar, New Delhi"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                placeholder="Describe the property features, amenities, etc."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Images</label>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                    disabled={isSaving}
                    className="flex h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={isSaving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Add URL
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isSaving}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isSaving ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Upload from Device
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="group relative aspect-video overflow-hidden rounded-md border border-border">
                        <img
                          src={img}
                          alt={`Property ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSaving}
                          className="absolute right-1 top-1 rounded-md bg-destructive p-1.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                          aria-label="Remove image"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{property ? 'Update Property' : 'Add Property'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

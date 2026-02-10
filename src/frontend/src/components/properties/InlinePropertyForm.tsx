import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { X, Plus, Upload, Loader2, AlertCircle, Video, Link as LinkIcon } from 'lucide-react';
import { Progress } from '../ui/progress';
import { fileToDataUrl } from '../../utils/fileToDataUrl';
import { useChunkedVideoUpload } from '../../hooks/useChunkedVideoUpload';
import { isYouTubeUrl } from '../../utils/youtube';
import type { Property, ExternalBlob } from '../../backend';

interface InlinePropertyFormProps {
  property?: Property;
  onSave: (data: {
    title: string;
    description: string;
    price: bigint | null;
    location: string | null;
    images: string[];
    video: ExternalBlob | string | null;
  }) => void;
  onCancel: () => void;
  isSaving?: boolean;
  error?: string | null;
}

export default function InlinePropertyForm({
  property,
  onSave,
  onCancel,
  isSaving = false,
  error = null,
}: InlinePropertyFormProps) {
  const [title, setTitle] = useState(property?.title || '');
  const [description, setDescription] = useState(property?.description || '');
  const [price, setPrice] = useState(property?.price ? property.price.toString() : '');
  const [location, setLocation] = useState(property?.location || '');
  const [images, setImages] = useState<string[]>(property?.images || []);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video state
  const [video, setVideo] = useState<ExternalBlob | string | null>(property?.video || null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadVideo, progress, reset: resetUpload } = useChunkedVideoUpload();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(imageUrl);
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
      setUploadError(null);
    } catch {
      setUploadError('Please enter a valid URL');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const dataUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await fileToDataUrl(files[i]);
        dataUrls.push(dataUrl);
      }
      setImages([...images, ...dataUrls]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim()) return;
    
    setVideoError(null);
    
    // Check if it's a YouTube URL
    if (isYouTubeUrl(videoUrl)) {
      setVideo(videoUrl.trim());
      setVideoUrl('');
    } else {
      setVideoError('Please enter a valid YouTube URL (youtube.com or youtu.be)');
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    resetUpload();

    try {
      const blob = await uploadVideo(file);
      setVideo(blob);
    } catch (err: any) {
      setVideoError(err.message || 'Failed to upload video');
    } finally {
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setVideoUrl('');
    setVideoError(null);
    resetUpload();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }
    if (!description.trim()) {
      setValidationError('Description is required');
      return;
    }

    // Validate video format if present (YouTube URL only for string type)
    if (video && typeof video === 'string' && !isYouTubeUrl(video)) {
      setValidationError('Invalid video format. Please use a YouTube URL or upload a video file.');
      return;
    }

    const priceValue = price.trim() ? BigInt(price.trim()) : null;
    const locationValue = location.trim() || null;

    onSave({
      title: title.trim(),
      description: description.trim(),
      price: priceValue,
      location: locationValue,
      images,
      video,
    });
  };

  const isUploadingVideo = progress.isUploading;
  const videoUploadPercentage = progress.percentage;

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {(validationError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError || error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Property title"
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Property description"
              rows={4}
              disabled={isSaving}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price in rupees"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Property location"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            
            {/* Image URL Input */}
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                disabled={isSaving || isUploading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImageUrl}
                disabled={isSaving || isUploading || !imageUrl.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isSaving || isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((img, index) => (
                  <div key={index} className="group relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isSaving}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Video (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Add one video via YouTube URL or upload a video file (any size supported)
            </p>
            
            {!video ? (
              <>
                {/* YouTube URL Input */}
                <div className="flex gap-2">
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter YouTube URL"
                    disabled={isSaving || isUploadingVideo}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddVideoUrl();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddVideoUrl}
                    disabled={isSaving || isUploadingVideo || !videoUrl.trim()}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Video File Upload */}
                <div>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                    disabled={isSaving || isUploadingVideo}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={isSaving || isUploadingVideo}
                    className="w-full"
                  >
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading Video...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </div>

                {/* Upload Progress */}
                {isUploadingVideo && (
                  <div className="space-y-2">
                    <Progress value={videoUploadPercentage} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {videoUploadPercentage}% uploaded
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {typeof video === 'string' ? 'YouTube Video' : 'Uploaded Video'}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {typeof video === 'string' && (
                  <p className="mt-2 truncate text-xs text-muted-foreground">{video}</p>
                )}
              </div>
            )}

            {videoError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{videoError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-2 border-t pt-4">
            <Button
              type="submit"
              disabled={isSaving || isUploading || isUploadingVideo}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving || isUploading || isUploadingVideo}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

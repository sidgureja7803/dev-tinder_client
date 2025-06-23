import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

// Individual sortable image component
const SortableImageItem = ({ id, image, index, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all duration-300"
    >
      <div className="aspect-square">
        <img
          src={image.url}
          alt={`Upload ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      
      {/* Primary badge */}
      {image.isPrimary && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          Primary
        </div>
      )}
      
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
      >
        <i className="fas fa-times text-sm"></i>
      </button>
      
      {/* Drag handle */}
      <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm text-white rounded p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <i className="fas fa-grip-vertical text-sm"></i>
      </div>
    </div>
  );
};

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle file upload
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      return {
        url: response.data.data.url,
        publicId: response.data.data.publicId,
        isPrimary: images.length === 0, // First image is primary
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  // Handle multiple file uploads
  const onDrop = useCallback(async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxImages) {
      setUploadError(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const uploadPromises = acceptedFiles.map(uploadImage);
      const uploadedImages = await Promise.all(uploadPromises);

      setImages(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, setImages]);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: maxImages - images.length,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  });

  // Handle drag end for reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.url === active.id);
        const newIndex = items.findIndex(item => item.url === over.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update primary status - first image is always primary
        return newArray.map((item, index) => ({
          ...item,
          isPrimary: index === 0
        }));
      });
    }
  };

  // Handle image deletion
  const handleDelete = async (index) => {
    const imageToDelete = images[index];
    
    try {
      // Delete from Cloudinary
      if (imageToDelete.publicId) {
        await axios.delete(`${BASE_URL}/upload/image/${imageToDelete.publicId}`, {
          withCredentials: true,
        });
      }
      
      // Remove from local state
      const newImages = images.filter((_, i) => i !== index);
      
      // Update primary status - first image is always primary
      const updatedImages = newImages.map((item, index) => ({
        ...item,
        isPrimary: index === 0
      }));
      
      setImages(updatedImages);
    } catch (error) {
      console.error('Delete error:', error);
      setUploadError('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-pink-500 bg-pink-500/10'
              : 'border-white/30 hover:border-pink-500/50 hover:bg-white/5'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="text-4xl">
              {uploading ? (
                <i className="fas fa-spinner fa-spin text-pink-500"></i>
              ) : (
                <i className="fas fa-cloud-upload-alt text-white/60"></i>
              )}
            </div>
            
            <div>
              <p className="text-white font-medium mb-1">
                {uploading
                  ? 'Uploading images...'
                  : isDragActive
                  ? 'Drop images here'
                  : 'Drag & drop images here, or click to select'
                }
              </p>
              <p className="text-white/60 text-sm">
                PNG, JPG, JPEG, WEBP up to 5MB each • {images.length}/{maxImages} uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
          {uploadError}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">
              Your Photos ({images.length}/{maxImages})
            </h3>
            <p className="text-sm text-white/60">
              Drag to reorder • First photo will be your primary photo
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(img => img.url)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <SortableImageItem
                    key={image.url}
                    id={image.url}
                    image={image}
                    index={index}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <div className="text-center text-white/60 text-sm space-y-2">
          <p>📸 Add photos to make your profile stand out!</p>
          <p>The first photo you upload will be your primary profile photo.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 
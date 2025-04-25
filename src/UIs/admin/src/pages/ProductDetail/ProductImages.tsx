import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductDetailDto, UpdateProductImagesDto } from '../../types';
import { updateProductImagesFn } from '../../services/productDetail';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ProductImagesProps {
  product: ProductDetailDto;
  isEditMode: boolean;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  isEditMode,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

  // Image handling states
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]); // now holds IDs
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [defaultImageUrl, setDefaultImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [defaultImageIndexInAdding, setDefaultImageIndexInAdding] = useState<
    number | undefined
  >(undefined);

  // Initialize mainImageIndex to point to the default image
  useEffect(() => {
    if (product.defaultImageUrl) {
      const defaultIndex = product.images.findIndex(
        (img) => img.imageUrl === product.defaultImageUrl,
      );

      if (defaultIndex !== -1) {
        setMainImageIndex(defaultIndex);
      }
    }
  }, [product.images, product.defaultImageUrl]);

  // Set initial default image based on the first product image
  useEffect(() => {
    if (
      product.images.length > 0 &&
      mainImageIndex >= 0 &&
      mainImageIndex < product.images.length
    ) {
      setDefaultImageUrl(product.images[mainImageIndex].imageUrl);
    }
  }, [product.images, mainImageIndex]);

  // Prepare sorted images with default image prioritized
  const sortedProductImages = useMemo(() => {
    const images = [...product.images];

    // Find default image and prioritize it
    const defaultImageIndex = images.findIndex(
      (img) => img.imageUrl === product.defaultImageUrl,
    );

    if (defaultImageIndex !== -1) {
      // Create a copy of the default image with priority 0
      const defaultImage = { ...images[defaultImageIndex], orderPriority: 0 };

      // Remove the original and insert the modified one
      images.splice(defaultImageIndex, 1);
      images.unshift(defaultImage);
    }

    return images;
  }, [product.images, product.defaultImageUrl]);

  // Mutation for updating product images
  const updateProductImagesMutation = useMutation({
    mutationFn: updateProductImagesFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['productDetail', product.slug],
      });

      // Reset states after successful update
      resetImageStates();
      toast('Images updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating images:', error);
      toast('Failed to update images. Please try again.');
      setIsSaving(false);
    },
  });

  const resetImageStates = () => {
    setNewImages([]);
    setNewImagePreviews([]);
    setImagesToRemove([]);
    setDefaultImageUrl(undefined);
    setDefaultImageIndexInAdding(undefined);
    setIsSaving(false);
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const filesArray = Array.from(files);
    setNewImages((prev) => [...prev, ...filesArray]);

    // Create previews for the new images
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    if (defaultImageIndexInAdding === index) {
      setDefaultImageIndexInAdding(undefined);
    } else if (
      defaultImageIndexInAdding !== undefined &&
      defaultImageIndexInAdding > index
    ) {
      // Adjust default image index if we're removing an image before it
      setDefaultImageIndexInAdding(defaultImageIndexInAdding - 1);
    }

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRemoveExistingImage = (imageId: string) => {
    // If we're unmarking an image for removal, always allow it
    if (imagesToRemove.includes(imageId)) {
      setImagesToRemove((prev) => prev.filter((id) => id !== imageId));
      return;
    }

    // Check if removing this image would leave us with no images
    const remainingExistingImagesCount =
      product.images.length - imagesToRemove.length - 1;
    const totalRemainingImages =
      remainingExistingImagesCount + newImages.length;

    // Don't allow removal if it would result in zero remaining images
    if (totalRemainingImages === 0) {
      toast.warning(
        'Cannot remove the last image. Product must have at least one image.',
      );
      return;
    }

    const url = product.images.find((img) => img.id === imageId)?.imageUrl;
    const imageIndex = product.images.findIndex((img) => img.id === imageId);

    // Check if this is the currently displayed image
    if (imageIndex === mainImageIndex) {
      // Find the first non-removed image to display instead
      const nextValidImageIndex = product.images.findIndex(
        (img, idx) => idx !== imageIndex && !imagesToRemove.includes(img.id),
      );

      // If found, set it as the main image
      if (nextValidImageIndex !== -1) {
        setMainImageIndex(nextValidImageIndex);
      }
      // Otherwise check for new images
      else if (newImagePreviews.length > 0) {
        setMainImageIndex(-1); // Show the first new image
      }
    }

    if (defaultImageUrl === url) {
      // Auto-select new default image if the current default is removed
      const remainingImages = product.images.filter(
        (img) => img.id !== imageId && !imagesToRemove.includes(img.id),
      );

      if (remainingImages.length > 0) {
        // Select first remaining image as default
        setDefaultImageUrl(remainingImages[0].imageUrl);
      } else if (newImages.length > 0) {
        // If no existing images remain, set first new image as default
        setDefaultImageIndexInAdding(0);
        setDefaultImageUrl(undefined);
      }
    }

    setImagesToRemove((prev) => [...prev, imageId]);
  };

  const handleUpdateImage = async () => {
    if (!isEditMode) return;

    // If no changes, just open the file upload dialog
    if (noChangesDetected()) {
      handleImageUpload();
      return;
    }

    setIsSaving(true);

    try {
      const addImagesOrderPriority = newImages.map(
        (_, index) => product.images.length + index + 1,
      );

      const imageUpdateData: UpdateProductImagesDto = {
        productId: product.id.toString(),
        addImages: newImages.length > 0 ? newImages : undefined,
        addImagesOrderPriority:
          newImages.length > 0 ? addImagesOrderPriority : undefined,
        removeImageIds: imagesToRemove.length > 0 ? imagesToRemove : undefined,
        defaultImageUrl,
        defaultImageIndexInAdding,
      };

      await updateProductImagesMutation.mutateAsync(imageUpdateData);
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  const noChangesDetected = () => {
    return (
      newImages.length === 0 &&
      imagesToRemove.length === 0 &&
      !defaultImageUrl &&
      defaultImageIndexInAdding === undefined
    );
  };

  const scrollToThumbnail = (index: number) => {
    const container = document.getElementById('thumbnailContainer');
    const thumbnail = document.getElementById(`thumbnail-${index}`);

    if (container && thumbnail) {
      // Calculate positioning to center the clicked thumbnail
      const containerHeight = container.clientHeight;
      const thumbnailTop = thumbnail.offsetTop;
      const thumbnailHeight = thumbnail.clientHeight;

      // Calculate the scroll position that centers the thumbnail
      const scrollPosition =
        thumbnailTop - containerHeight / 2 + thumbnailHeight / 2;

      // Smooth scroll to the calculated position
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const renderThumbnailControls = (
    isNewImage: boolean,
    index: number,
    imageId?: string,
  ) => {
    if (!isEditMode) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Remove/Toggle Button - Positioned in top-right corner */}
        <button
          className={`p-1 ${
            isNewImage
              ? 'bg-red-500'
              : imagesToRemove.includes(imageId!)
                ? 'bg-green-500'
                : 'bg-red-500'
          } rounded-full absolute top-1 right-1`}
          onClick={(e) => {
            e.stopPropagation();
            isNewImage
              ? removeNewImage(index)
              : toggleRemoveExistingImage(imageId!);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {!isNewImage && imagesToRemove.includes(imageId!) ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            )}
          </svg>
        </button>
      </div>
    );
  };

  const renderMainImage = () => {
    if (mainImageIndex >= 0 && mainImageIndex < product.images.length) {
      return (
        <img
          src={product.images[mainImageIndex].imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
      );
    } else if (mainImageIndex < 0 && newImagePreviews.length > 0) {
      return (
        <img
          src={newImagePreviews[Math.abs(mainImageIndex) - 1]}
          alt="New product image"
          className="w-full h-full object-cover rounded"
        />
      );
    } else if (newImagePreviews.length > 0) {
      return (
        <img
          src={newImagePreviews[0]}
          alt="New product image"
          className="w-full h-full object-cover rounded"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">No image available</p>
        </div>
      );
    }
  };

  return (
    <div className="md:col-span-6 grid grid-cols-7">
      {/* Thumbnail Images - Left side */}
      <div className="col-span-1 relative">
        <div
          className="overflow-y-auto pr-2 scrollbar-thin rounded aspect-[1/6]
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-neutral-700
          [&::-webkit-scrollbar-thumb]:bg-neutral-500"
          id="thumbnailContainer"
        >
          <div className="flex flex-col gap-2">
            {/* Add Image Button (Edit Mode Only) */}
            {isEditMode && (
              <div
                className="cursor-pointer rounded-lg mr-2 aspect-square border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                onClick={handleImageUpload}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}

            {/* All Active Product Images (including default) */}
            {sortedProductImages
              .filter((image) => !imagesToRemove.includes(image.id))
              .sort((a, b) => (a.orderPriority || 0) - (b.orderPriority || 0))
              .map((image, index) => {
                const actualIndex = product.images.findIndex(
                  (img) => img.id === image.id,
                );
                return (
                  <div
                    key={image.id}
                    id={`thumbnail-${actualIndex}`}
                    className={`cursor-pointer rounded-lg mr-2 aspect-square ${
                      isEditMode ? 'relative group' : ''
                    }`}
                    onClick={() => {
                      setMainImageIndex(actualIndex);
                      scrollToThumbnail(actualIndex);
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className={`object-cover w-full h-full rounded-lg border-2 ${
                        actualIndex === mainImageIndex
                          ? 'border-blue-600'
                          : image.imageUrl === defaultImageUrl ||
                              (!defaultImageUrl &&
                                mainImageIndex === actualIndex)
                            ? 'border-yellow-500'
                            : 'border-gray-200'
                      }`}
                    />
                    {renderThumbnailControls(false, actualIndex, image.id)}
                  </div>
                );
              })}

            {/* New Image Thumbnails */}
            {newImagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className="cursor-pointer rounded-lg mr-2 aspect-square relative group"
                onClick={() => setMainImageIndex(-1 - index)}
              >
                <img
                  src={preview}
                  alt={`New upload ${index + 1}`}
                  className={`object-cover w-full h-full rounded-lg border-2 ${
                    defaultImageIndexInAdding === index
                      ? 'border-yellow-500'
                      : 'border-green-400'
                  }`}
                />
                {renderThumbnailControls(true, index)}
              </div>
            ))}

            {/* Images marked for removal (at the bottom) */}
            {sortedProductImages
              .filter((image) => imagesToRemove.includes(image.id))
              .sort((a, b) => (a.orderPriority || 0) - (b.orderPriority || 0))
              .map((image, index) => {
                const actualIndex = product.images.findIndex(
                  (img) => img.id === image.id,
                );
                return (
                  <div
                    key={`removing-${image.id}`}
                    id={`thumbnail-${actualIndex}`}
                    className={`cursor-pointer rounded-lg mr-2 aspect-square ${
                      isEditMode ? 'relative group' : ''
                    }`}
                    onClick={() => {
                      setMainImageIndex(actualIndex);
                      scrollToThumbnail(actualIndex);
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} thumbnail ${index + 1} (removing)`}
                      className="object-cover w-full h-full rounded-lg border-2 border-red-500 opacity-50"
                    />
                    {renderThumbnailControls(false, actualIndex, image.id)}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Main Product Image - Right side */}
      <div className="col-span-6 bg-white p-4 rounded-lg shadow aspect-square relative">
        {renderMainImage()}

        {/* Save Button - only show in edit mode */}
        {isEditMode && (
          <button
            onClick={handleUpdateImage}
            className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg flex items-center justify-center"
            title="Save image"
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span className="ml-1">Save</span>
              </>
            )}
          </button>
        )}

        {/* Default image indicator */}
        {isEditMode &&
          (defaultImageUrl || defaultImageIndexInAdding !== undefined) && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-lg shadow-lg">
              Default Image
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductImages;

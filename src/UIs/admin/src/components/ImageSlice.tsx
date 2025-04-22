import { useState } from 'react';
import { FiChevronLeft } from 'react-icons/fi';

interface ImageSliceProps {
  images: string[];
  alt: string;
  className?: string;
}

const ImageSlice: React.FC<ImageSliceProps> = ({
  images,
  alt,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="image-slice__empty">No images available</div>;
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`image-slice ${className}`}>
      <div className="image-slice__main">
        <button
          className="image-slice__nav-button image-slice__nav-button--prev"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="image-slice__image-container">
          <img
            src={images[currentIndex]}
            alt={`${alt} - image ${currentIndex + 1}`}
            className="image-slice__image"
          />
        </div>

        <button
          className="image-slice__nav-button image-slice__nav-button--next"
          onClick={handleNext}
          aria-label="Next image"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>

      <div className="image-slice__thumbnails">
        {images.map((image, index) => (
          <button
            key={index}
            className={`image-slice__thumbnail ${index === currentIndex ? 'image-slice__thumbnail--active' : ''}`}
            onClick={() => handleThumbnailClick(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img src={image} alt={`${alt} thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlice;

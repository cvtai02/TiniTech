import React from 'react';

import { FaRegArrowAltCircleLeft } from 'react-icons/fa';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
interface CarouselProps {
  images: string[]; // Array of image URLs
  interval?: number; // Interval in milliseconds
  className?: string; // Optional className for custom styling
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  interval = 3000,
  className,
}) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const nextIndex = (index + 1) % images.length;
    const timer = setTimeout(() => setIndex(nextIndex), interval);
    return () => clearTimeout(timer);
  }, [index, images.length, interval]);

  function previousMovies() {
    if (index === 0) {
      setIndex(length - 1);
    } else setIndex(index - 1);
  }
  function nextMovies() {
    if (index === length - 1) {
      setIndex(0);
    } else setIndex(index + 1);
  }

  return (
    <div
      className={`w-full h-full relative group text-white text-left ${className}`}
    >
      <img
        className="w-full h-auto object-cover"
        src={`https://api.muji.com.vn/media/mageplaza/bannerslider/banner/image/m/a/ma_y_khue_ch_ta_n_-_desktop.png`}
      />
      <div
        onClick={previousMovies}
        className="cursor-pointer absolute opacity-50 hover:opacity-100 left-10 -translate-y-1/2 group-hover:block top-1/4 sm:top-1/3 md:top-2/4 hidden"
      >
        <FaRegArrowAltCircleLeft className="text-5xl" />
      </div>
      <div
        onClick={nextMovies}
        className="cursor-pointer absolute opacity-50 hover:opacity-100 right-10 -translate-y-1/2 group-hover:block top-1/4 sm:top-1/3  md:top-2/4 hidden"
      >
        <FaRegArrowAltCircleRight className="text-5xl" />
      </div>
      <div className="absolute top-[35%] sm:top-[50%] md:top-1/2  flex flex-col gap-y-4 w-4/5 ml-[10%]">
        <div className="flex flex-row gap-x-4 items-center">
          <p className="text-slate-300 border-r-2 pr-4"></p>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

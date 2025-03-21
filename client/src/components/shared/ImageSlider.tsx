import { useEffect, useState } from 'react';

const ImageSlider = () => {
  const [counter, setCounter] = useState<number>(0);
  const images = [
    "/sliderImage4.avif",
    "/sliderImage1.avif",
    "/sliderImage2.avif",
    "/sliderImage3.avif",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [counter, images.length]);

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="relative w-full max-w-7xl h-[calc(100vh-230px)] overflow-hidden">
        {images.map((img, index) => (
          <div key={index} className="absolute inset-0 flex items-center justify-between">
            <button aria-label='icon1' disabled={counter == 0} onClick={() => counter !== 0 && setCounter((prev) => prev - 1)}  className="z-10 p-2 bg-black bg-opacity-50 text-white rounded-full ml-4">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"></path>
              </svg>
            </button>
            <img
           loading={counter === index ? "eager" : "lazy"}
              src={img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                counter === index ? "opacity-100" : "opacity-0"
              }`}
              alt={`Image Slider ${index + 1}`}
            />
            <button aria-label='icon2' disabled={counter == images.length-1} onClick={() => counter !== images.length-1 && setCounter((prev) => prev + 1)} className="z-10 p-2 bg-black bg-opacity-50 text-white rounded-full transform rotate-180 mr-4">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
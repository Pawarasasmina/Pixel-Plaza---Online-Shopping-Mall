import React from "react";

const ImageCarousel = ({ images }) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hidden">
        {images.map((img, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full">
            <img
              src={img}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
      {/* Optional: Add navigation arrows here */}
    </div>
  );
};

export default ImageCarousel;

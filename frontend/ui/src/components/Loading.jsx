import React from "react";
import logo from "../assets/PixelPlaza.svg"; // Make sure to adjust the path to your logo

const Loading = () => {
  return (
    <div className="loading-container flex justify-center items-center h-screen">
      <div className="relative w-32 h-32">
        {/* Base logo with transparent text */}
        <img
          src={logo}
          alt="Loading Logo"
          className="absolute top-0 left-0 w-full h-full"
          style={{ opacity: 0.2 }}
        />

        {/* Fill animation only for the text area */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Masked overlay that fills only the logo's text area */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-primary origin-bottom scale-y-0 animate-fill" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

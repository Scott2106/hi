// src/contexts/GalleryContext.jsx
import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null); // Set default to 1

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
    </ImageContext.Provider>
  );
};

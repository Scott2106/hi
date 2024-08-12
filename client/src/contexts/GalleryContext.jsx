// src/contexts/GalleryContext.jsx
import React, { createContext, useState } from 'react';

export const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [selectedGallery, setSelectedGallery] = useState({ gallery_id: 1 }); // Default gallery ID
  const [selectedAlbum, setSelectedAlbum] = useState(null); // State for selected album
  const [siteId, setSiteId] = useState(1); // Default site ID
  const [userId, setUserId] = useState(1); // Default user ID
  const [userEmail, setUserEmail] = useState('user@example.com'); // Default user email

  return (
    <GalleryContext.Provider 
      value={{ 
        selectedGallery, 
        setSelectedGallery,
        selectedAlbum, 
        setSelectedAlbum,
        siteId,
        setSiteId,
        userId,
        setUserId,
        userEmail,
        setUserEmail
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
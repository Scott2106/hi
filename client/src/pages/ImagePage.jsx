import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
import { GalleryContext } from '../contexts/GalleryContext';

const ImagePage = () => {
  const { album_id } = useParams();
  const { selectedGallery, siteId, userId } = useContext(GalleryContext);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ name: '', tag: '', url: '' });

  const API_URL = import.meta.env.api_group_5 ;

  useEffect(() => {
    if (album_id && selectedGallery) {
      fetchImages();
    }
  }, [album_id, selectedGallery]);

  const fetchImages = async () => {
    if (!selectedGallery.gallery_id) {
      setError('Missing gallery information');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/i/a/g/${album_id}/${selectedGallery.gallery_id}`);
      const { imageURLs, imageNames, imageIds } = response.data;

      console.log("THIS YES, URLS", imageURLs);

      const fetchedImages = imageURLs.map((url, index) => ({
        url: imageURLs[index],
        name: imageNames[index],
        tag: '', // Assuming you might want to add a tag later
        id: imageIds[index],
      }));
      setImages(fetchedImages);

    } catch (error) {
      if (error.response.status === 404) {
        setError('No images found');
        console.error(error);
      } else {
        console.error('Error fetching images:', error);
        setError('Error fetching images');
      }
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const filePreviews = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setPreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  }, []);

  const handleUpload = async () => {
    if (!selectedGallery?.gallery_id || !album_id) {
      setError('Missing album & gallery information');
      return;
    }

    setUploading(true);
    setError(null);

    const uploadPromises = previews.map(async (preview) => {
      const { file } = preview;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('album_id', album_id);
      formData.append('gallery_id', selectedGallery.gallery_id);

      const fileType = file.type.split('/')[1];
      console.log('File type being sent:', fileType);
      formData.append('file_type', fileType);

      formData.append('image_name', file.name);
      formData.append('status_id', '1');
      formData.append('site_id', siteId);
      formData.append('user_id', userId);

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await axios.post(
          `${API_URL}/api/i/a/g/${album_id}/${selectedGallery.gallery_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Upload response:', response.data);
      } catch (error) {
        console.error('Error uploading image:', error.response ? error.response.data : error.message);
        setError(`Error uploading image: ${file.name}`);
      }
    });

    try {
      await Promise.all(uploadPromises);
      setUploading(false);
      setPreviews([]);
      fetchImages();
    } catch (error) {
      console.error('Error in upload process:', error);
      setError('Error during upload process');
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  // Delete the image part
  const handleDeleteImage = async (image_id) => {
    if (!selectedGallery?.gallery_id || !album_id) {
      setError('Missing album & gallery information');
      return; 
    }

    try {
      await axios.delete(`${API_URL}/api/i/a/g/${image_id}/${album_id}/${selectedGallery.gallery_id}`);
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Error deleting image');
    }
  };

  const handleDeleteAllImages = async () => {
    if (!selectedGallery?.gallery_id || !album_id) {
      setError('Missing album & gallery information');
      return;
    }
  
    try {
      // Confirm with the user before proceeding
      const confirmed = window.confirm('Are you sure you want to delete all images? This action cannot be undone.');
      if (!confirmed) return;
  
      // Create a promise for each delete request
      const deletePromises = images.map(() =>
        axios.delete(`${API_URL}/api/i/a/g/${album_id}/${selectedGallery.gallery_id}`)
      );
  
      // Wait for all delete requests to complete
      await Promise.all(deletePromises);
  
      // Clear images state after deletion
      setImages([]);
      setError(null);
      console.log('All images have been deleted.');
    } catch (error) {
      console.error('Error deleting all images:', error);
      setError('Error deleting all images');
    }
  };
  



  const openEditModal = (image) => {
    
    setCurrentImage(image);
    console.log('currentImage', image);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentImage({ name: '', tag: '', url: '' });
  };

  const handleSaveChanges = async () => {
    if (!selectedGallery?.gallery_id || !album_id) {
      setError('Missing album & gallery information');
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_URL}/api/i/a/g/${currentImage.id}/${album_id}/${selectedGallery.gallery_id}`,
        {
          name: currentImage.name,
          tag: currentImage.tag,
        }
      );
  
      console.log('Save changes response:', response);
      
      // Update the images state to reflect the changes
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === currentImage.id
            ? { ...image, name: currentImage.name, tag: currentImage.tag }
            : image
        )
      );
  
      closeEditModal(); // Close the modal after saving
  
    } catch (error) {
      console.error('Error saving image changes:', error.response ? error.response.data : error.message);
      setError('Error saving image changes');
    }
  };
  
  

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Images</h1>
          <input
            type="text"
            placeholder="Search images..."
            className="p-2 border border-gray-300 rounded mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div {...getRootProps()} className={`p-6 mt-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
            )}
          </div>
  
          {/* New Delete All Button */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleDeleteAllImages}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Delete All Images
            </button>
          </div>
  
          {previews.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Files to Upload</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {previews.map((preview, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{preview.name}</h3>
                    <img src={preview.preview} alt={preview.name} className="w-full h-48 object-cover rounded" />
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Upload All
              </button>
            </div>
          )}
  
          {uploading && <p>Uploading images...</p>}
  
          {loading ? (
            <p>Loading images...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredImages.length === 0 ? (
            <p>No images available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredImages.map((image, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{image.name}</h2>
                  <img src={image.url} alt={image.name} className="w-full h-48 object-cover rounded" />
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => openEditModal(image)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Modal for editing image details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Image Details</h2>
            <input
              type="text"
              value={currentImage.name}
              onChange={(e) => setCurrentImage({ ...currentImage, name: e.target.value })}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Image Name"
            />
            <input
              type="text"
              value={currentImage.tag}
              onChange={(e) => setCurrentImage({ ...currentImage, tag: e.target.value })}
              className="p-2 border border-gray-300 rounded mb-4 w-full"
              placeholder="Image Tag (separate each tag with ',' )"
            />
            <button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600 mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={closeEditModal}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
  
};

export default ImagePage;


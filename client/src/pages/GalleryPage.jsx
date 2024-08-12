// src/pages/galleryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GalleryContext } from '../contexts/GalleryContext';
import { api_group_5 } from '@/interceptors/axios';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedGallery, userId } = useContext(GalleryContext);
  const API_URL = api_group_5; 

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    const site_id = 1;
   // const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/g/s/${site_id}`
    //     , {
    //     headers: {
    //       Authorization: `Bearer ${token}` // Include the token in the request headers
    //     }
    //  }
    );
      setGalleries(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Forbidden: You are not allowed to access this page');
      } else {
        setError('Error fetching galleries');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Galleries</h1>
          <input
            type="text"
            placeholder="Search galleries..."
            className="p-2 border border-gray-300 rounded mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {loading ? (
            <p>Loading galleries...</p>
          ) : error ? (
            <p>{error}</p>
          ) : galleries.length === 0 ? (
            <p>No galleries available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries
                .filter(gallery => gallery.gallery_name && gallery.gallery_name.toLowerCase().includes(search.toLowerCase()))
                .map((gallery) => (
                  <div key={gallery.gallery_id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{gallery.gallery_name}</h2>
                    <p className="text-gray-600 mb-4">{gallery.gallery_description}</p>
                    <Link to="/albums" onClick={() => setSelectedGallery(gallery)}>
                      <button className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GalleryPage;

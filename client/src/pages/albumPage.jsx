import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { GalleryContext } from '../contexts/GalleryContext';
import { api_group_5 } from '@/interceptors/axios';
import Modal from '../components/Modal';

const AlbumPage = () => {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [modalError, setModalError] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(null);
  const [descriptionVisible, setDescriptionVisible] = useState(null);
  const [albumAccess, setAlbumAccess] = useState([]);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [permissions, setPermissions] = useState({});
  const optionsRef = useRef(null);
  const { selectedGallery, siteId, userId, userEmail } = useContext(GalleryContext);
  const API_URL = api_group_5;

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const fetchAlbums = async () => {
      if (!selectedGallery || !selectedGallery.gallery_id || !userId || !siteId) {
        setError('Missing necessary IDs');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/a/u/${userId}}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAlbums(response.data);
      } catch (error) {
        setError('Error fetching albums');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [selectedGallery, userId, siteId]);

  const handleCreateAlbum = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(`${API_URL}/api/a/u/${userId}`, {
        site_id: siteId,
        gallery_id: selectedGallery.gallery_id,
        album_name: newAlbumName,
        email: userEmail,
        album_description: newAlbumDescription
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get(`${API_URL}/api/a/u/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAlbums(response.data);
      setModalOpen(false);
      setNewAlbumName('');
      setNewAlbumDescription('');
      setModalError(null);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setModalError('There is already an album with the same name');
      } else {
        setModalError('Error creating album');
      }
    }
  };

  const handleUpdateAlbum = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`${API_URL}/api/a/${selectedAlbum.album_id}`, {
        album_name: newAlbumName,
        album_description: newAlbumDescription,
        user_id: userId,
        site_id: siteId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get(`${API_URL}/api/a/u/${userId}/s/${selectedGallery.gallery_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAlbums(response.data);
      setModalOpen(false);
      setNewAlbumName('');
      setNewAlbumDescription('');
      setModalError(null);
      setSelectedAlbum(null);
    } catch (error) {
      setModalError('Error updating album');
    }
  };

  const handleDeleteAlbum = async (album_id) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${API_URL}/api/a/${album_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          user_id: userId,
          site_id: siteId
        }
      });
      const response = await axios.get(`${API_URL}/api/a/u/${userId}}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAlbums(response.data);
    } catch (error) {
      setError('Error deleting album');
    }
  };

  const fetchAlbumAccess = async (album_id) => {
    const token = localStorage.getItem('authToken');
    setLoadingAccess(true);
    try {
      const response = await axios.get(`${API_URL}/api/r/a/${album_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Filter out specific roles
      const filteredAccess = response.data.filter(access => 
        !['Album_Owner', 'Super_Admin', 'Site_Admin', 'Site_Owner', 'Site_Manager'].includes(access.role)
      );
      setAlbumAccess(filteredAccess);
      setAccessModalOpen(true);
    } catch (error) {
      setError('Error fetching album access');
    } finally {
      setLoadingAccess(false);
    }
  };

  const toggleDescriptionVisibility = (album_id) => {
    setDescriptionVisible(descriptionVisible === album_id ? null : album_id);
  };

  const handlePermissionChange = (userId, newPermission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [userId]: newPermission,
    }));
  };

  const handleSavePermissions = async () => {
    const token = localStorage.getItem('authToken');
    try {
      // Implement saving logic here, possibly by sending the `permissions` state to your backend
      console.log('Saving permissions:', permissions);

      // Simulate API call to save permissions
      await axios.post(`${API_URL}/api/save/permissions`, {
        album_id: selectedAlbum.album_id,
        permissions,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAccessModalOpen(false); // Close the modal after saving
    } catch (error) {
      setError('Error saving permissions');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Albums</h1>
          <input
            type="text"
            placeholder="Search albums..."
            className="p-2 border border-gray-300 rounded mb-4 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => {
              setModalMode('create');
              setModalOpen(true);
            }}
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 mb-4"
          >
            Create New Album
          </button>
          {loading ? (
            <p>Loading albums...</p>
          ) : error ? (
            <p>{error}</p>
          ) : albums.length === 0 ? (
            <p>No albums available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums
                .filter(album => album.album_name.toLowerCase().includes(search.toLowerCase()))
                .map((album) => (
                  <div
                    key={album.album_id}
                    style={{
                      position: 'relative',
                      paddingTop: '30px',
                      backgroundColor: '#fffde8',
                      border: '1px solid #f2cf44',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.location.href = `/albums/${album.album_id}`}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '150px',
                        height: '30px',
                        backgroundColor: '#eda73e',
                        borderRadius: '8px 8px 0 0',
                      }}
                    />
                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f2cf44',
                        borderBottom: '2px solid #c78b32',
                        borderTop: '2px solid #eda73e',
                        borderRadius: '8px 0 8px 8px',
                        minHeight: '185px',
                        boxSizing: 'border-box',
                        position: 'relative'
                      }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{album.album_name}</h2>
                      <div
                        style={{
                          maxHeight: '100px',
                          overflowY: 'auto',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          paddingRight: '16px',
                        }}
                      >
                        <p className="text-gray-600" style={{ margin: 0, wordWrap: 'break-word' }}>
                          {descriptionVisible === album.album_id ? album.album_description : ''}
                        </p>
                      </div>
                    </div>
                    <div ref={optionsRef} style={{ position: 'absolute', top: '2px', right: '2px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOptionsVisible(optionsVisible === album.album_id ? null : album.album_id);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#333',
                          padding: '1px 5px 3px 5px',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          borderRadius: '2px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onFocus={(e) => e.currentTarget.style.backgroundColor = '#e2e2e2'}
                        onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        &#8942;
                      </button>
                      {optionsVisible === album.album_id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: '0',
                          backgroundColor: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          padding: '4px'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalMode('update');
                              setSelectedAlbum(album);
                              setNewAlbumName(album.album_name);
                              setNewAlbumDescription(album.album_description);
                              setModalOpen(true);
                              setOptionsVisible(null);
                            }}
                            style={{
                              display: 'block',
                              color: '#007bff',
                              padding: '4px 8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onFocus={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Update
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAlbum(album.album_id);
                              setOptionsVisible(null);
                            }}
                            style={{
                              display: 'block',
                              color: '#dc3545',
                              padding: '4px 8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8d7da'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onFocus={(e) => e.currentTarget.style.backgroundColor = '#f8d7da'}
                            onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescriptionVisibility(album.album_id);
                              setOptionsVisible(null);
                            }}
                            style={{
                              display: 'block',
                              color: '#007bff',
                              padding: '4px 8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onFocus={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            View Description
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchAlbumAccess(album.album_id);
                              setOptionsVisible(null);
                            }}
                            style={{
                              display: 'block',
                              color: '#007bff',
                              padding: '4px 8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onFocus={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            onBlur={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            View Access
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">
          {modalMode === 'create' ? 'Create New Album' : 'Update Album'}
        </h2>
        <input
          type="text"
          placeholder="Album Name"
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <textarea
          placeholder="Album Description"
          className="p-2 border border-gray-300 rounded mb-4 w-full"
          value={newAlbumDescription}
          onChange={(e) => setNewAlbumDescription(e.target.value)}
        />
        {modalError && <p className="text-red-500 mb-4">{modalError}</p>}
        <div className="flex justify-end gap-2">
          {modalMode === 'create' ? (
            <button
              onClick={handleCreateAlbum}
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            >
              Create Album
            </button>
          ) : (
            <button
              onClick={handleUpdateAlbum}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Update Album
            </button>
          )}
          <button
            onClick={() => setModalOpen(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Modal isOpen={accessModalOpen} onClose={() => setAccessModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">Album Access</h2>
        {loadingAccess ? (
          <p>Loading access data...</p>
        ) : (
          <div>
            {albumAccess.length === 0 ? (
              <div>
                <p>No access data available.</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setAccessModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Permission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {albumAccess.map((access, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{access.user_id}</td>
                        <td className="border px-4 py-2">{access.role}</td>
                        <td className="border px-4 py-2">
                          <select
                            value={permissions[access.user_id] || 'view'}
                            onChange={(e) => handlePermissionChange(access.user_id, e.target.value)}
                            className="p-2 border rounded w-full"
                          >
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                            <option value="manage">Manage Users</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleSavePermissions}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setAccessModalOpen(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default AlbumPage;

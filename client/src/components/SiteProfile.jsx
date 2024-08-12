import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api_group_3 } from '@/interceptors/axios';
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [roleName, setRoleName] = useState('');
    const API_BASE_URL = 'http://127.0.0.1:5000';
    const { siteId } = useParams();
    const navigate = useNavigate();
    const [siteAPIKey, setSiteAPIKey] = useState('');
    const [cloudinaryCloudName, setCloudinaryCloudName] = useState('');
    const [cloudinaryAPIKey, setCloudinaryAPIKey] = useState('');
    const [cloudinaryAPISecret, setCloudinaryAPISecret] = useState('');
    const [formErrorMessage, setFormErrorMessage] = useState('');

    const userId = 2;

    useEffect(() => {
        api_group_3.get(`/s/${siteId}/ur/`)
            .then(response => setRoleName(response.data.role_name))
            .catch(error => console.error('Error fetching user role:', error));
    }, [siteId, userId]);

    const showUpdateDeleteBtn = ['User_SuperAdmin', 'User_SiteOwner'].includes(roleName);

    const fetchProfile = async () => {
        try {
            const response = await api_group_3.get(`/s/${siteId}`);
            const data = response.data;
            setProfile(data);
            setErrorMessages({});
            setSiteName(data.siteName || '');
            setSiteDescription(data.siteDescription || '');
            setSiteAPIKey(data.siteApiKey);
        } catch (error) {
            console.error("There was an error fetching the profile!", error);
            setErrorMessages({ message: 'There was an error fetching the profile.' });
        }
    };

    const fetchCloudinaryConfig = async () => {
        try {
            const response = await api_group_3.get(`/s/${siteId}/provider-config`);
            const data = response.data;

            if (data.configuration?.providerConfig) {
                const { cloud_name, api_key, api_secret } = data.configuration.providerConfig;
                setCloudinaryCloudName(cloud_name || '');
                setCloudinaryAPIKey(api_key || '');
                setCloudinaryAPISecret(api_secret || '');
            } else {
                setCloudinaryCloudName('');
                setCloudinaryAPIKey('');
                setCloudinaryAPISecret('');
            }
        } catch (error) {
            console.error("There was an error fetching the Cloudinary configuration!", error);
            setErrorMessages({ message: 'There was an error fetching the Cloudinary configuration.' });
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchCloudinaryConfig();
    }, [siteId]);

    const statusMapping = {
        1: 'Active',
        2: 'Inactive',
    };

    const getStatusName = (statusId) => {
        return statusMapping[statusId] || 'Unknown Status';
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await api_group_3.put(`/s/${siteId}`, {
                siteName,
                siteDescription
            });

            setShowPopup(false);
            fetchProfile();
            setErrorMessages({});
            setFormErrorMessage('');
        } catch (error) {
            console.error("There was an error updating the profile!", error);
            const errorData = error.response?.data;
            if (error.response?.status === 400) {
                setFormErrorMessage(errorData.message || 'Site name already exists.');
            } else {
                setErrorMessages({ message: errorData.message || 'Failed to update profile' });
            }
        }
    };

    const handleDeleteProfile = async () => {
        try {
            await api_group_3.delete(`/s/${siteId}`);
            navigate('/s');
        } catch (error) {
            console.error("There was an error deleting the profile!", error);
            const errorData = error.response?.data;
            setErrorMessages({ message: errorData.message || 'Failed to delete profile' });
        }
    };

    return (
        <div className="report-setting d-flex vh-100">
            <div className="left-container w-100 d-flex flex-column align-items-center">
                <h1 className="mt-5 mb-4 font-weight-bold">Site Profile</h1>

                <div className="card w-75 mb-4">
                    <div className="card-body">
                        {errorMessages.message ? (
                            <div className="text-danger mt-2">{errorMessages.message}</div>
                        ) : profile ? (
                            <div>
                                <p><strong>Site Name:</strong> {profile.siteName}</p>
                                <p><strong>Description:</strong> {profile.siteDescription}</p>
                                <p><strong>Created At:</strong> {profile.createdAt}</p>
                                <p><strong>Updated At:</strong> {profile.updatedAt}</p>
                                <p><strong>Status:</strong> {getStatusName(profile.statusId)}</p>
                                <div className="mt-4 p-4 border border-secondary rounded">
                                    <h4><strong>Site API Key:</strong></h4>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f8f9fa',
                                        padding: '10px 15px',
                                        borderRadius: '4px',
                                        border: '2px solid #ddd',
                                        fontFamily: 'monospace',
                                        fontSize: '1rem',
                                        overflowX: 'auto',
                                        marginBottom: '10px'
                                    }}>
                                        <span>{siteAPIKey}</span>
                                        <button
                                            className="btn btn-outline-secondary ml-3"
                                            style={{ marginLeft: 'auto' }}
                                            onClick={() => navigator.clipboard.writeText(siteAPIKey)}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                {cloudinaryCloudName && cloudinaryAPIKey && cloudinaryAPISecret ? (
                                    <div className="mt-4 p-4 border border-secondary rounded">
                                        <h4><strong>Cloudinary Configuration:</strong></h4>
                                        <div className="mb-3">
                                            <label className="d-block mb-1"><strong>Cloud Name:</strong></label>
                                            <div style={{
                                                backgroundColor: '#f8f9fa',
                                                padding: '10px 15px',
                                                borderRadius: '4px',
                                                border: '2px solid #ddd',
                                                fontFamily: 'monospace',
                                                fontSize: '1rem',
                                                overflowX: 'auto'
                                            }}>
                                                <span>{cloudinaryCloudName}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="d-block mb-1"><strong>API Key:</strong></label>
                                            <div style={{
                                                backgroundColor: '#f8f9fa',
                                                padding: '10px 15px',
                                                borderRadius: '4px',
                                                border: '2px solid #ddd',
                                                fontFamily: 'monospace',
                                                fontSize: '1rem',
                                                overflowX: 'auto'
                                            }}>
                                                <span>{cloudinaryAPIKey}</span>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="d-block mb-1"><strong>API Secret:</strong></label>
                                            <div style={{
                                                backgroundColor: '#f8f9fa',
                                                padding: '10px 15px',
                                                borderRadius: '4px',
                                                border: '2px solid #ddd',
                                                fontFamily: 'monospace',
                                                fontSize: '1rem',
                                                overflowX: 'auto'
                                            }}>
                                                <span>{cloudinaryAPISecret}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 border border-secondary rounded">
                                        <h4><strong>Cloudinary Configuration:</strong></h4>
                                        <p className="text-muted">No Cloudinary configuration available for this site.</p>
                                    </div>
                                )}

                                {showUpdateDeleteBtn && (
                                    <button
                                        onClick={() => setShowPopup(true)}
                                        className="btn btn-primary"
                                        style={{ marginTop: '20px', marginRight: '10px' }}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                {showUpdateDeleteBtn && (
                                    <button
                                        onClick={handleDeleteProfile}
                                        className="btn btn-danger"
                                        style={{ marginTop: '20px' }}
                                    >
                                        Delete Profile
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>
            </div>

            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        width: '800px',
                        height: 'auto',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowPopup(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5em',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px' }}>
                                Site Name:
                                <input
                                    type="text"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </label>
                            <label style={{ display: 'block', marginBottom: '15px' }}>
                                Description:
                                <textarea
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </label>
                            {formErrorMessage && (
                                <div className="text-danger mb-3">
                                    {formErrorMessage}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                            <button
                                onClick={handleUpdateProfile}
                                className="btn btn-primary"
                                style={{ padding: '12px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="btn btn-secondary"
                                style={{ padding: '12px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeletePopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        width: '400px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowDeletePopup(false)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5em',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <p>Are you sure you want to delete this site?</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <button
                                onClick={handleDeleteProfile}
                                className="btn btn-danger"
                                style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeletePopup(false)}
                                className="btn btn-secondary"
                                style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
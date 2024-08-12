import { useState } from 'react';
import { api_group_3 } from '@/interceptors/axios';
const CreateSiteForm = () => {
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [galleryName, setGalleryName] = useState('');
    const [galleryDescription, setGalleryDescription] = useState(''); // State for gallery description
    const [configureCloudinary, setConfigureCloudinary] = useState(false);
    const [cloudinaryConfig, setCloudinaryConfig] = useState({ cloudName: '', cloudApiKey: '', cloudApiSecret: '' });
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState(''); // State to manage error message
    const [siteNameError, setSiteNameError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Clear any error messages
        setSiteNameError(false); // Reset site name error state

        try {
            const response = await api_group_3.post(
                '/s',
                {
                    siteName,
                    siteDescription,
                    galleryName: galleryName || `${siteName} Gallery`, // Default to SiteName Gallery
                    galleryDescription, // Include gallery description
                    cloudinaryConfig: configureCloudinary ? cloudinaryConfig : null, // Only include Cloudinary config if selected
                },
                {
                    headers: {
                        'site-api-key': import.meta.env.VITE_SITE1_API_KEY
                    }
                }
            );
            console.log(response.data)
            // Update the API key state with the value received from the server
            setApiKey(response.data.apiKey);
            // Redirect to the site(setting) dashboard
            window.location.href = `/s/${response.data.siteId}/sstng`

        } catch (error) {
            console.error('There was an error creating the site!', error);
            if (error.response && error.response.data.message) {
                // Check if the error is related to the site name already existing
                if (error.response.status === 409) {
                    setSiteNameError(true);
                }
                setError(error.response.data.message);
            } else {
                setError('Error creating site');
            }
        };
    }

    const handleSiteNameChange = (e) => {
        setSiteName(e.target.value); // Set site name state
        setSiteNameError(false); // Remove the error highlight when user edits
        setError(''); // Clear the error message when user edits
    };

    return (
        <div className="container mx-auto mt-12">
            <h2 className="text-4xl font-semibold mb-6 text-center">Create Site</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="siteName" className="block text-xl font-medium text-gray-700 mb-2">Site Name:</label>
                    <input
                        type="text"
                        id="siteName"
                        className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none sm:text-lg"
                        style={{
                            border: siteNameError ? '3px solid red' : '1px solid gray',
                            transition: 'border-color 0.3s ease',
                        }}
                        value={siteName}
                        onChange={handleSiteNameChange}
                        maxLength="50"
                        required
                    />
                    {siteNameError && (
                        <p className="text-red-500 text-sm mt-1">Site name already exists.</p>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="siteDescription" className="block text-xl font-medium text-gray-700 mb-2">Site Description:</label>
                    <textarea
                        id="siteDescription"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        maxLength="255"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="galleryName" className="block text-xl font-medium text-gray-700 mb-2">Gallery Name:</label>
                    <input
                        type="text"
                        id="galleryName"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                        value={galleryName}
                        onChange={(e) => setGalleryName(e.target.value)}
                        placeholder={`Default: ${siteName || '[SiteName]'} Gallery`}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="galleryDescription" className="block text-xl font-medium text-gray-700 mb-2">Gallery Description:</label>
                    <textarea
                        id="galleryDescription"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                        value={galleryDescription}
                        onChange={(e) => setGalleryDescription(e.target.value)}
                        maxLength="255"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="checkbox"
                        id="configureCloudinary"
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={configureCloudinary}
                        onChange={(e) => setConfigureCloudinary(e.target.checked)}
                    />
                    <label htmlFor="configureCloudinary" className="text-lg font-medium text-gray-700">Do you want to configure Cloudinary?</label>
                </div>
                {configureCloudinary && (
                    <div className="mb-4">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Cloudinary Configuration:</h3>
                        <label htmlFor="cloudName" className="block text-xl pt-3 font-medium text-gray-700 mb-2">Cloud Name:</label>
                        <input
                            type="text"
                            id="cloudName"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                            value={cloudinaryConfig.cloudName}
                            onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudName: e.target.value })}
                        />
                        <label htmlFor="cloudApiKey" className="block text-xl pt-3 font-medium text-gray-700 mb-2">API Key:</label>
                        <input
                            type="text"
                            id="cloudApiKey"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                            value={cloudinaryConfig.cloudApiKey}
                            onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudApiKey: e.target.value })}
                        />
                        <label htmlFor="cloudApiSecret" className="block text-xl pt-3 font-medium text-gray-700 mb-2">API Secret:</label>
                        <input
                            type="password"
                            id="cloudApiSecret"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                            value={cloudinaryConfig.cloudApiSecret}
                            onChange={(e) => setCloudinaryConfig({ ...cloudinaryConfig, cloudApiSecret: e.target.value })}
                        />
                    </div>
                )}
                {error && (
                    <p className="text-red-500 text-center mt-4">{error}</p>
                )}
                <button type="submit" className="inline-flex items-center px-8 mt-6 mb-10 py-2 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create Site
                </button>
            </form>
        </div>
    );
};

export default CreateSiteForm;
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideNavBar from "../components/SiteNavBar";

function CreateEmail() {
    const { site_id } = useParams(); // Get the site_id from URL parameters
    const [showPopup, setShowPopup] = useState(true);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handlePopupResponse = (choice) => {
        if (choice === 'no') {
            navigate(`/sug/${site_id}`); // Redirect to SiteDetails with the site_id
        } else {
            setShowPopup(false); // Hide popup and stay on current page
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Add email creation logic here
        console.log("Email created:", email);
    };

    return (
        <div className="createEmail">
            <SideNavBar />
            <div className="CreateEmail p-6 bg-gray-100">
                {showPopup && (
                    <div className="popup bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Create Unique Email</h2>
                        <p className="mb-4">Do you want to create a unique email?</p>
                        <button
                            onClick={() => handlePopupResponse('yes')}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => handlePopupResponse('no')}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            No
                        </button>
                    </div>
                )}

                {!showPopup && (
                    <div className="email-form bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Create Unique Email</h2>
                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Create Email
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateEmail;

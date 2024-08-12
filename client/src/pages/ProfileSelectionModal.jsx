import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function ProfileSelectionModal() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [pin, setPin] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfilePin, setNewProfilePin] = useState("");
  const [confirmProfilePin, setConfirmProfilePin] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/p");
        const profiles = await response.json();
        setProfiles(profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in with Profile: ${selectedProfile}, PIN: ${pin}`);
    // implement login logic here
  };

  const handleNewProfileSubmit = async (e) => {
    e.preventDefault();
    if (newProfilePin !== confirmProfilePin) {
      alert("PINs do not match!");
      return;
    }
    const newProfile = {
      profile_name: newProfileName,
      pin: newProfilePin,
    };
    console.log("Creating new profile:", newProfile);

    try {
      const response = await fetch("http://localhost:8081/api/p", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });
      if (response.ok) {
        const createdProfile = await response.json();
        setProfiles([...profiles, createdProfile]); // adding a new profile
        setNewProfileName("");
        setNewProfilePin("");
        setConfirmProfilePin("");
        alert("Profile created successfully!");
        setIsSigningUp(false);
      } else {
        alert("Error creating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <div className="p-6">
      <Navbar />

      {/* login form */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Log into Your Profile
        </h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Enter Profile Name:</label>
            <input
              type="text"
              placeholder="Enter profile name"
              value={selectedProfile}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 p-2 rounded"
              autoComplete="username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Enter PIN:</label>
            <input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={handlePinChange}
              className="w-full border border-gray-300 p-2 rounded"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            {isSigningUp ? "Cancel Sign Up" : "Sign Up"}
          </button>
        </form>
      </div>

      {/* new profile sign up */}
      {isSigningUp && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Create a New Profile
          </h2>
          <form onSubmit={handleNewProfileSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Name:</label>
              <input
                type="text"
                placeholder="Enter new profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">PIN:</label>
              <input
                type="password"
                placeholder="Enter a secure PIN"
                value={newProfilePin}
                onChange={(e) => setNewProfilePin(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm PIN:</label>
              <input
                type="password"
                placeholder="Confirm your PIN"
                value={confirmProfilePin}
                onChange={(e) => setConfirmProfilePin(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Profile
            </button>
          </form>
        </div>
      )}

      {/* displaying all registered profiles */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          All Registered Profiles
        </h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 border-b">Profile Name</th>
              <th className="py-2 px-4 border-b">User Email</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.profile_id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{profile.profile_name}</td>
                  <td className="py-2 px-4 border-b">
                    {profile.user?.email || `No Email Available`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {profile.status?.status_name || `No Status Available`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center">
                  No Profiles Available Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfileSelectionModal;

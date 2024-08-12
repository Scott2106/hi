
import { useState } from "react";
import Navbar from "./Navbar.jsx";

function ProfileSignUp() {
  const [profileName, setProfileName] = useState("");
  const [profilePin, setProfilePin] = useState("");

  const handleProfileSignUp = (e) => {
    e.preventDefault();
    console.log(`Profile Name: ${profileName}, Profile Pin: ${profilePin}`);

    // Reset the fields after submission
    setProfileName("");
    setProfilePin("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Profile Sign Up
          </h2>
          <form onSubmit={handleProfileSignUp}>
            <div className="mb-4">
              <label
                htmlFor="profile_name"
                className="block text-gray-700 font-medium mb-2"
              >
                Profile Name:
              </label>
              <input
                type="text"
                id="profile_name"
                className="form-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Profile Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="profile_pin"
                className="block text-gray-700 font-medium mb-2"
              >
                Profile Pin:
              </label>
              <input
                type="password"
                id="profile_pin"
                className="form-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Profile Pin"
                value={profilePin}
                onChange={(e) => setProfilePin(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSignUp;

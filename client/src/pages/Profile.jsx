import ProfileSelectionModal from "./ProfileSelectionModal";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Profile() {
  const [profiles, setProfiles] = useState([]);
  const [totalProfilePages, setTotalProfilePages] = useState(1);
  const [currentProfilePage, setCurrentProfilePage] = useState(1);
  const profileLimit = 5;
  const [newProfile, setNewProfile] = useState({
    profile_name: "",
    profile_pin: "",
    user_id: "", 
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [loggedInProfile, setLoggedInProfile] = useState(null); // Store the logged-in profile
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const baseUrl = "http://localhost:8081/api/p";
        const queryParams = {
          page: currentProfilePage,
          limit: profileLimit,
        };

        const url = new URL(baseUrl);
        Object.keys(queryParams).forEach((key) =>
          url.searchParams.append(key, queryParams[key])
        );

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error in fetching profiles: ${response.statusText}`);
        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfiles();
  }, [currentProfilePage]);

  useEffect(() => {
    if (profiles.length > 0) {
      setTotalProfilePages(Math.ceil(profiles.length / profileLimit));
    }
  }, [profiles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleProfilePageChange = (page) => {
    setCurrentProfilePage(page);
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/p", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });
  
      if (response.ok) {
        await response.json();
        setNewProfile({
          profile_name: "",
          profile_pin: "",
          user_id: "",
        });
        setIsAdding(false);
        setCurrentProfilePage(1); // resets to the first page after adding a profile
        alert("Profile added successfully!");
        window.location.reload();
      } else if (response.status === 409) {
        const errorMessage = await response.json();
        alert(`Error: ${errorMessage.error}`);
      } else {
        const errorMessage = await response.text();
        alert(`Error adding profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
      alert("An unexpected error occurred while adding the profile. Please try again.");
    }
  };

  const handleLoginProfile = (profile) => {
    const profilePin = prompt("Please enter your profile PIN:");

    if (profilePin === profile.profile_pin) {
      setLoggedInProfile(profile);
      setIsModalOpen(false);
      alert(`Successfully logged in as ${profile.profile_name}`);
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <Navbar />
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile List</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isAdding ? "Cancel" : "Add Profile"}
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          View My Profiles
        </button>

        {isAdding && (
          <form onSubmit={handleAddProfile} className="mb-6">
            {/* Add Profile Form */}
          </form>
        )}

        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* Table Headers */}
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.profile_id} className="hover:bg-gray-100">
                  {/* Profile Data */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center">
                  No Profiles Available Yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalPages={totalProfilePages}
          currentPage={currentProfilePage}
          onPageChange={handleProfilePageChange}
        />
      </div>

      {isModalOpen && (
        <ProfileSelectionModal
          profiles={profiles}
          onClose={() => setIsModalOpen(false)}
          onLogin={handleLoginProfile}
        />
      )}
    </div>
  );
}

export default Profile;

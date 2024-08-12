import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "./Navbar";
import defaultImage from '../image/image.png';

function ProfileDetails({ loggedInProfile }) { // Receive the logged-in profile as a prop
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isChangingImage, setIsChangingImage] = useState(false);
  const { profile_id } = useParams();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (loggedInProfile) {
      fetchProfileDetails();
    } else {
      alert("You must be logged in to view profile details.");
      navigate("/"); // Redirect to home or login page if not logged in
    }
  }, [profile_id, loggedInProfile]);

  const fetchProfileDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/p/${profile_id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setProfile(data);
        setEditedProfile(data);
      } else {
        console.error(`Profile ${profile_id} not found`);
        navigate("/"); // Redirect to home or a "not found" page
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const handleProfileEdit = () => {
    setIsEditing(!isEditing);
    setEditedProfile(profile);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/p/${profile_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });
      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorMessage = await response.text();
        alert(`Error updating profile: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An unexpected error occurred while updating the profile. Please try again.");
    }
  };

  const handleImageChange = () => {
    setIsChangingImage(!isChangingImage);
  };

  const handleImageSave = async () => {
    try {
      const formData = new FormData();
      formData.append("profile_image", editedProfile.profile_image);
      const response = await fetch(`http://localhost:8081/api/p/${profile_id}/upload`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsChangingImage(false);
        alert("Profile image updated successfully!");
      } else {
        const errorMessage = await response.text();
        alert(`Error updating profile image: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("An unexpected error occurred while updating the profile image. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/p/${profile_id}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        alert("Password updated successfully!");
      } else {
        const errorMessage = await response.text();
        alert(`Error updating password: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An unexpected error occurred while updating the password. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Navbar />
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{profile.profile_name}</h1>
        <div className="flex mb-4">
          <div className="w-1/4 mr-4">
            <img
              src={profile.profile_image ? profile.profile_image : defaultImage}
              alt={profile.profile_name}
              className="w-full h-auto rounded-lg"
            />
            <button onClick={handleImageChange} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              {isChangingImage ? "Cancel" : "Change Image"}
            </button>
            {isChangingImage && (
              <div>
                <input
                  type="file"
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, profile_image: e.target.files[0] })
                  }
                  className="mt-2"
                />
                <button onClick={handleImageSave} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
                  Save Image
                </button>
              </div>
            )}
          </div>
          <div className="w-3/4">
            {isEditing ? (
              <div>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    value={editedProfile.profile_name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, profile_name: e.target.value })}
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                  />
                </label>
                <button onClick={handleSaveProfile} className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-2">
                  <strong>Name:</strong> {DOMPurify.sanitize(profile.profile_name)}
                </p>
                <button onClick={handleProfileEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <div>
            <label className="block mb-2">
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Confirm New Password:
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
              />
            </label>
            <button onClick={handlePasswordChange} className="bg-green-500 text-white px-4 py-2 rounded">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function GroupDetails() {
    const [group, setGroup] = useState(null);
    const [siteName, setSiteName] = useState(""); // If siteName needs to be displayed
    const { id } = useParams(); // Fetch group ID from URL parameters
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        fetchGroupDetails();
    }, [id]); // Dependency array includes id to fetch details when it changes

    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/grp/${id}`);
            const data = await response.json();

            if (data) {
                setGroup(data);
                // Assuming `siteName` needs to be fetched or derived from `data`
                setSiteName(data.site_name || "Unknown"); // Replace with actual logic if needed
            } else {
                console.error("Group not found");
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };

    const handleDelete = async (groupId) => {
        try {
            await fetch(`http://localhost:8081/api/grp/${groupId}`, {
                method: "DELETE"
            });
            alert("Group deleted successfully");
            navigate("/s/grp"); // Redirect to the groups page after deletion
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <Navbar />
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Group Details</h1>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">{group.group_name}</h2>
                    <p className="text-gray-600">{group.group_description}</p>
                    <p className="text-gray-600">Site Name: {siteName}</p>
                </div>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDelete(group.group_id)}
                >
                    Delete Group
                </button>
            </div>
        </div>
    );
}

export default GroupDetails;

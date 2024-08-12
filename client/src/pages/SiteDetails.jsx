import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Pagination from "./pagination.jsx";

function SiteDetails() {
    const { id } = useParams();
    const [site, setSite] = useState(null);
    const [profiles, setAllProfiles] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [groups, setGroups] = useState([]);

    const [isAdding, setIsAdding] = useState(false);
    const [siteId, setSiteId] = useState(1);
    const [currentGroupPage, setCurrentGroupPage] = useState(1);
    const [totalGroupPages, setTotalGroupPages] = useState(1);


    const [newGroup, setNewGroup] = useState({
        group_name: '',
        group_description: '',
        site_id: id,
    });

    useEffect(() => {
        fetchSiteDetails();
        fetchProfiles();
        fetchGroups();
    }, [siteId]);

    const fetchSiteDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/sug/${id}`);
            const data = await response.json();
            setSite(data);
        } catch (error) {
            console.error("Error fetching site details:", error);
        }
    };

    const fetchProfiles = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/p/s/${id}`);
            const profiles = await response.json();
            setAllProfiles(profiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    const fetchGroups = async () => {
        try {

            const response = await fetch(`http://localhost:8081/api/grp/s/${id}}`);
            const allGroups = await response.json();
            setAllGroups(allGroups);
            setGroups(allGroups.slice(0, 5));
            setTotalGroupPages(Math.ceil(allGroups.length / 2)); // Assuming 10 sites per page for pagination

            console.log(allGroups)
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };



    const handleSitePageChange = (page) => {
        setCurrentSitePage(page);
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        setGroups(allGroups.slice(startIndex, endIndex));
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup((prevGroup) => ({ ...prevGroup, [name]: value }));
    };

    const handleAddGroup = async (e) => {
        e.preventDefault();
        console.log(newGroup)

        try {
            const response = await fetch("http://localhost:8081/api/grp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newGroup),
            });

            if (response.ok) {
                fetchGroups(); // Re-fetch groups from the server
                setNewGroup({ group_name: '', group_description: '', site_id: id });
                setIsAdding(false);
            } else {
                console.error("Error adding group:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleProfilePageChange = (page) => {
        setCurrentProfilePage(page);

    };

    const handleGroupPageChange = (page) => {
        setCurrentGroupPage(page);
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        setGroups(allGroups.slice(startIndex, endIndex));
    };

    if (!site) {
        return <div>Loading site details...</div>;
    }

    return (
        <div className="SiteDetails p-6 bg-gray-100">
            <Navbar />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{/*site.name*/}</h1>
                <p className="text-gray-700 mb-6">{/*site.details*/}</p>

                <div className="flex gap-6">
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Profile Table</h2>
                            <Link to={`/s/cu/${siteId}`}>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add Profile
                                </button>
                            </Link>
                        </div>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden flex-grow">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Profile Name</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.length > 0 ? (
                                    profiles.map(profile => (
                                        <tr key={profile.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{profile.profile_id}</td>
                                            <td className="py-2 px-4 border-b">{profile.profile_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-2 px-4 text-center">No profiles available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination onPageChange={handleProfilePageChange} />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Group Table</h2>
                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {isAdding ? "Cancel" : "Add Group"}
                            </button>
                        </div>

                        {isAdding && (
                            <form onSubmit={handleAddGroup} className="mb-6">
                                <div className="mb-4">
                                    <label className="block text-gray-700">Group Name</label>
                                    <input
                                        type="text"
                                        name="group_name"
                                        value={newGroup.group_name}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        name="group_description"
                                        value={newGroup.group_description}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 p-2 rounded"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Group</button>
                            </form>
                        )}

                        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Group Name</th>
                                    <th className="py-2 px-4 border-b">Description</th>
                                    <th className="py-2 px-4 border-b">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.length > 0 ? (
                                    groups.map(group => (
                                        <tr key={group.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4 border-b">{group.group_id}</td>
                                            <td className="py-2 px-4 border-b">{group.group_name}</td>
                                            <td className="py-2 px-4 border-b">{group.group_description}</td>
                                            <td className="py-2 px-4 border-b text-center">
                                                <Link to={`/grp/${group.group_id}`} className="text-blue-500 hover:underline">
                                                    <i className="fas fa-arrow-right"></i> View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-2 px-4 text-center">No groups available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination totalPages={totalGroupPages} currentPage={currentGroupPage} onPageChange={handleGroupPageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteDetails;

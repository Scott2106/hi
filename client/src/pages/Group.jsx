import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Pagination from "./pagination.jsx";

function Group() {
    const [groups, setGroups] = useState([]);

    // For Pagination
    const [totalGroupPages, setTotalGroupPages] = useState(1);
    const [currentGroupPage, setCurrentGroupPage] = useState(1);
    const groupLimit = 5;

    //For Adding new group
        const [newGroup, setNewGroup] = useState({
        group_name: "",
        group_description: "",
    });
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const fetchGroups = () => {
        const baseUrl = "http://localhost:8081/api/grp";
        const queryParams = {
            page: currentGroupPage,
            limit: groupLimit
        };

        const url = new URL(baseUrl);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

        fetch(url)
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error("Error fetching groups:", error));
    };

    const allGroups = fetchGroups();

    useEffect(() => {
        if (allGroups) {
            const groupStartIndex = (currentGroupPage - 1) * groupLimit;
            const groupEndIndex = groupStartIndex + groupLimit;
            setGroups(allGroups.groups.slice(groupStartIndex, groupEndIndex));
            setTotalGroupPages(Math.ceil(allGroups.groups.length / groupLimit));
        }
    }, [allGroups, currentGroupPage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup((prevGroup) => ({
            ...prevGroup,
            [name]: value
        }));
    };

    const handleGroupPageChange = (page) => {
        setCurrentGroupPage(page);
    };

    const handleAddGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/api/grp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newGroup)
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                fetchGroups(); // Re-fetch groups from the server
                setNewGroup({ group_name: "", group_description: "" });
                setIsAdding(false);

                window.location.reload();
            } else {
                // Try to parse error message from the response
                const errorMessage = await response.text();
                //alert(`Error adding group: ${errorMessage}`);
            }
        } catch (error) {

            console.error("Error adding group:", error);
            window.location.reload();

            alert("An unexpected error occurred while adding the group. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <Navbar />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Group List</h1>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isAdding ? "Cancel" : "Add Group"}
                </button>

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
                        <div className="mb-4">
                            <label className="block text-gray-700">Site id</label>
                            <input
                                name="site_id"
                                value={newGroup.site_id}
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
                            <th className="py-2 px-4 border-b">Site</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.length > 0 ? (
                            groups.map(group => (
                                <tr key={group.group_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{group.group_id}</td>
                                    <td className="py-2 px-4 border-b">{group.group_name}</td>
                                    <td className="py-2 px-4 border-b">{group.group_description}</td>
                                    <td className="py-2 px-4 border-b">{group.site_id}</td>
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
    );
}

export default Group;

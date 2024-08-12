import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Pagination from "./pagination.jsx";

function User() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [totalUserPages, setTotalUserPages] = useState(1);
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const userLimit = 5;

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
    });
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // Fetch users only once
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/u');
                const allUsers = await response.json();

                setAllUsers(allUsers);
                setTotalUserPages(Math.ceil(allUsers.length / userLimit));
                // Set the users for the current page
                setUsers(allUsers.slice(0, userLimit));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Update displayed users when the current page changes
    useEffect(() => {
        const startIndex = (currentUserPage - 1) * userLimit;
        const endIndex = startIndex + userLimit;
        setUsers(allUsers.slice(startIndex, endIndex));
    }, [currentUserPage, allUsers]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleUserPageChange = (page) => {
        setCurrentUserPage(page);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/api/u", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                // Fetch updated user list after adding a user
                const response = await fetch('http://localhost:8081/api/u');
                const allUsers = await response.json();

                setAllUsers(allUsers);
                setTotalUserPages(Math.ceil(allUsers.length / userLimit));
                setUsers(allUsers.slice((currentUserPage - 1) * userLimit, currentUserPage * userLimit));
                setNewUser({ name: "", email: "" });
                setIsAdding(false);
            } else {
                const errorMessage = await response.text();
                alert(`Error adding user: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("An unexpected error occurred while adding the user. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <Navbar />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">User List</h1>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isAdding ? "Cancel" : "Add User"}
                </button>

                {isAdding && (
                    <form onSubmit={handleAddUser} className="mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700">User Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
                    </form>
                )}

                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">User Email</th>
                            <th className="py-2 px-4 border-b">View Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.user_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{user.user_id}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <Link to={`/s/u/${user.user_id}`} className="text-blue-500 hover:underline">
                                            <i className="fas fa-arrow-right"></i> View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 text-center">No users available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination
                    totalPages={totalUserPages}
                    currentPage={currentUserPage}
                    onPageChange={handleUserPageChange}
                />
            </div>
        </div>
    );
}

export default User;

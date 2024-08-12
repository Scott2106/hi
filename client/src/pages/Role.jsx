import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function Role() {
    const [roles, setRoles] = useState([]);

    //Adding New Roles
    const [newRole, setNewRole] = useState({
        role_name: "",
        role_description: "",
        permission_id: "",
    })
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    const fetchRoles = () => {
        console.log("fetchRoles");
        fetch("http://localhost:8081/api/r")
            .then(response => response.json())
            .then(data => setRoles(data))
            .catch(error => console.error("Error fetching roles:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRole((prevRole) => ({
            ...prevRole,
            [name]: value
        }));
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/api/r", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRole)
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
                fetchRoles();
                setNewRole({
                    role_name: "",
                    role_description: "",
                    permission_id: ""
                });
                setIsAdding(false);

                window.location.reload();
            } else {
                // Try to parse error message from the response
                const errorMessage = await response.text();
                //alert(`Error adding group: ${errorMessage}`);
            }
        } catch (error) {

            console.error("Error adding role:", error);
            window.location.reload();

            alert("An unexpected error occurred while adding the role. Please try again.");
        }
    };

    useEffect(() => { fetchRoles(); }, [])

    return (
        <div className="p-6">
            <Navbar />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Role List</h1>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isAdding ? "Cancel" : "Add Role"}
                </button>

                {isAdding && (
                    <form onSubmit={handleAddRole} className="mb-6">
                        <div className="mb-4">
                            <label className="block text-gray-700">Role Name</label>
                            <input
                                type="text"
                                name="role_name"
                                value={newRole.role_name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Description</label>
                            <textarea
                                name="role_description"
                                value={newRole.role_description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Permissions</label>
                            <select
                                name="permission_id"
                                value={newRole.permission_id}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                required
                            >
                                <option value="1">Permission 1</option>
                                <option value="2">Permission 2</option>
                                <option value="3">Permission 3</option>
                                <option value="4">Permission 4</option>
                            </select>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Role</button>
                    </form>
                )}

                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Role Name</th>
                            <th className="py-2 px-4 border-b">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? (
                            roles.map(role => (
                                <tr key={role.role_id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{role.role_id}</td>
                                    <td className="py-2 px-4 border-b">{role.role_name}</td>
                                    <td className="py-2 px-4 border-b">{role.role_description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-2 px-4 text-center">No roles available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Role;
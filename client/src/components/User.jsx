import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";

const mockUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" }
];

function User() {
    return (
        <div className="p-6">
            <Navbar />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">User List</h1>
                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">User Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{user.id}</td>
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 borber-b text-center">
                                    <Link to={`/s/u/${user.id}`} className="text-blue-500 hover:underline">
                                        <i className="fas fa-arrow-right"></i> View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default User;

import { useState } from "react";
import Navbar from "./Navbar";


const mockUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" }
];
function UserManagement() {
    return (
        <div className="p-6">
            <Navbar />

            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">User List</h1>
                <ul className="space-y-4">
                    {mockUsers.map(user => (
                        <li key={user.id} className="p-4 border-b border-gray-200 rounded-md bg-gray-50">
                            <div className="flex justify-between">
                                <div>
                                    <span className="text-lg font-semibold">{user.name}</span>
                                    <br />
                                    <span className="text-gray-600">{user.email}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default UserManagement;
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const mockUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", groups: ["Admin Group", "Power Users"], sites: ["Site A", "Site B"] },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", groups: ["Admin Group"], sites: ["Site A"] },
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", groups: ["Power Users", "Users Group"], sites: ["Site B"] },
    { id: 4, name: "Bob Brown", email: "bob.brown@example.com", groups: ["Users Group", "Support Team"], sites: ["Site B", "Site C"] },
    { id: 5, name: "Eve Davis", email: "eve.davis@example.com", groups: ["Guests Group", "Support Team"], sites: ["Site C"] },
    { id: 6, name: "Charlie White", email: "charlie.white@example.com", groups: ["Guests Group", "Support Team"], sites: ["Site C"] }
];

function UserDetails() {
    const { id } = useParams();
    const user = mockUsers.find(user => user.id === parseInt(id));

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="UserDetails p-6 bg-gray-100">
            <Navbar />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{user.name}</h1>
                <p className="text-gray-700 mb-4">{user.email}</p>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Groups</h2>
                    <ul className="list-disc pl-5 mb-4">
                        {user.groups.map((group, index) => (
                            <li key={index} className="text-gray-700">{group}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sites</h2>
                    <ul className="list-disc pl-5">
                        {user.sites.map((site, index) => (
                            <li key={index} className="text-gray-700">{site}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserDetails;

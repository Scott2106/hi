import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
//import Navbar from "./Navbar.jsx";
import SiteNavBar from "./SiteNavBar";
import Pagination from "./pagination.jsx";

// DELETE WHEN TABLE IS SET UP
const mockSites = [
    {
        id: 1,
        name: "Site A",
        accessLevel: "Admin",
        details: "Details about Site A",
        users: [
            { id: 1, name: "John Doe", email: "john.doe@example.com" },
            { id: 2, name: "Jane Smith", email: "jane.smith@example.com" }
        ],
        groups: [
            { id: 1, name: "Admin Group", description: "Group with admin access" },
            { id: 2, name: "Power Users", description: "Group with power user access" }
        ]
    },
    {
        id: 2,
        name: "Site B",
        accessLevel: "User",
        details: "Details about Site B",
        users: [
            { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
            { id: 4, name: "Bob Brown", email: "bob.brown@example.com" }
        ],
        groups: [
            { id: 3, name: "Users Group", description: "Group for regular users" },
            { id: 4, name: "Support Team", description: "Group providing support" }
        ]
    },
    {
        id: 3,
        name: "Site C",
        accessLevel: "Guest",
        details: "Details about Site C",
        users: [
            { id: 5, name: "Eve Davis", email: "eve.davis@example.com" },
            { id: 6, name: "Charlie White", email: "charlie.white@example.com" }
        ],
        groups: [
            { id: 5, name: "Guests Group", description: "Group for guests" }
        ]
    },
    // Add more site data as needed
];

function SiteDetails() {
    const { siteId } = useParams();
    const [users, setUsers] = useState([]);
    const [totalUserPages, setTotalUserPages] = useState(1);
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const userLimit = 1; // Number of users per page

    const [groups, setGroups] = useState([]);
    const [totalGroupPages, setTotalGroupPages] = useState(1);
    const [currentGroupPage, setCurrentGroupPage] = useState(1);
    const groupLimit = 1; // Number of groups per page

    const site = mockSites.find(site => site.id === parseInt(siteId));

    useEffect(() => {
        if (site) {
            const userStartIndex = (currentUserPage - 1) * userLimit;
            const userEndIndex = userStartIndex + userLimit;
            setUsers(site.users.slice(userStartIndex, userEndIndex));
            setTotalUserPages(Math.ceil(site.users.length / userLimit));

            const groupStartIndex = (currentGroupPage - 1) * groupLimit;
            const groupEndIndex = groupStartIndex + groupLimit;
            setGroups(site.groups.slice(groupStartIndex, groupEndIndex));
            setTotalGroupPages(Math.ceil(site.groups.length / groupLimit));
        }
    }, [site,currentUserPage, currentGroupPage]);

    const handleUserPageChange = (page) => {
        setCurrentUserPage(page);
    };

    const handleGroupPageChange = (page) => {
        setCurrentGroupPage(page);
    };

    if (!site) {
        return <div>Site not found</div>;
    }

    return (
        <div className="SiteDetails p-10 bg-gray-100">
            <SiteNavBar />
            <div className="bg-white p-10 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{site.name}</h1>
                <p className="text-gray-700 mb-6">{site.details}</p>

                <div className="flex gap-6">
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">User Table</h2>
                            <Link to={`/s/cu/${site.id}`}>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add User
                                </button>
                            </Link>
                        </div>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden flex-grow">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">User Name</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{user.id}</td>
                                        <td className="py-2 px-4 border-b">{user.name}</td>
                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination totalPages={totalUserPages} currentPage={currentUserPage} onPageChange={handleUserPageChange} />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Group Table</h2>
                            <Link to={`/s/cg/${site.id}`}>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add Group
                                </button>
                            </Link>
                        </div>
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
                                {groups.map(group => (
                                    <tr
                                        key={group.id}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="py-2 px-4 border-b">{group.id}</td>
                                        <td className="py-2 px-4 border-b">{group.name}</td>
                                        <td className="py-2 px-4 border-b">{group.description}</td>
                                        <td className="py-2 px-4 border-b text-center">
                                            <Link to={`/grp/${group.id}`} className="text-blue-500 hover:underline">
                                                <i className="fas fa-arrow-right"></i> View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
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

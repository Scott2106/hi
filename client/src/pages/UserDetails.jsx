import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function UserDetails() {
    const { user_id } = useParams();
    const [user, setUser] = useState([]);
    const [role, setRole] = useState([]);
    const [groups, setGroups] = useState([]);
    const [sites, setSites] = useState([]);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    const fetchData = async () => {
        try {
            const baseUrl = `http://localhost:8081/api/u/${user_id}`;
            const url = new URL(baseUrl);
            const response = await fetch(url);
            const data = await response.json();
            setUser(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const fetchRole = async () => {
        try {
            const baseUrl = `http://localhost:8081/api/r/1/${user_id}`;
            const url = new URL(baseUrl);
            const response = await fetch(url);
            const data = await response.json();
            setRole(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchRole();
    }, []);

    if (!user) {
        return (<div>Loading...</div>)
    }

    return (
        <div className="UserDetails p-6 bg-gray-100">
            <Navbar />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">User Details</h1>
                <p className="text-gray-700 mb-4"><strong>ID:</strong> {user.user_id}</p>
                <p className="text-gray-700 mb-4"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-700 mb-4"><strong>Status:</strong> {user?.um_status?.status_name || 'Unknown'}</p>
                <p className="text-gray-700 mb-4"><strong>Role:</strong> {role.role_name || 'Unknown'}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Groups</h2>
                <ul className="list-disc pl-5 mb-4">

                </ul>
            </div>
        </div>
    );
}

export default UserDetails;

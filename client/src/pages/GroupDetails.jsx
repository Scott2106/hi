import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Pagination from "./pagination.jsx";


function GroupDetails() {
    const [group, setGroup] = useState(null);

    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [totalUserPages, setTotalUserPages] = useState(1);


    const [allUsersFromGroup, setAllUsersFromGroup] = useState([]);
    const [usersFromGroup , setUsersFromGroup] = useState([]);
    const [currentUsersFromGroupPage, setCurrentUsersFromGroupPage] = useState(1);
    const [totalUsersFromGroupPages, setTotalUsersFromGroupPages] = useState(1);

    const { id } = useParams(); // Fetch group ID from URL parameters
    const navigate = useNavigate(); // Initialize useNavigate hook
   
    const site = [];
    //const users =[{},{}];
    useEffect(() => {
        fetchGroupDetails();
        
    }, [id]); // Dependency array includes id to fetch details when it changes

    useEffect(() => {
        if (group && group.group_id) {
            fetchAllUsersFromGroup();
            fetchAllUsersFromSite();
        }
    }, [group]);

    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/grp/${id}`);
            const data = await response.json();

            if (data) {
                setGroup(data);
            } else {
                console.error("Group not found");
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };

    const fetchAllUsersFromSite = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/sug/s/${group.site_id}`);
            const data = await response.json();
            console.log(data)
            if (data) {
                setAllUsers(data);
                setUsers(data.slice(0,5));
                setTotalUserPages(Math.ceil(data.length/5));
            } else {
                console.error("Users not found");
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };
 
    const fetchAllUsersFromGroup = async () => {
        try {
            console.log(group.group_id)
            const response = await fetch(`http://localhost:8081/api/sug/grp/${group.group_id}`);
            const data = await response.json();
            console.log(data)

            if (data) {
                setAllUsersFromGroup(data);

                setUsersFromGroup(data.slice(0,5));
                setTotalUsersFromGroupPages(Math.ceil(data.length/5));
            } else {
                console.error("Group not found");
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };
 

    const handleUserPageChange = (page) => {
        setCurrentUserPage(page);
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        setUsers(allUsers.slice(startIndex, endIndex));
    }

    const handleUserFromGroupPageChange = (page) => {
        setCurrentUsersFromGroupPage(page);
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        setUsersFromGroup(allUsersFromGroup.slice(startIndex, endIndex));
    }


    const handleDeleteGroup = async (groupId) => {
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

    const handleDeleteUser = async (site_user_group_id) => {
        try {
            await fetch(`http://localhost:8081/api/sug/${site_user_group_id}`, {
                method: "DELETE"
                
            });
            alert("User deleted from group successfully");
            fetchAllUsersFromGroup();
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    const handleAddUser = async (user_site_role_permission_id) => {
        try {
            console.log(user_site_role_permission_id);

            

            await fetch(`http://localhost:8081/api/sug/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_site_role_permission_id: user_site_role_permission_id,
                    group_id: group.group_id, // Ensure you use group_id from the group state
                })
            });
            
                alert("User added to group successfully");
                fetchAllUsersFromGroup(); // Optionally refresh users in the group            }else{}
    
            
    

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
                </div>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteGroup(group.group_id)}
                >
                    Delete Group
                </button>
            </div>

            <div className="SiteDetails p-6 bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{site.name}</h1>
                <p className="text-gray-700 mb-6">{site.details}</p>

                <div className="flex gap-6">
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">All User in site {group.site_id}</h2>
                           
                        </div>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden flex-grow">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Site</th>
                                    <th className="py-2 px-4 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{user.user_id}</td>
                                        <td className="py-2 px-4 border-b">{user.um_user.email}</td>
                                        <td className="py-2 px-4 border-b">{user.site_id}</td>
                                        <td className="py-2 px-4 border-b">  <button
                                onClick={() => handleAddUser(user.user_site_role_permission_id)}
                                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                 >
                                  Add
                                </button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination totalPages={totalUserPages} currentPage={currentUserPage}  onPageChange={handleUserPageChange} />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Users in {group.group_name}</h2>
                           
           
                        </div>
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Email</th>
                                    <th className="py-2 px-4 border-b">Site</th>
                                    <th className="py-2 px-4 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                            {usersFromGroup.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{user.um_user_site_role_permission.user_id}</td>
                                        <td className="py-2 px-4 border-b">{user.um_user_site_role_permission.um_user.email}</td>
                                        <td className="py-2 px-4 border-b">{user.um_user_site_role_permission.site_id}</td>
                                        <td className="py-2 px-4 border-b">
                                            
                                        <button
                                onClick={() => handleDeleteUser(user.site_user_group_id)}
                                 className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                 >
                                  Delete
                                </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination totalPages={totalUsersFromGroupPages} currentPage = {currentUsersFromGroupPage} onPageChange={handleUserFromGroupPageChange} />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default GroupDetails;

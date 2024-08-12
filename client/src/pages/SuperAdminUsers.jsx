import UserTable from "@/components/UserTable";
import { api } from "@/interceptors/axios";
import { useEffect } from "react";
import { useState } from "react";

import { RefreshCcw } from "lucide-react";

const SuperAdminUsers = () => {
  const [users, setUsers] = useState([]);

  const updateUserData = () => {
    api.get("/superAdmin/users").then((res) => {
      setUsers(res.data);
    });
  };

  useEffect(() => {
    // fetch users from backend
    updateUserData();
  }, []);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            updateUserData();
          }}
          className="mt-2 bg-gray-800 p-2 text-white rounded-md"
        >
          <RefreshCcw size={16} />
        </button>
      </div>
      <UserTable users={users} updateUserData={updateUserData} />
    </div>
  );
};

export default SuperAdminUsers;

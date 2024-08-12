import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { api, api_group_1 } from "@/interceptors/axios.js";

function Home() {
  const token_user_id = 1; //pretend user_id from token
  // const [users, setUsers] = useState([]);
  const [user_id, setUserId] = useState("");
  const [sites, setSites] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState([]);

  const fetchLoginUser = async () => {
    // TODO: change this later to get loginUser with token after asking
    // const baseUrl =  `http://localhost:8081/api/u/${token_user_id}`;
    // const url = new URL(baseUrl);

    try {
      const response = await api_group_1.get(`/u/${token_user_id}`);
      const data = response;
      setUser(data);
      const id = data.user_id;
      setUserId(id);
      console.log(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSites = async () => {
    try {
      const response = api_group_1.get(`/sug/u/${user_id}`);
      const data = response;
      setSites(data);
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await api_group_1.get(`/p/u/${user_id}`);
      const data = response;
      setProfiles(data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    fetchLoginUser();
    fetchSites();
    fetchProfiles();
  }, [user_id]);

  if (!user) {
    return <div>Page Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="container flex flex-col min-h-[50vh] items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="justify-center flex flex-col lg:flex-row w-full gap-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 sm:text-4xl lg:text-5xl">
            Welcome, User {user_id}!
          </h1>
        </div>
      </div>

      <div className="container my-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              User Details
            </h3>
            <div>
              <strong>Email:</strong> {user.email}{" "}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              {user?.um_status?.status_name || "Unknown"}{" "}
            </div>
          </div>
        </div>
      </div>
      <div className="container my-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Profiles
            </h3>
            <ul className="space-y-2">
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <li
                    key={profile.profile_id}
                    className="bg-gray-50 rounded-lg p-3 text-gray-800 shadow-sm"
                  >
                    <div>
                      <strong>Name:</strong> {profile.profile_name}
                    </div>
                    <div>
                      <strong>Status:</strong> {profile.status.status_name}
                    </div>
                    <div>
                      <Link
                        to={`/p/${profile.profile_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        <i className="fas fa-arrow-right"></i> View Details
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="bg-gray-50 rounded-lg p-3 text-gray-800 shadow-sm">
                  No profiles available.
                </li>
              )}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full lg:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sites</h3>
            <Link to={`/cs`} className="text-blue-500 hover:underline">
              <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                Create Site
              </button>
            </Link>
            <ul className="space-y-2">
              {sites.length > 0 ? (
                sites.map((site) => (
                  <li
                    key={site.site_id}
                    className="bg-gray-50 rounded-lg p-3 text-gray-800 shadow-sm"
                  >
                    <div>
                      <strong>Site Name:</strong> {site.um_site.site_name}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {site.um_site.site_description}
                    </div>
                    <div>
                      <strong>Role In Site:</strong>{" "}
                      {site.um_role_permission.um_role.role_name}
                    </div>
                    <div>
                      <Link
                        to={`/sug/${site.site_id}`}
                        className="text-blue-500 hover:underline"
                      >
                        <i className="fas fa-arrow-right"></i> View Details
                      </Link>
                    </div>
                  </li>
                ))
              ) : (
                <li className="bg-gray-50 rounded-lg p-3 text-gray-800 shadow-sm">
                  No sites available.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

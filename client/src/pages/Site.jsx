import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Pagination from "./pagination.jsx";
import { api_group_3 } from "@/interceptors/axios";
function Site() {
  const [sites, setSites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSites, setAllSites] = useState([]);
  const [currentSitePage, setCurrentSitePage] = useState(1);
  const [totalSitePages, setTotalSitePages] = useState(1);

  useEffect(() => {
    fetchAllSites();
  }, []);

  const fetchAllSites = async () => {
    try {
      const response = await api_group_3.get("/s/s");
      const sitesData = response.data;
      setAllSites(sitesData);
      setSites(sitesData.slice(0, 10)); // Display the first page of sites initially
      setTotalSitePages(Math.ceil(sitesData.length / 10)); // Assuming 10 sites per page for pagination
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Debugging: Log the search query
    console.log("Search Query:", searchQuery);

    const filteredSites = allSites.filter((site) =>
      site.site_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Debugging: Log the filtered sites
    console.log("Filtered Sites:", filteredSites);

    setSites(filteredSites.slice(0, 10)); // Display the first page of filtered sites
    setCurrentSitePage(1);
    setTotalSitePages(Math.ceil(filteredSites.length / 10));
  };

  const handleSitePageChange = (page) => {
    setCurrentSitePage(page);
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    setSites(allSites.slice(startIndex, endIndex));
  };

  // Function to map status_id to status description
  const getStatusDescription = (status_id) => {
    switch (status_id) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="Site p-6 bg-gray-100">
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          SITE
        </h1>
        <form onSubmit={handleSearchSubmit} className="mb-4 flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a site..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-full"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Site Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Access Level</th>
                <th className="py-2 px-4 border-b">Details</th>
                <th className="py-2 px-4 border-b">Setting</th>
              </tr>
            </thead>
            <tbody>
              {sites.length > 0 ? (
                sites.map((site) => {
                  return (
                    <tr
                      key={site.site_id}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="py-2 px-4 border-b">{site.site_id}</td>
                      <td className="py-2 px-4 border-b">{site.site_name}</td>
                      <td className="py-2 px-4 border-b">
                        {site.site_description}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {getStatusDescription(site.status_id)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {site.role_description}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <Link
                          to={`/sug/${site.site_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          <i className="fas fa-arrow-right"></i> View Details
                        </Link>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <Link
                          to={`/s/${site.site_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          <i className="fas fa-cog"></i> View Settings
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-2 px-4 text-center">
                    No sites available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            totalPages={totalSitePages}
            currentPage={currentSitePage}
            onPageChange={handleSitePageChange}
          />
        </div>
        <div className="flex justify-center mt-4">
                    <Link to="/cs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Create New Site
                    </Link>
                </div>
      </div>
    </div>
  );
}

export default Site;

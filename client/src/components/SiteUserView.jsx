import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SiteNavBar from "./SiteNavBar";
import Pagination from "./pagination.jsx";
import { api_group_3 } from "@/interceptors/axios";

function SiteUserView() {
  const { siteId } = useParams();
  const userId = 2;

  const [site, setSite] = useState({});
  const [functionalities, setFunctionalities] = useState([]);
  const [allowedPayments, setAllowedPayments] = useState([]);
  const [paymentError, setPaymentError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupedFunctionalities, setGroupedFunctionalities] = useState({});
  const [roleName, setRoleName] = useState("");
  const [pfuncNames, setPfuncNames] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [domain, setDomain] = useState({});

  useEffect(() => {
    // Fetch site details
    api_group_3
      .get(`/s/${siteId}`)
      .then((response) => {
        if (response.status === 403) {
          setShowModal(true);
          console.log(showModal);
          return null;
        }
        return response.data;
      })
      .then((data) => setSite(data))
      .catch((error) => console.error("Error fetching site details:", error));

    // Fetch functionalities
    api_group_3
      .get(`/func/s/${siteId}`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setFunctionalities(data);
        groupFunctionalities(data);
        fetchPfuncNames(data);
      })
      .catch((error) =>
        console.error("Error fetching functionalities:", error)
      );

    // Fetch user role
    api_group_3
      .get(`/s/${siteId}/ur`)
      .then((response) => setRoleName(response.data.role_name))
      .catch((error) => console.error("Error fetching user role:", error));

    // Fetch linked payments
    api_group_3
      .get(`/pmt/spmt/${siteId}`)
      .then((response) => {
        const data = response.data;
        if (data.message === "No Payment Method Linked to this Site") {
          setPaymentError("No payment methods linked to this site.");
          setAllowedPayments([]);
        } else {
          setAllowedPayments(data.data);
          setPaymentError("");
        }
      })
      .catch((error) =>
        console.error("Error fetching linked Payments:", error)
      );
  }, [siteId, userId]);

  const groupFunctionalities = (data) => {
    const grouped = data.reduce((acc, func) => {
      if (!acc[func.pfuncId]) {
        acc[func.pfuncId] = [];
      }
      acc[func.pfuncId].push(func);
      return acc;
    }, {});

    setGroupedFunctionalities(grouped);
    setTotalPages(Object.keys(grouped).length);
  };

  const fetchPfuncNames = (data) => {
    const uniquePfuncIds = [...new Set(data.map((func) => func.pfuncId))];
    console.log(uniquePfuncIds);
    uniquePfuncIds.forEach((pfuncId) => {
      api_group_3
        .get(`/pfunc/${pfuncId}`)
        .then((response) => {
          const pfunc = response.data;
          console.log("Fetched pfunc name:", pfunc);

          // Set the pfunc name in state
          setPfuncNames((prev) => ({
            ...prev,
            [pfuncId]: pfunc.pfuncName,
          }));

          // Set the domain based on featureId in state
          const domain = featureDomainMap[pfunc.featureId] || "Unknown Domain";
          setDomain((prev) => ({
            ...prev,
            [pfuncId]: domain,
          }));
        })
        .catch((error) => console.error("Error fetching pfunc name:", error));
    });
  };

  const featureDomainMap = {
    1: import.meta.env.VITE_G1_API_URL + "/", //'User Management',
    2: import.meta.env.VITE_G3_API_URL + "/", //'Site Management',
    3: import.meta.env.VITE_G2_API_URL + "/", //'Notification',
    4: import.meta.env.VITE_G4_API_URL + "/", //'Authentication',
    5: import.meta.env.VITE_G5_API_URL + "/", //'Asset Management',
    6: import.meta.env.VITE_G6_API_URL + "/", //"Activity"
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Domain copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const renderFunctionalities = () => {
    const pfuncIds = Object.keys(groupedFunctionalities);
    if (pfuncIds.length === 0) return null;
    const currentPfuncId = pfuncIds[currentPage - 1];
    const currentFuncs = groupedFunctionalities[currentPfuncId];
    return (
      <>
        <tr className="bg-gray-200">
          <td colSpan="7" className="py-2 px-4 border-b text-left font-bold">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-800">
                {pfuncNames[currentPfuncId] || "Loading..."}
              </span>
              {domain[currentPfuncId] && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 italic">
                    Domain: {domain[currentPfuncId]}
                  </span>
                  <button
                    className=" bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                    onClick={() => copyToClipboard(domain[currentPfuncId])}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>

        {currentFuncs.map((func) => (
          <tr key={func.funcid} className="hover:bg-gray-100">
            <td className="py-2 px-4 border-b">{func.funcId}</td>
            <td className="py-2 px-4 border-b">{func.funcName}</td>
            <td className="py-2 px-4 border-b">{func.funcDescription}</td>
            <td className="py-2 px-4 border-b">{func.method}</td>
            <td className="py-2 px-4 border-b">{func.endpointUrl}</td>
            <td className="py-2 px-4 border-b">{func.body}</td>
            {/* <td className="py-2 px-4 border-b">
                            <Link to={/browse/${func.funcId}}>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Browse
                                </button>
                            </Link>
                        </td> */}
          </tr>
        ))}
      </>
    );
  };

  const showUpdateBtn = [
    "User_SuperAdmin",
    "User_SiteOwner",
    "User_SiteAdmin",
    "User_SiteManager",
  ].includes(roleName);

  const Modal = ({ onClose, onActivate }) => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Current site is inactive
          </h2>
          <p className="mb-6">Do you want to activate this site?</p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onActivate}
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleActivate = () => {
    // Call the API to activate the site
    api_group_3
      .put(
        `/s/${siteId}/status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 403) {
          alert("You do not have permission to activate.");
          window.location.href = "/s";
          return;
        }
        return response.data;
      })
      .then((data) => {
        if (data) {
          window.location.href = `/s/${siteId}`;
        }
      })
      .catch((error) => console.error("Error activating site:", error));
  };

  const handleCancel = () => {
    // Redirect to the main page
    window.location.href = "/s";
  };

  if (showModal) {
    return <Modal onClose={handleCancel} onActivate={handleActivate} />;
  }

  if (!site) {
    return <div>site not found</div>;
  }

  return (
    <div className="SiteFunctionalities p-10 bg-gray-100">
      <SiteNavBar />
      <div className="bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{site.name}</h1>
        <p className="text-gray-700 mb-6">{site.description}</p>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Available Services
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Service Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Method</th>
                  <th className="py-2 px-4 border-b">Endpoint</th>
                  <th className="py-2 px-4 border-b">Request Body</th>
                </tr>
              </thead>
              <tbody>{renderFunctionalities()}</tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Linked Payment Methods
            </h2>
          </div>
          {paymentError ? (
            <div className="text-red-600">{paymentError}</div>
          ) : (
            <ul className="list-group">
              {allowedPayments.map((method, index) => (
                <li key={index} className="list-group-item">
                  {method.umPaymentMethod.paymentMethodName}
                </li>
              ))}
            </ul>
          )}
        </div>
        {showUpdateBtn && (
          <div className="flex justify-end mt-6">
            <Link to={`/s/${siteId}/sstng`}>
              <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700">
                Update Site Setting
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SiteUserView;

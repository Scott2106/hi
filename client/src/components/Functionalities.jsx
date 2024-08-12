import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Switch from "react-switch";
import { api_group_3 } from "@/interceptors/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@/components/ui/button";
const Functionalities = () => {
  const { featureId, siteId } = useParams();
  const [role, setRole] = useState([]);
  const [parentFunctionalities, setParentFunctionalities] = useState([]);
  const [childFunctionalities, setChildFunctionalities] = useState({});
  const [featureName, setFeatureName] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [childFuncStates, setChildFuncStates] = useState({});
  const [expandedChildFuncs, setExpandedChildFuncs] = useState({});
  const [childFuncDetails, setChildFuncDetails] = useState({});

  useEffect(() => {
    api_group_3
      .get(`/s/${siteId}/ur`)
      .then((response) => setRole(response.data.role_name))
      .catch((error) => console.error("Error fetching user role:", error));
  }, [siteId]);

  useEffect(() => {
    const fetchFeatureName = async () => {
      try {
        const response = await api_group_3.get(`/ft/${featureId}`);
        setFeatureName(response.data.featureName);
      } catch (error) {
        console.error("Error fetching the feature details!", error);
      }
    };

    const fetchParentFunctionalities = async () => {
      try {
        const response = await api_group_3.get(`/pfunc/ft/${featureId}`);
        const data = response.data;
        if (role === "User_SiteManager") {
          const managerRoleSetting = data.filter(
            (pfunc) => ![1, 2, 7, 9, 10].includes(pfunc.pfuncId)
          );
          setParentFunctionalities(managerRoleSetting);
        } else {
          setParentFunctionalities(data);
        }
      } catch (error) {
        console.error("Error fetching the functionalities!", error);
      }
    };

    fetchFeatureName();
    fetchParentFunctionalities();
  }, [featureId, role]);

  const fetchChildFunctionalities = async (pfuncId) => {
    try {
      const response = await api_group_3.get(`/func/pfunc/${pfuncId}`);
      const data = response.data;
      setChildFunctionalities((prevState) => ({
        ...prevState,
        [pfuncId]: data,
      }));
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[pfuncId];
        return newState;
      });
      data.forEach((childFunc) => fetchChildFuncState(childFunc.funcId));
    } catch (error) {
      console.error("Error fetching the child functionalities!", error);
      setErrorMessages((prevState) => ({
        ...prevState,
        [pfuncId]:
          error.response?.data?.message ||
          "Error fetching child functionalities",
      }));
    }
  };

  const fetchChildFuncState = async (funcId) => {
    try {
      const response = await api_group_3.get(`/sstng/${siteId}/func/${funcId}`);
      setChildFuncStates((prevState) => ({
        ...prevState,
        [funcId]: response.data.isEnabled,
      }));
    } catch (error) {
      console.error("Error fetching the child function state!", error);
    }
  };

  const fetchChildFuncDetails = async (funcId) => {
    try {
      const response = await api_group_3.get(`/func/${funcId}`);
      setChildFuncDetails((prevState) => ({
        ...prevState,
        [funcId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching the child function details!", error);
    }
  };

  const toggleChildFuncState = async (funcId) => {
    try {
      const newState = !childFuncStates[funcId];
      await api_group_3.put(`/sstng/${siteId}/func/${funcId}`, {
        isEnabled: newState,
      });
      setChildFuncStates((prevState) => ({
        ...prevState,
        [funcId]: newState,
      }));
    } catch (error) {
      console.error("Error updating the child function state!", error);
    }
  };

  const toggleChildFunctionalities = (pfuncId) => {
    if (childFunctionalities[pfuncId]) {
      setChildFunctionalities((prevState) => {
        const newState = { ...prevState };
        delete newState[pfuncId];
        return newState;
      });
      setErrorMessages((prevState) => {
        const newState = { ...prevState };
        delete newState[pfuncId];
        return newState;
      });
    } else {
      fetchChildFunctionalities(pfuncId);
    }
  };

  const toggleExpandChildFunc = (funcId) => {
    setExpandedChildFuncs((prevState) => ({
      ...prevState,
      [funcId]: !prevState[funcId],
    }));
    if (!expandedChildFuncs[funcId]) {
      fetchChildFuncDetails(funcId);
    }
  };

  const getSocialLoginLink = (funcName, siteId) => {
    const providerMap = {
      "Login with LinkedIn": "LinkedIn",
      "Login with GitHub": "GitHub",
      "Login with Google": "Google",
    };

    const provider = providerMap[funcName];

    return `/client/${siteId}/add-social-login/${provider}`;
  };

  return (
    <div className="bg-white p-6 w-75">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{featureName}</h2>
      <ul className="list-group">
        {parentFunctionalities.map((pfunc) => (
          <li key={pfunc.pfuncId} className="list-group-item py-3">
            <div
              onClick={() => toggleChildFunctionalities(pfunc.pfuncId)}
              className="cursor-pointer font-semibold text-gray-700"
            >
              {pfunc.pfuncName}
            </div>
            {Array.isArray(childFunctionalities[pfunc.pfuncId]) && (
              <ul className="list-group my-3">
                {childFunctionalities[pfunc.pfuncId].map((childFunc) => (
                  <li key={childFunc.funcId} className="list-group-item py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        onClick={() => toggleExpandChildFunc(childFunc.funcId)}
                        className="cursor-pointer text-gray-700"
                      >
                        {childFunc.funcName}
                        {(childFunc.funcName === "Login with LinkedIn" ||
                          childFunc.funcName === "Login with GitHub" ||
                          childFunc.funcName === "Login with Google") && (
                          <Link
                            to={getSocialLoginLink(childFunc.funcName, siteId)}
                          >
                            <Button className="mx-2" variant="link">
                              Enter Oauth Credentials
                            </Button>
                          </Link>
                        )}
                      </span>

                      <Switch
                        onChange={() => toggleChildFuncState(childFunc.funcId)}
                        checked={childFuncStates[childFunc.funcId]}
                        onColor="#00ff00"
                        offColor="#ff0000"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={20}
                        width={40}
                        className="ms-2"
                      />
                    </div>
                    {expandedChildFuncs[childFunc.funcId] &&
                      childFuncDetails[childFunc.funcId] && (
                        <div className="child-func-details my-2 mx-4 text-gray-600 py-3">
                          <p>
                            <strong>Endpoint URL:</strong>{" "}
                            {childFuncDetails[childFunc.funcId].endpointUrl}
                          </p>
                          <p>
                            <strong>Method:</strong>{" "}
                            {childFuncDetails[childFunc.funcId].method}
                          </p>
                          <p>
                            <strong>Description:</strong>{" "}
                            {childFuncDetails[childFunc.funcId].funcDescription}
                          </p>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            )}
            {errorMessages[pfunc.pfuncId] && (
              <div className="text-danger mt-2">
                {errorMessages[pfunc.pfuncId]}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Functionalities;

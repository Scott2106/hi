import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Button } from 'react-bootstrap';
import { api_group_3 } from '@/interceptors/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SiteNavBar = () => {
    const navigate = useNavigate();
    const { siteId } = useParams();
    const [roleName, setRoleName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReportsExpanded, setIsReportsExpanded] = useState(false);
    const [features, setFeatures] = useState([]);
    const [siteName, setSiteName] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [show, setShow] = useState(false);

    useEffect(() => {
        api_group_3.get(`/s/${siteId}/ur`)
            .then((response) => {
                setRoleName(response.data.role_name)
            console.log(response.data);
            })
            .catch((error) => console.error('Error fetching user role:', error));
    }, [siteId]);

    useEffect(() => {
        if (isExpanded) {
            const fetchFeatures = async () => {
                try {
                    const response = await api_group_3.get(`/ft`);
                    setFeatures(response.data);
                } catch (error) {
                    console.error("There was an error fetching the features!", error);
                }
            };
            fetchFeatures();
        }
    }, [isExpanded]);

    useEffect(() => {
        const fetchSiteBySiteId = async () => {
            try {
                const response = await api_group_3.get(`/s/${siteId}`);
                setSiteName(response.data.siteName);
            } catch (error) {
                console.error("There was an error fetching the site!", error);
            }
        };
        fetchSiteBySiteId();
    }, [siteId]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (tabName === 'Site Setting') {
            setIsExpanded((prevIsExpanded) => !prevIsExpanded);
            setIsReportsExpanded(false); // Collapse the other section
        } else if (tabName === 'Reports & Stats') {
            setIsReportsExpanded((prevIsReportsExpanded) => !prevIsReportsExpanded);
            setIsExpanded(false); // Collapse the other section
        } else {
            setIsExpanded(false);
            setIsReportsExpanded(false);
        }
    };

    const handleGoToSite = () => {
        navigate(`/s/${siteId}`);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <Button variant="primary" onClick={handleShow} className="m-10 px-3 py-2">
                <i className="bi bi-list"></i>
            </Button>

            <Offcanvas show={show} onHide={handleClose} className="bg-dark text-white">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-2xl text-white font-mono border-r-2 border-white whitespace-nowrap m-0 tracking-wide overflow-hidden animate-typing animate-blink-caret">
                        Auth INC
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <h2 className="cursor-pointer text-2xl text-white font-mono p-4" onClick={handleGoToSite}>
                        {siteName}
                    </h2>
                    <ul className="nav flex flex-col space-y-1">
                        <li className="nav-item">
                            <Link
                                className={`nav-link text-white hover:bg-gray-700 p-2 text-xl ${activeTab === 'Site Profile' ? 'active-tab' : ''}`}
                                to={`/s/${siteId}/sstng/pf/`}
                                onClick={() => {
                                    handleTabClick('Site Profile');
                                    handleClose();
                                }}
                            >
                                Site Profile
                            </Link>
                        </li>
                        {(roleName === 'User_SiteOwner' || roleName === 'User_SiteAdmin' || roleName === 'User_SiteManager' || roleName === 'User_SuperAdmin' )  && (
                            <>
                                <li className="nav-item">
                                    <span
                                        onClick={() => handleTabClick('Site Setting')}
                                        className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === 'Site Setting' ? 'active-tab' : ''}`}
                                    >
                                        Site Setting
                                    </span>
                                    {isExpanded && (
                                        <ul className="subnav-content flex flex-col space-y-1 ms-3">
                                            {features.map((feature) => (
                                                <li key={feature.featureId} className="nav-item">
                                                    <Link
                                                        className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === `feature-${feature.featureId}` ? 'active-tab' : ''}`}
                                                        to={`/s/${siteId}/sstng/ft/${feature.featureId}`}
                                                        onClick={() => {
                                                            setActiveTab(`feature-${feature.featureId}`);
                                                            handleClose();
                                                        }}
                                                    >
                                                        {feature.featureName}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === 'Payment Setting' ? 'active-tab' : ''}`}
                                        to={`/s/${siteId}/sstng/pmt`}
                                        onClick={() => {
                                            handleTabClick('Payment Setting');
                                            handleClose();
                                        }}
                                    >
                                        Payment Setting
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <span
                                        onClick={() => handleTabClick('Reports & Stats')}
                                        className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === 'Reports & Stats' ? 'active-tab' : ''}`}
                                    >
                                        Reports & Statistics
                                    </span>
                                    {isReportsExpanded && (
                                        <ul className="subnav-content flex flex-col space-y-1 ms-3">
                                            <li className="nav-item">
                                                <Link
                                                    className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === 'AuthInc Reports' ? 'active-tab' : ''}`}
                                                    to={`/s/${siteId}/sstng/authinc-reports`}
                                                    onClick={() => {
                                                        setActiveTab('AuthInc Reports');
                                                        handleClose();
                                                    }}
                                                >
                                                    AuthInc Reports
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link
                                                    className={`nav-link text-white hover:bg-gray-700 p-2 text-base ${activeTab === 'Site Reports' ? 'active-tab' : ''}`}
                                                    to={`/s/${siteId}/sstng/srp`}
                                                    onClick={() => {
                                                        setActiveTab('Site Reports');
                                                        handleClose();
                                                    }}
                                                >
                                                    Site Reports
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link text-white hover:bg-gray-700 p-2 text-base" to={`/s`} onClick={handleClose}>
                                Back To Site
                            </Link>
                        </li>
                    </ul>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default SiteNavBar;

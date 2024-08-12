import { Outlet } from 'react-router-dom';
//import Sidebar from './Sidebar.jsx';
//import SideNavBar from './SiteNavBar.jsx';
import SiteNavBar from "./SiteNavBar";

const SiteSetting = () => {


  return (
    <div className="site-setting d-flex" style={{ minHeight: '100vh' }}>
      <SiteNavBar />
      <div className="flex-grow-1">
        <Outlet /> {/* Render child routes */}
      </div>
    </div>
  );
};

export default SiteSetting;
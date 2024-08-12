import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { setupInterceptors } from "./interceptors/axios";
import { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

import LogInPage from "./pages/LogInPage";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import OAuthProviderDetailForm from "./components/OAuthProviderDetailForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SuperAdminTemplate from "./pages/SuperAdminTemplate";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminSites from "./pages/SuperAdminSites";
import SuperAdminReports from "./pages/SuperAdminReports";
import SuperAdminLogs from "./pages/SuperAdminLogs";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyUser from "./pages/VerifyUser";
import Login from "./pages/Login";
import CreateSite from "./pages/CreateSite";
import LandingPage from "./pages/LandingPage";
import LogsHome from "./pages/logsHome.jsx";
import LogsSomething from "./pages/logsSomething.jsx";
import LogsBoard from "./pages/logsBoard.jsx";
import LogStatistics from "./pages/logsStatistics";
import {
  api,
  api_group_1,
  api_group_2,
  api_group_3,
  api_group_5,
  api_group_6,
} from "./interceptors/axios";

// Group 1 imports

import Home from "./pages/Home.jsx";
import User from "./pages/User.jsx";
import Site from "./pages/Site.jsx";
import Profile from "./pages/Profile.jsx";
import Role from "./pages/Role.jsx";
import Group from "./pages/Group.jsx";
import UserManagement from "./pages/UserManagement.jsx";
import SiteDetails from "./pages/SiteDetails.jsx";
import GroupDetails from "./pages/GroupDetails.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import FormBuilder from "./pages/FormBuilder";
import FormDisplay from "./pages/FormDisplay";
import FormFieldsDisplay from "./pages/FormFieldsDisplay";
import ProfileDetails from "./pages/ProfileDetails";
import CreateSiteForm from "./components/CreateSiteForm";
import CreateEmail from "./pages/CreateEmail";
import ProfileSelectionModal from "./pages/ProfileSelectionModal";

import Functionalities from "./components/Functionalities";
import SiteSetting from "./components/SiteSetting";
import PaymentSetting from "./components/PaymentSetting";
import ReportSetting from "./components/ReportSetting";
import SiteReportSetting from "./components/SiteReportSetting";
import SiteProfile from "./components/SiteProfile";
import SiteUserView from "./components/SiteUserView";
import Error403 from "./pages/Error403";


// group 5 imports 

import { GalleryProvider } from './contexts/GalleryContext'; // Import GalleryProvider
import AlbumPage from './pages/albumPage';
import GalleryPage from './pages/GalleryPage'; // Import GalleryPage
import ImagePage from './pages/ImagePage';


function App() {
  const { accessToken, updateAccessToken } = useAuth();

  useEffect(() => {
    setupInterceptors(
      [api, api_group_1, api_group_2, api_group_3, api_group_5, api_group_6],
      () => accessToken,
      updateAccessToken
    );
  }, [accessToken, updateAccessToken]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogInPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmEmail" element={<ConfirmEmail />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyEmail" element={<VerifyEmail />} />
        <Route path="/verifyUser" element={<VerifyUser />} />

        <Route path="/createSite" element={<CreateSite />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route
          path="/client/:site_id/add-social-login/LinkedIn"
          element={<OAuthProviderDetailForm provider_name="LinkedIn" />}
        />
        <Route
          path="/client/:site_id/add-social-login/Google"
          element={<OAuthProviderDetailForm provider_name="Google" />}
        />
        <Route
          path="/client/:site_id/add-social-login/Github"
          element={<OAuthProviderDetailForm provider_name="Github" />}
        />
         <Route
          path="/error/403"
          element={<Error403/>}
        />
        {/* Auth Team */}
        <Route path="/superAdmin" element={<SuperAdminTemplate />}>
          <Route path="/superAdmin" element={<SuperAdminUsers />} />
          <Route path="/superAdmin/users" element={<SuperAdminUsers />} />
          <Route path="/superAdmin/sites" element={<SuperAdminSites />} />
          <Route path="/superAdmin/reports" element={<SuperAdminReports />} />
          <Route path="/superAdmin/logs" element={<SuperAdminLogs />} />
        </Route>
        {/* Asset Management
        <Route path="/galleries" element={<GalleryPage />} />
          <Route path="/albums" element={<AlbumPage />} /> 
          <Route path="/images" element={<ImagePage />} /> 
          <Route path = "/albums/:album_id" element={<ImagePage />} /> */}
        {/* User Management Team */}
        <Route path="/home" element={<Home />} />
        <Route path="/um" element={<UserManagement />} />
        <Route path="/s" element={<Site />} />
        <Route path="/s/u" element={<User />} />
        <Route path="/s/p" element={<Profile />} />
        <Route path="/p/:profile_id" element={<ProfileDetails />} />
        <Route path="/s/lp" element={<ProfileSelectionModal />} />
        <Route path="/s/r" element={<Role />} />
        <Route path="/s/grp" element={<Group />} />
        <Route path="/sug/:site_id" element={<SiteDetails />} />
        <Route path="/grp/:group_id" element={<GroupDetails />} />
        <Route path="/s/cu/:site_id" element={<CreateUser />} />
        <Route path="/s/u/:user_id" element={<UserDetails />} />
        <Route path="/fmbd" element={<FormBuilder />} />
        <Route path="/fm/:id" element={<FormDisplay />} />
        <Route path="fmfd/:fmId" element={<FormFieldsDisplay />} />

        {/* Audit Team */}
        <Route path="/logsHome" element={<LogsHome />} />
        <Route path="/logsSomething" element={<LogsSomething />} />
        <Route path="/logsBoard" element={<LogsBoard />} />
        <Route path="/logsBoard-pagination" element={<LogsBoard-pagination />} />
        <Route path="/logsStatistics" element={<LogStatistics />} />
        {/* Site Management Team */}
        <Route path="/cs" element={<CreateSiteForm />} />
        <Route path="/s/:siteId" element={<SiteUserView />} />
        <Route path="/s/:siteId/sstng" element={<SiteSetting />}>
          <Route path="ft/:featureId" element={<Functionalities />} />
          <Route path="pmt" element={<PaymentSetting />} />
          <Route path="authinc-reports" element={<ReportSetting />} />
          <Route path="srp" element={<SiteReportSetting />} />
          <Route path="pf" element={<SiteProfile />} />
        </Route>
        <Route path="/ce/:site_id" element={<CreateEmail />} />
      </Routes>
      {/* GROUP 5  */}
      <GalleryProvider>
        <Routes>
        {/* <Route path="/" element={<LogInPage />} />
          <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/galleries" element={<GalleryPage />} />
          <Route path="/albums" element={<AlbumPage />} /> 
          <Route path="/images" element={<ImagePage />} /> 
          <Route path = "/albums/:album_id" element={<ImagePage />} />
          {/* {<Route path = "/settings" element={<ProviderPage />} />} */}
          {/* Redirect all other routes to /albums */}
          {/* <Route path="*" element={<Navigate to="/albums" replace />} /> */}
        </Routes>
      </GalleryProvider>
    </Router>
  );
}

export default App;

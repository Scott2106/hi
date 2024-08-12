import { Button } from "./ui/button";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ChromeIcon } from "lucide-react";
import { PropTypes } from "prop-types";
import axios from "axios";

const OAuthButton = ({ provider }) => {

  const OAuthHandle = async (provider) => {
    try {
      const response = await axios({
        method: "GET",
        url: import.meta.env.VITE_G4_API_URL + `/api/OAuth/authorize/${provider}`,
        responseType: "json",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "site-api-key": import.meta.env.VITE_SITE1_API_KEY,
        },
      });
      
      console.log(response.data.authURL);
      window.location.href = response.data.authURL;
    } catch (error) {
      console.log("Error Authorizing User:", error);
    }
  };

  const providerConfigs = {
    Github: {
      icon: <GitHubLogoIcon className="mr-2 h-4 w-4" />,
      style: "bg-gray-500 text-white hover:bg-gray-700",
    },
    LinkedIn: {
      icon: <LinkedInLogoIcon className="mr-2 h-4 w-4" />,
      style: "bg-blue-500 text-white hover:bg-blue-700",
    },
    Google: {
      icon: <ChromeIcon className="mr-2 h-4 w-4" />,
      style: "bg-red-500 text-white hover:bg-red-600",
    },
  };

  const { icon, style } = providerConfigs[provider] || {};

  return (
    <Button
      className={`w-full ${style}`}
      onClick={() => OAuthHandle(provider)}
    >
      {icon}
      Continue with {provider}
    </Button>
  );
};

OAuthButton.propTypes = {
  provider: PropTypes.string,
  siteId: PropTypes.string,
};


export default OAuthButton;

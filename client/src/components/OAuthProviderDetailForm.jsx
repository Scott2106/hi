import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { ChromeIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/interceptors/axios";
const providerIcons = {
  Github: <GitHubLogoIcon className=" h-14 w-14" />,
  LinkedIn: <LinkedInLogoIcon className=" h-14 w-14" />,
  Google: <ChromeIcon className=" h-14 w-14" />,
};

const OAuthProviderDetailForm = ({ provider_name }) => {
  const { site_id } = useParams(); // Get site_id from URL params
  const navigate = useNavigate();
  const [credentialsExists, setcredentialsExists] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await api({
          method: "GET",
          url: `/OAuth/sites/${site_id}/providers/${provider_name}/credentials`,
          responseType: "json",
        });

        if (response.data) {
          setValue("client_id", response.data.client_id);
          setValue("client_secret", response.data.client_secret);
          setcredentialsExists(true);
        }
      } catch (error) {
        setcredentialsExists(false);
        console.error("Error fetching credentials", error);
        if (error.response && error.response.status === 403) {
          navigate("/error/403"); // Replace with the actual route you want to redirect to
        }
        
      }
    };

    fetchCredentials();
  }, [site_id, provider_name, setValue]);

  useEffect(() => {
    setValue("provider_name", provider_name);
  }, [provider_name, setValue]);

  const onSubmit = async (data) => {
    try {
      const { client_id, client_secret } = data;
      const method = credentialsExists ? "PUT" : "POST";
      const response = await api({
        method: method,
        url: `/OAuth/sites/${site_id}/providers/${provider_name}/credentials`,
        responseType: "json",
        data: {
          client_id,
          client_secret,
        },
      });

      // to handle both update and create request
      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message);
        setcredentialsExists(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error Saving/updating Credentials");
    }
  };

  const handleCancel = async () => {
    navigate(`/client/${site_id}/add-social-login`);
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" bg-black h-screen flex flex-col justify-center"
      >
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Social Sign Ins</CardTitle>
            <CardDescription>
              Enter OAuth provider details to add social sign-in to your site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="provider-name">Provider Name</Label>
                  <Input
                    id="provider-name"
                    defaultValue={provider_name}
                    disabled
                  />
                </div>
                <div className="col-span-1 grid gap-2">
                  <Label htmlFor="provider-icon">Icon</Label>
                  <div id="provider-icon" className="flex items-center">
                    {providerIcons[provider_name]}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client_id">Client Id</Label>
                <Input
                  className={`border p-2 rounded ${
                    errors.client_id ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("client_id", {
                    required: "Client id is required",
                    minLength: {
                      value: 5,
                      message: "Client id must be at least 5 characters",
                    },
                  })}
                  id="client_id"
                  type="text"
                  placeholder="very secret client id"
                />
                {errors.client_id && (
                  <p className="text-red-500">{errors.client_id.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client_secret">Client Secret Key</Label>
                <Input
                  className={`border p-2 rounded ${
                    errors.client_secret ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("client_secret", {
                    required: "Client secret key is required",
                    minLength: {
                      value: 5,
                      message:
                        "Client secret key must be at least 5 characters",
                    },
                  })}
                  id="client_secret"
                  type="password"
                  placeholder="very secret client secret"
                />
                {errors.client_secret && (
                  <p className="text-red-500">{errors.client_secret.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to={`/s/${site_id}/sstng/ft/4`}>
              <Button
                variant="link"
                className="ml-auto text-sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Link>

            <Button
              className="ml-3"
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : credentialsExists
                ? "Update"
                : "Save"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

OAuthProviderDetailForm.propTypes = {
  provider_name: PropTypes.string.isRequired,
};

export default OAuthProviderDetailForm;

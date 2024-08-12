import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

import { api } from "../interceptors/axios";

export function VerifyUserTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const onSubmit = async () => {
    // Reset messages
    setMessage("");
    setErrorMessage("");

    try {
      const response = await api.post(
        `/user/verify`,
        { token },
        { responseType: "json" }
      );
      if (response.status === 200) {
        setMessage("Verification Successful. Redirecting to Home Page....");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    } catch (error) {
      if (
        error.response.status === 400 ||
        error.response.status === 404 ||
        error.response.status === 500
      ) {
        setErrorMessage("Invalid Link. Please try again....");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };

  return (
    <Card className="w-[400px] bg-transparent">
      <CardHeader className="text-white">
        <CardTitle className="text-center">Welcome to AuthINC</CardTitle>
      </CardHeader>
      <CardContent>
        <Shield className="w-20 h-20 text-slate-300 mx-auto" />
        <CardDescription className="mt-3 text-white text-center">
          AuthINC is an authentication and authorization Software as a Service
          (SaaS) application.
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col space-y-1">
        <Button variant="outline" onClick={onSubmit}>
          Continue
        </Button>
        <span className="text-sm text-green-400">{message}</span>
        <span className="text-sm text-red-400">{errorMessage}</span>
      </CardFooter>
    </Card>
  );
}

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

export function VerifyEmailTemplate() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state.email;

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Send a request to the server to resend the verification email
  const handleResendEmail = async () => {
    // Reset the message and error message
    setMessage("");
    setErrorMessage("");

    try {
      const response = await api.post(
        "/request/resend_email",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201 || response.status === 204) {
        setMessage("Email has been sent successfully");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <Card className="w-[400px] bg-transparent">
      <CardHeader className="text-white">
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent>
        <Shield className="w-20 h-20 text-slate-300 mx-auto" />
        <CardDescription className="flex justify-center mt-3 text-white">
          We have sent an email to
          <span className="text-blue-600 font-bold ml-1">{email}</span>
        </CardDescription>
        <CardDescription className="mt-3 text-white">
          Please click on the link to activate your account. If you do not see
          the email in your inbox, check your spam folder.
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Login
        </Button>
        <Button variant="outline" onClick={() => handleResendEmail()}>
          Resend Email
        </Button>
      </CardFooter>
      <CardDescription className = "text-center mb-3">
        {message && (
          <span className="text-green-400">{message}</span>
        )}
        {errorMessage && (
          <span className="text-red-400">{errorMessage}</span>
        )}
      </CardDescription>
    </Card>
  );
}

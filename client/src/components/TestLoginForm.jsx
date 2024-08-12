import OAuthButton from "./OAuthButton";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { api } from "../interceptors/axios";
import validator from "validator";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUserLogin = async (email, password) => {
    try {
      const response = await api.post(
        "/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/home");
      } else if (response.status === 201 || response.status === 204) {
        navigate("/verifyEmail", { state: { email } });
      }
    } catch (error) {
      if (error.response.status === 401) {
        window.alert("Unauthorized.");
      } else {
        // Handle network error
        console.error("An error occurred:", error);
        window.alert(error);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    navigate("/forgotPassword");
  };

  const getUserDetails = async (event) => {
    event.preventDefault();
    if (!validator.isEmail(email)) {
      setError("Invalid email address.");
      return;
    } else if (validator.isEmpty(email)) {
      setError("Email is required.");
      return;
    }

    if (validator.isEmpty(password)) {
      setError("Password is required.");
      return;
    }

    // Normalize and escape email only after validation
    const normalizedEmail = validator.normalizeEmail(email);
    const escapedEmail = validator.escape(normalizedEmail);
    setEmail(escapedEmail);

    setError(""); // Clear previous errors
    try {
      await fetchUserLogin(escapedEmail, password);
    } catch (err) {
      setError("An error occurred during registration.");
    }
  };

  return (
    <Card className=" w-2/6 mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={getUserDetails} className="grid gap-4">
          <div className="grid gap-2 form">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="grid gap-2 form">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              id="password"
            />
          </div>
          <div>
            <Button type="submit" className="w-full mt-3">
              Login
            </Button>
          </div>
          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </form>

        <div className="space-y-4">
          <OAuthButton className="w-full" provider="Google" siteId={"1"} />
          <OAuthButton className="w-full" provider="Github" siteId={"1"} />
          <OAuthButton className="w-full" provider="LinkedIn" siteId={"1"} />
        </div>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

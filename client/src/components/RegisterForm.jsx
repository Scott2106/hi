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
import { Link, useNavigate } from "react-router-dom";
import { api } from "../interceptors/axios";
import validator from "validator";
import PasswordInstructions from "./PasswordInstructions";
// import axios from 'axios';

// set password criteria
const validatePassword = (password) => {
    const criteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return criteria.test(password);
};

const RegisterForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const getUserDetails = async (event) => {
        event.preventDefault();
        
        let error; 
        if (!validator.isEmail(email)) {
            error = "Invalid email address.";
            setError(error);
            window.alert(errorMsg);
            console.log(errorMsg);
            return;
        }
        else if (validator.isEmpty(email)) {
            error = "Email is required.";
            setError(error);
            window.alert(errorMsg);
            console.log(errorMsg);
            return;
        }
        if (validator.isEmpty(password) || validator.isEmpty(confirmPassword)) {
                       error ="Password is required.";
            setError(error);
            window.alert(errorMsg);
            console.log(errorMsg);
            return;
        }
        else if (!validatePassword(password) || !validatePassword(confirmPassword)) {
            error = "Password doesn't meet the criteria.";
            setError(error);
            window.alert(errorMsg);
            return;
        }
        else if (password !== confirmPassword) {
            error = "Passwords don't match."
            setError(error);
            window.alert(errorMsg);
            return;
        }

        // Normalize and escape email
        const normalizedEmail = validator.normalizeEmail(email);
        const escapedEmail = validator.escape(normalizedEmail);
        console.log(escapedEmail);
        setEmail(escapedEmail);

        setError(""); // Clear previous errors

        const fetchUserRegister = async (email, password) => {
            try {
                const response = await api.post(
                    'user/register',
                    {
                        email,
                        password,
                    },
                    {
                        responseType: "json",
                        withCredentials: true
                    },
                );

                console.log(response);
                if (response.status === 200 || response.status === 201) {
                    navigate(`/verifyEmail`, { state: { email: email } });
                } else {
                    console.error("Registration failed with status:", response.status);
                    window.alert("Registration failed. Please try again.");
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    // Handle the case where the user already exists
                    setError(error.response);
                    console.log(error);
                    window.alert("Error registering user.");
                } else {
                    // Handle network error
                    setError("An error occurred. Please try again later.");
                    window.alert(errorMsg);
                    console.log(error);
                }
            }
        };

        await fetchUserRegister(escapedEmail, password);
    };

    return (
        <Card className="w-2/6 mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>Enter your email below to register</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={getUserDetails} className="grid gap-4">
                    <div className="grid gap-3 form">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                    </div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                        id="password"
                    />

                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        required
                        id="password"
                    />
                    <PasswordInstructions />
                    <div>
                        <Button type="submit" className="w-full mt-3">
                            Register
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Log in
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

 export default RegisterForm;

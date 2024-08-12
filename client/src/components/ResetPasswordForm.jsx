import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import PasswordInstructions from "./PasswordInstructions";

import axios from "axios";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(20, { message: "Password must be at most 20 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[!@#$%^&*]/, {
    message: "Password must contain at least one special character.",
  });

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    // Reset messages
    setMessage("");
    setErrorMessage("");
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const response = await axios.put(
        `${import.meta.env.VITE_G4_API_URL}/api/request/reset_password`,
        { password: values.password, token: token },
        { responseType: "json" }
      );
      if (response.status === 204) {
        setMessage("Password Reset Successfully. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        setErrorMessage("Invalid Link. Please try again....");
        setTimeout(() => {
          navigate("/forgotPassword");
        }, 3000);
      }
    }
  };

  return (
    <Card className="w-[400px] bg-transparent">
      <CardHeader className="text-white">
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-white">New Password</FormLabel>
                  <FormControl className="mt-3 bg-transparent">
                    <Input className="text-white" type="password" {...field} />
                  </FormControl>
                  {form.formState.errors.password && (
                    <FormMessage className="text-red-400">
                      {form.formState.errors.password.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-white">
                    Confirm New Password
                  </FormLabel>
                  <FormControl className="mt-3 bg-transparent">
                    <Input className="text-white" type="password" {...field} />
                  </FormControl>
                  {form.formState.errors.confirmPassword && (
                    <FormMessage className="text-red-400">
                      {form.formState.errors.confirmPassword.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <PasswordInstructions />
            <Button type="submit" className="bg-white text-black mt-4">
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <span className="text-green-400 text-sm text-center">{message}</span>
        <span className="text-red-400 text-sm text-center">{errorMessage}</span>
      </CardFooter>
    </Card>
  );
}

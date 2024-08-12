import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import axios from "axios";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values) => {
    setMessage("");
    setErrorMessage("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_G4_API_URL}/api/request/forgot_password`,
        { email: values.email },
        { responseType: "json" }
      );
      if (response.status === 201) {
        setMessage("If email exists, a password reset link will be sent.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage("Unable to reset password. Redirecting to login....");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email Address</FormLabel>
              <FormDescription className="text-slate-400">
                Enter your verified email address
              </FormDescription>
              <FormControl className="mt-4 bg-transparent">
                <Input
                  className="text-slate-300 placeholder:text-slate-600"
                  placeholder={"johndoe@example.com"}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 mt-3"/>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-white text-black mt-4">
          Send Reset Link
        </Button>
        <FormMessage className="text-red-400 mt-4">{errorMessage}</FormMessage>
        <FormMessage className="text-green-400 mt-4">{message}</FormMessage>
      </form>
    </Form>
  );
}

import { Link } from "react-router-dom";
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

import { api } from "../interceptors/axios";

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

const emailSchema = z.string().email("Please enter a valid email address.");

const formSchema = z.object({
  password: passwordSchema,
  email: emailSchema,
});

export function RegisterForm() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setMessage("");
    try {
      const response = await axios.post(
        'http://localhost:5432/api/user/register',
        { email: values.email, password: values.password },
        { responseType: "json", withCredentials: true },
      );
      if (response.status === 201) {
        // setMessage({response});
        navigate(('/verifyEmail'), { state: { email: values.email } });
      }
    } catch (error) {
      if (error.response.status === 409) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again later.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
  };

  return (
    <Card className="w-[400px] bg-transparent">
      <CardHeader className="text-white">
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl className="mt-3 bg-transparent">
                    <Input className="text-white" type="" {...field} />
                  </FormControl>
                  {form.formState.errors.email && (
                    <FormMessage className="text-red-400">
                      {form.formState.errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-white">Password</FormLabel>
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
            <PasswordInstructions />
            <Button type="submit" className="bg-white text-black mt-4">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-white text-sm flex flex-col space-y-2">
        <p>
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 underline">
            Login
          </Link>
        </p>
        {message && <div className="text-red-400">{message}</div>}
      </CardFooter>
    </Card>
  );
}
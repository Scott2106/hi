/* eslint-disable react/prop-types */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

export default function EmailForm({ defaultEmail }) {
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail != "null" ? defaultEmail : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    const urlParams = new URLSearchParams(window.location.search);
    const provider_id = urlParams.get("provider");
    const oauthId = urlParams.get("oauthId");

    const response = await axios({
      method: "POST",
      url: import.meta.env.VITE_G4_API_URL + `/api/OAuth/user/1/${provider_id}`,
      data: {
        email: values.email,
        oauthId: oauthId,
      },
      responseType: "json",
      withCredentials: true,
    });
    console.log(response);
    if (response.status === 200) {
      window.location.href = "/home";
    } else {
      console.error("Registration failed with status:", response.status);
      window.alert("Registration failed. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">
                {defaultEmail != "null"
                  ? "Do you want to use this email?"
                  : "Enter your email"}
              </FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

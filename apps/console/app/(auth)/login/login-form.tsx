"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { unwrapSafePromise } from "@inklate/common/promise";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialProviders } from "./social-provider";
import { LoginType, loginSchema } from "../types";
import { siteConfig } from "~/utils/site-config";
import { EmailProvider } from "./email-provider";
import { authClient } from "~/lib/auth-client";
import { cn } from "@inklate/ui/lib/utils";
import { toast } from "@inklate/ui/sonner";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Form } from "@inklate/ui/form";
import { Link } from "react-router";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (values: LoginType) => {
      return unwrapSafePromise(
        authClient.signIn.email({
          email: values.email,
          password: values.password,
          rememberMe: true
        })
      );
    },
    onSuccess: () => navigate("/"),
    onError: (error) => toast.error(error.message)
  });

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const typedMutation = loginMutation as unknown as UseMutationResult<void, Error, LoginType>;
  const onSubmit = (values: LoginType) => loginMutation.mutate(values);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-gray-200">
        <CardHeader className="flex justify-center">
          <Link to="/" aria-label="go home">
            <Avatar className="size-8 rounded-md">
              <AvatarImage src={siteConfig.icon} alt="app logo" />
              <AvatarFallback>{siteConfig.name.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <CardTitle className="mt-4">Log in to inklate</CardTitle>
          <CardDescription>Welcome back! Log in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <SocialProviders loginMutation={typedMutation} />
              <hr className="my-4 border-dashed" />
              <EmailProvider form={form} loginMutation={typedMutation} />

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { unwrapSafePromise } from "@inklate/common/promise";
import { type SigninType, signinSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialProviders } from "./social-provider";
import { EmailProvider } from "./email-provider";
import { siteConfig } from "~/lib/site-config";
import { authClient } from "~/lib/auth-client";
import { cn } from "@inklate/ui/lib/utils";
import { toast } from "@inklate/ui/sonner";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Form } from "@inklate/ui/form";
import { Link } from "react-router";

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: async (values: SigninType) => {
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

  const form = useForm<SigninType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: SigninType) => signInMutation.mutate(values);
  const typedMutation = signInMutation as unknown as UseMutationResult<void, Error, SigninType>;

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
          <CardTitle className="mt-4">Sign In to inklate</CardTitle>
          <CardDescription>Welcome back! Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <SocialProviders signInMutation={typedMutation} />
              <hr className="my-4 border-dashed" />
              <EmailProvider form={form} signInMutation={typedMutation} />

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

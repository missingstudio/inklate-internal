"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { unwrapSafePromise } from "@inklate/common/promise";
import { type SignupType, signupSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocialProviders } from "./social-provider";
import { siteConfig } from "~/utils/site-config";
import { EmailProvider } from "./email-provider";
import { Link, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import { cn } from "@inklate/ui/lib/utils";
import { useForm } from "react-hook-form";
import { Form } from "@inklate/ui/form";
import { toast } from "sonner";

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const signupMutation = useMutation({
    mutationFn: async (values: SignupType) => {
      await unwrapSafePromise(
        authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/"
        })
      );

      return navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    },
    onError: (error) => toast.error(error.message)
  });

  const form = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: SignupType) => signupMutation.mutate(values);
  const typedMutation = signupMutation as unknown as UseMutationResult<void, Error, SignupType>;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="flex justify-center">
          <Link to="/" aria-label="go home">
            <Avatar className="size-8 rounded-md">
              <AvatarImage src={siteConfig.icon} alt="app logo" />
              <AvatarFallback>{siteConfig.name.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <CardTitle className="mt-4">Sign up for inklate</CardTitle>
          <CardDescription>Welcome! Create an account to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <SocialProviders signupMutation={typedMutation} />
              <hr className="my-4 border-dashed" />
              <EmailProvider form={form} signupMutation={typedMutation} />
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

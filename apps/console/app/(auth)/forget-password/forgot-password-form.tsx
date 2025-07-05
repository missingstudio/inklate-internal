"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { type ForgotPasswordType, forgotPasswordSchema } from "../types";
import { unwrapSafePromise } from "@inklate/common/promise";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { siteConfig } from "~/utils/site-config";
import { authClient } from "~/lib/auth-client";
import { Button } from "@inklate/ui/button";
import { cn } from "@inklate/ui/lib/utils";
import { useNavigate } from "react-router";
import { Input } from "@inklate/ui/input";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const forgotPasswordMutation = useMutation({
    mutationFn: async (values: ForgotPasswordType) => {
      console.log(values);
      await unwrapSafePromise(
        authClient.forgetPassword({
          email: values.email,
          redirectTo: `${import.meta.env.VITE_PUBLIC_APP_URL}/reset-password`
        })
      );

      return navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    },
    onError: (error) => toast.error(error.message)
  });

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = (values: ForgotPasswordType) => forgotPasswordMutation.mutate(values);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center">
            <Avatar className="size-12 rounded-md">
              <AvatarImage src={siteConfig.icon} alt="app logo" />
              <AvatarFallback>{siteConfig.name.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-center">Forgot password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="text"
                          disabled={forgotPasswordMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signin" className="underline underline-offset-4">
                  Back to sign in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

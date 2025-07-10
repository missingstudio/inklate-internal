"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { type ResetPasswordType, resetPasswordSchema } from "../types";
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
import { toast } from "sonner";

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const resetPasswordMutation = useMutation({
    mutationFn: async (values: ResetPasswordType) => {
      const token = new URLSearchParams(window.location.search).get("token");
      return unwrapSafePromise(
        authClient.resetPassword({
          newPassword: values.password,
          token: token as string
        })
      );
    },
    onSuccess: () => navigate("/login"),
    onError: (error) => toast.error(error.message)
  });

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: ""
    }
  });

  const onSubmit = (values: ResetPasswordType) => resetPasswordMutation.mutate(values);
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
          <CardTitle className="text-center">Reset password</CardTitle>
          <CardDescription className="text-center">
            Enter your password to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="****"
                          type="password"
                          disabled={resetPasswordMutation.isPending}
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
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

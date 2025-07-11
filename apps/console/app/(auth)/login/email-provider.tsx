import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@inklate/ui/button";
import { Input } from "@inklate/ui/input";
import type { LoginType } from "../types";
import { Link } from "react-router";

export function EmailProvider({
  form,
  loginMutation
}: {
  form: UseFormReturn<LoginType>;
  loginMutation: UseMutationResult<void, Error, LoginType>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <FormLabel className="text-muted-foreground font-normal">Email</FormLabel>
            <FormControl>
              <Input
                placeholder="m@example.com"
                type="text"
                disabled={loginMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-center">
              <FormLabel className="text-muted-foreground font-normal">Password</FormLabel>
              <Link className="ml-auto inline-block text-sm underline" to="/forget-password">
                Forgot your password?
              </Link>
            </div>
            <FormControl>
              <Input
                placeholder="****"
                type="password"
                disabled={loginMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Log in"}
      </Button>
    </div>
  );
}

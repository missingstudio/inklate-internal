import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import { Button } from "@inklate/ui/button";
import { Input } from "@inklate/ui/input";

import type { UseMutationResult } from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import type { SignupType } from "../types";

export function EmailProvider({
  form,
  signupMutation
}: {
  form: UseFormReturn<SignupType>;
  signupMutation: UseMutationResult<void, Error, SignupType>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                placeholder="John Doe"
                type="text"
                disabled={signupMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
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
                disabled={signupMutation.isPending}
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
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                placeholder="****"
                type="password"
                disabled={signupMutation.isPending}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
      </Button>
    </div>
  );
}

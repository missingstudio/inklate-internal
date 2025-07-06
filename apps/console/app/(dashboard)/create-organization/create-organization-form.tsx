"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@inklate/ui/form";
import { organizationCreationSchema, SigninType } from "~/app/(auth)/types";
import { useOrganizations } from "~/hooks/use-organizations";
import { unwrapSafePromise } from "@inklate/common/promise";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { DialogFooter } from "@inklate/ui/dialog";
import { authClient } from "~/lib/auth-client";
import { Button } from "@inklate/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@inklate/ui/input";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { toSlug } from "~/utils/slug";
import { toast } from "sonner";
import { z } from "zod";

export function CreateOrganizationForm({
  isDialog,
  onSuccess
}: {
  isDialog?: boolean;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const { setActiveOrganization } = useOrganizations();
  const form = useForm<z.infer<typeof organizationCreationSchema>>({
    resolver: zodResolver(organizationCreationSchema, undefined, { mode: "async" }),
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      slug: ""
    }
  });

  const { mutateAsync: createOrganization, isPending: isCreatingOrganization } = useMutation({
    mutationFn: async ({ name, slug }: z.infer<typeof organizationCreationSchema>) => {
      return unwrapSafePromise(
        authClient.organization.create({
          name,
          slug
        })
      );
    },
    onSuccess: async (data) => {
      navigate("/");
      onSuccess?.();
      form.reset();
    },
    onError: (error) => toast.error(error.message)
  });

  const name = form.watch("name");
  const { formState, setValue } = form;

  useEffect(() => {
    if (!formState.touchedFields.slug) {
      setValue("slug", toSlug(name));
    }
  }, [name, formState, setValue]);

  const onSubmit = async (values: z.infer<typeof organizationCreationSchema>) => {
    await createOrganization(values);
  };

  const SubmitWrapper = isDialog ? DialogFooter : React.Fragment;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Organization" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-organization" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitWrapper>
              <Button type="submit" className="w-full" disabled={isCreatingOrganization}>
                Create
              </Button>
            </SubmitWrapper>
          </div>
        </div>
      </form>
    </Form>
  );
}

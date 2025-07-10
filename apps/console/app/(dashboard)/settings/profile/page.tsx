import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@inklate/ui/avatar";
import { MetaFunction, Form, useActionData } from "react-router";
import { Separator } from "@inklate/ui/separator";
import { siteConfig } from "~/utils/site-config";
import { useSession } from "~/lib/auth-client";
import { Button } from "@inklate/ui/button";
import type { Route } from "./+types/page";
import { Label } from "@inklate/ui/label";
import { Input } from "@inklate/ui/input";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
  return [
    { title: `Profile Settings - ${siteConfig.name}` },
    { name: "description", content: "Manage your profile information and preferences" },
    { property: "og:title", content: `Profile Settings - ${siteConfig.name}` },
    { property: "og:description", content: "Manage your profile information and preferences" },
    { property: "og:type", content: "website" }
  ];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // Basic validation
  if (!name?.trim()) {
    return { success: false, message: "Name is required" };
  }

  if (!email?.trim()) {
    return { success: false, message: "Email is required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address" };
  }

  try {
    // TODO: Implement profile update with better-auth
    // This would typically call a tRPC mutation or API endpoint
    // Example: await trpc.user.updateProfile.mutate({ name, email });
    console.log("Updating profile:", { name, email });
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

export default function ProfileSettingsPage({ loaderData }: Route.ComponentProps) {
  const { data: session } = useSession();
  const actionData = useActionData<typeof action>();

  if (actionData?.success) {
    toast.success(actionData.message);
  } else if (actionData?.message) {
    toast.error(actionData.message);
  }

  return (
    <div className="max-w-2xl space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h1 className="font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile information and preferences.
        </p>
      </div>
      <Separator />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="text-lg">
                  {session?.user?.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-muted-foreground mt-1 text-sm">
                  JPG, PNG or GIF. Max size of 5MB.
                </p>
              </div>
            </div>

            <Form method="post" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    defaultValue={session?.user?.name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue={session?.user?.email || ""}
                  />
                </div>
              </div>

              <Button size="sm" type="submit">
                Update Profile
              </Button>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details and creation date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">User ID</Label>
                <p className="text-muted-foreground font-mono text-sm">
                  {session?.user?.id || "Not available"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Account Created</Label>
                <p className="text-muted-foreground text-sm">
                  {session?.user?.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Verified</Label>
                <p className="text-muted-foreground text-sm">
                  {session?.user?.emailVerified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

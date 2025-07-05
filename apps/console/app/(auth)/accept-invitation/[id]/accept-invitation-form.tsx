"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@inklate/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import { InvitationError } from "./invitation-error";
import { siteConfig } from "~/utils/site-config";
import { Skeleton } from "@inklate/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { Button } from "@inklate/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@inklate/ui/lib/utils";

export function AcceptInvitationForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [invitationStatus, setInvitationStatus] = useState<"pending" | "accepted" | "rejected">(
    "pending"
  );

  const [invitation, setInvitation] = useState<{
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
    id: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await authClient.organization.getInvitation({
        query: { id: params.id! }
      });

      if (error) {
        setInvitationStatus("rejected");
        return setError(error.message || "An error occurred");
      }

      setInvitationStatus("accepted");
      setInvitation(data);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = async () => {
    const { error } = await authClient.organization.acceptInvitation({
      invitationId: params.id!
    });

    if (error) {
      setInvitationStatus("rejected");
      return setError(error.message || "An error occurred");
    }
    setInvitationStatus("accepted");
    navigate("/");
  };

  const handleReject = async () => {
    const { error } = await authClient.organization.rejectInvitation({
      invitationId: params.id!
    });

    if (error) {
      setInvitationStatus("rejected");
      return setError(error.message || "An error occurred");
    }
    setInvitationStatus("rejected");
  };

  const InvitationForm = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-center">
            <Avatar className="size-12 rounded-md">
              <AvatarImage src={siteConfig.icon} alt="app logo" />
              <AvatarFallback>{siteConfig.name.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-center">Organization Invitation</CardTitle>
          <CardDescription className="text-center">
            You&apos;ve been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationStatus === "pending" && (
            <div className="space-y-4 text-center">
              <p className="text-sm">
                <strong>{invitation?.inviterEmail}</strong> has invited you to join{" "}
                <strong>{invitation?.organizationName}</strong>.
              </p>
              <p className="text-sm">
                This invitation was sent to <strong>{invitation?.email}</strong>.
              </p>
            </div>
          )}
          {invitationStatus === "accepted" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <IconCheck className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-center font-bold">Welcome to {invitation?.organizationName}!</h2>
              <p className="text-center text-sm">
                You&apos;ve successfully joined the organization. We&apos;re excited to have you on
                board!
              </p>
            </div>
          )}
          {invitationStatus === "rejected" && (
            <div className="space-y-4">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <IconX className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-center font-bold">Invitation Declined</h2>
              <p className="text-center text-sm">
                You&lsquo;ve declined the invitation to join {invitation?.organizationName}.
              </p>
            </div>
          )}
        </CardContent>
        {invitationStatus === "pending" && (
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept Invitation
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {invitation && !error && <InvitationForm />}
      {error && <InvitationError />}
      {invitationStatus === "pending" && <InvitationSkeleton />}
    </div>
  );
}

function InvitationSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@inklate/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@inklate/ui/avatar";
import { IconAlertCircle } from "@tabler/icons-react";
import { siteConfig } from "~/utils/site-config";
import { Button } from "@inklate/ui/button";
import { Link } from "react-router";

export function InvitationError() {
  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <div className="flex justify-center">
          <Avatar className="size-12 rounded-md">
            <AvatarImage src={siteConfig.icon} alt="app logo" />
            <AvatarFallback>{siteConfig.name.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-center">Invitation Error</CardTitle>
        <CardDescription className="text-center">
          There was an issue with your invitation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <IconAlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <p className="text-muted-foreground mb-4 text-center text-sm">
          The invitation you&apos;re trying to access is either invalid or you don&apos;t have the
          correct permissions. Please check your email for a valid invitation or contact the person
          who sent it.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/login" className="w-full max-w-xs">
          <Button size="sm" className="w-full">
            Back to Log in
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

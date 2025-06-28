"use client";
import { Card, CardDescription, CardHeader, CardTitle } from "@inklate/ui/card";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { unwrapSafePromise } from "@inklate/common/promise";
import { AnimatedMailIcon } from "~/components/icons";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

type VerificationTitleProps = {
  token: string | null;
  verified: boolean;
  verifying: boolean;
};
const VerificationTitle = ({ token, verified, verifying }: VerificationTitleProps) => {
  const getTitle = () => {
    if (!token) return "Check your email";
    if (verified) return "Email Verified!";
    if (verifying) return "Verifying Email...";
    return "Verify Your Email";
  };

  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center text-2xl font-bold"
    >
      {getTitle()}
    </motion.h1>
  );
};

type VerificationMessageProps = {
  token: string | null;
  verified: boolean;
  email: string;
};
const VerificationMessage = ({ token, verified, email }: VerificationMessageProps) => {
  const getMessage = () => {
    if (!token)
      return `We've sent a verification link to ${email}. Please check your inbox and click the link to verify your account.`;

    if (verified)
      return "Your email has been verified. You'll be redirected to continue setting up your account.";

    return "We're verifying your email address. Please wait a moment...";
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-muted-foreground text-center"
    >
      {getMessage()}
    </motion.p>
  );
};

const EmailNotificationAlert = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-muted flex items-start gap-3 rounded-lg p-4"
    >
      <AlertCircle className="mt-0.5 shrink-0 text-amber-500" />
      <p className="text-muted-foreground text-xs">
        Don&apos;t see the email? Check your spam folder, just in case it ended up there.
      </p>
    </motion.div>
  );
};

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const [email] = useState(emailParam || "");

  const verifyEmailMutation = useMutation({
    mutationFn: async (tokenValue: string) => {
      return unwrapSafePromise(
        authClient.verifyEmail({
          query: {
            token: tokenValue
          }
        })
      );
    },
    onSuccess: () => setTimeout(() => navigate("/"), 3000),
    onError: (error) => toast.error(error.message)
  });

  // Run the mutation if a token is present
  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Determine verification state based on mutation state
  const verifying = verifyEmailMutation.isPending;
  const verified = verifyEmailMutation.isSuccess;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-8 p-8">
        <CardHeader>
          <CardTitle>
            <AnimatedMailIcon verified={verified} />
            <VerificationTitle token={token} verified={verified} verifying={verifying} />
          </CardTitle>
          <CardDescription className="space-y-4">
            <VerificationMessage token={token} verified={verified} email={email} />
            {!token && <EmailNotificationAlert />}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

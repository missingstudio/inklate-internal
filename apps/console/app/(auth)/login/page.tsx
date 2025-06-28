import { authClient } from "~/lib/auth-client";

export default function LoginPage() {
  return (
    <button
      className="cursor-pointer underline"
      onClick={async () =>
        await authClient.signIn.social({
          provider: "google",
          callbackURL: `${import.meta.env.VITE_PUBLIC_APP_URL}`,
          errorCallbackURL: `${import.meta.env.VITE_PUBLIC_APP_URL}/sign-in`
        })
      }
    >
      Login page
    </button>
  );
}

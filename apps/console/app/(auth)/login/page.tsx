import { Route } from "../../(auth)/login/+types/page";
import { authProxy } from "~/lib/auth-client";
import { LoginForm } from "./login-form";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const session = await authProxy.api.getSession({ headers: request.headers });
  if (session) {
    return Response.redirect(`${import.meta.env.VITE_PUBLIC_APP_URL}`);
  }

  return null;
}

export default function SignInPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

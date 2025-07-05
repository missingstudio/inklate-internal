import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
  credentials: "include",
  plugins: [organizationClient()]
});

export const { signIn, signUp, signOut, useSession, getSession, $fetch } = authClient;
export type Session = Awaited<ReturnType<typeof getSession>>;
export const authProxy = {
  api: {
    getSession: async ({ headers }: { headers: Headers }) => {
      const session = await authClient.getSession({
        fetchOptions: { headers, credentials: "include" }
      });

      if (session.error) {
        console.error(`Failed to get session: ${session.error}`, session);
        return null;
      }

      return session.data;
    }
  }
};

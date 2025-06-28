import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { getDb } from "~/db";

export const authConfig = {
  basePath: "/api/auth",
  appName: "Inklate",
  trustedOrigins: [env.VITE_PUBLIC_APP_URL],

  advanced: {
    cookiePrefix: "inklate",
    cookieSecure: env.NODE_ENV === "production",
    sameSite: "lax"
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (session expiration is updated every day)
    cookieCache: {
      enabled: true, // Enable cookie caching to reduce database calls
      maxAge: 5 * 60 // Cache for 5 minutes
    }
  },

  emailAndPassword: {
    enabled: false
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
};

export function getAuth(databaseUrl: string) {
  const db = getDb(databaseUrl);
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true
    }),
    ...authConfig
  });
}

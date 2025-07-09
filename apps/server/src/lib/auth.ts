import ResetPasswordEmail from "@inklate/email/reset-password-email";
import InvitationEmail from "@inklate/email/invitation-email";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth, Session, User } from "better-auth";
import VerifyEmail from "@inklate/email/verify-email";
import { organization } from "better-auth/plugins";
import { env } from "cloudflare:workers";
import * as schema from "~/db/schema";
import { sendEmail } from "./email";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
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
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: User; url: string }) => {
      if (env.NODE_ENV === "development") {
        console.log("Reset Password Link:", url);
        return;
      }

      await sendEmail({
        to: user.email,
        subject: "[Inklate] Reset your password",
        react: ResetPasswordEmail({ url: url, name: user.name })
      });
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ token, user }: { token: string; user: User }) => {
      const url = new URL(`${env.VITE_PUBLIC_APP_URL}/verify-email`);
      url.searchParams.set("token", token);

      if (env.NODE_ENV === "development") {
        console.log("Verification Link:", url.href);
        return;
      }

      await sendEmail({
        to: user.email,
        subject: "[Inklate] Please verify your email address",
        react: VerifyEmail({ url: url.href, name: user.name })
      });
    }
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  },

  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const url = new URL(`${env.VITE_PUBLIC_APP_URL}/accept-invitation/${data.id}`);

        if (env.NODE_ENV === "development") {
          console.log("Invitation Link:", url);
          return;
        }

        await sendEmail({
          to: data.email,
          subject: "[Inklate] You've been invited to join a organization",
          react: InvitationEmail({
            inviteLink: url.href,
            username: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name
          })
        });
      }
    })
  ],

  databaseHooks: {
    user: {
      create: {
        after: async (user: User) => {
          const db = getDb(env.DATABASE_URL);
          const [organization] = await db
            .insert(schema.organizations)
            .values({
              id: user.id,
              name: "Personal",
              slug: user.id,
              logo: null,
              createdAt: new Date()
            })
            .returning();

          await db.insert(schema.members).values({
            id: nanoid(),
            userId: user.id,
            organizationId: organization?.id!,
            role: "owner",
            createdAt: new Date()
          });
        }
      }
    },
    session: {
      create: {
        before: async (session: Session) => {
          const organizationId = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organizationId
            }
          };
        }
      }
    }
  }
};

const getActiveOrganization = async (userId: string) => {
  const db = getDb(env.DATABASE_URL);
  const [organization] = await db
    .select({ organizationId: schema.members.organizationId })
    .from(schema.members)
    .where(eq(schema.members.userId, userId))
    .limit(1);
  return organization?.organizationId;
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

export type Auth = ReturnType<typeof getAuth>;

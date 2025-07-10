import { publicProcedure, createTRPCRouter } from "../trpc";
import { sendEmail } from "~/lib/email";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

export const waitlistRouter = createTRPCRouter({
  getWaitlistCount: publicProcedure.query(async () => {
    return { count: 10 };
  }),

  joinWaitlist: publicProcedure.input(waitlistSchema).mutation(async ({ input }) => {
    const { email } = input;

    // For now, just log the email. Later you can save to database
    console.log(`New waitlist signup: ${email}`);

    // Optional: Send a confirmation email
    // You can uncomment this if you want to send confirmation emails
    /*
      try {
        await sendEmail({
          to: email,
          subject: "[Inklate] Welcome to our waitlist!",
          react: <div>
            <h1>Thank you for joining our waitlist!</h1>
            <p>We'll keep you updated on our progress and let you know when Inklate is ready for you.</p>
          </div>
        });
      } catch (error) {
        console.error("Failed to send confirmation email:", error);
      }
      */

    return {
      success: true,
      message: "Thank you for joining our waitlist!"
    };
  })
});

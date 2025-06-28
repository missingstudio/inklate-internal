import { render } from "@react-email/render";
import { env } from "cloudflare:workers";
import nodemailer from "nodemailer";
import type { JSX } from "react";

export async function sendEmail({
  to,
  subject,
  react
}: {
  from?: string;
  to: string;
  subject: string;
  react: JSX.Element;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
      user: "resend",
      pass: env.RESEND_API_KEY
    }
  });
  const html = await render(react);
  const info = await transporter.sendMail({
    from: "Praveen from Inklate <onboarding@resend.dev>",
    to,
    subject,
    html
  });
  console.log("Message sent: %s", info.messageId);
}

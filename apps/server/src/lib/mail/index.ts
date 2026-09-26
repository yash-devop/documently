import { serverEnv } from "@repo/env/serverEnv";
import nodemailer from "nodemailer";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

class MailDeliveryError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "MailDeliveryError";
  }
}

const GMAIL_SMTP = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
} as const;

/**
 * Sends an email over Gmail's SMTP server, authenticating with the same
 * Google account credentials. The From address is that account, because Gmail
 * rejects any sender that does not belong to the authenticated user.
 *
 * With no credentials the message is logged instead of sent, so local
 * development works without a mail account. In production missing credentials
 * are fatal: silently logging verification links would leave real users unable
 * to verify their email with no obvious cause.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailInput): Promise<void> => {
  const user = serverEnv.SMTP_USER;
  const pass = serverEnv.SMTP_PASS;

  if (!user || !pass) {
    if (serverEnv.NODE_ENV === "production") {
      throw new MailDeliveryError(
        "SMTP_USER/SMTP_PASS are not set, so the verification email cannot be sent.",
      );
    }

    console.info(
      [
        "",
        "──────────── email (not sent) ────────────",
        `to:      ${to}`,
        `subject: ${subject}`,
        "",
        text,
        "──────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  const transport = nodemailer.createTransport({
    ...GMAIL_SMTP,
    auth: { user, pass },
  });

  try {
    await transport.sendMail({
      from: user,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new MailDeliveryError(
      `Gmail SMTP delivery to ${to} failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error,
    );
  }
};

export { MailDeliveryError };

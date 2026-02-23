type ResendEmailPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64
    type?: string;
  }>;
};

const RESEND_API_URL = "https://api.resend.com/emails";

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    process.env.NOTIFY_EMAIL_FROM ||
    "Prime Elec <notifications@prime-elec.com>";
  return { apiKey, from };
};

export const canSendWithResend = () => Boolean(getResendConfig().apiKey);

export async function sendResendEmail(payload: ResendEmailPayload) {
  const { apiKey, from } = getResendConfig();
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      attachments: payload.attachments,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend request failed (${response.status}): ${errorText}`);
  }

  return response.json().catch(() => null);
}

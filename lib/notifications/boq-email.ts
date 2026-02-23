type BoqEmailPayload = {
  fullName: string;
  phone: string;
  projectName?: string | null;
  notes?: string | null;
  fileName: string;
  fileUrl: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function buildBoqEmailContent(payload: BoqEmailPayload) {
  const subject = `New BOQ Upload - ${payload.fullName}`;

  const text = [
    "New BOQ upload received",
    "",
    `Full name: ${payload.fullName}`,
    `Phone: ${payload.phone}`,
    `Project name: ${payload.projectName || "-"}`,
    "",
    "Notes:",
    payload.notes || "-",
    "",
    `File: ${payload.fileName}`,
    `File URL: ${payload.fileUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.45;">
      <h2 style="margin:0 0 12px;color:#406aac;">New BOQ upload received</h2>
      <table style="border-collapse:collapse;margin:0 0 16px;width:100%;max-width:760px;">
        <tbody>
          <tr><td style="padding:6px 0;"><strong>Full name:</strong> ${escapeHtml(payload.fullName)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone:</strong> ${escapeHtml(payload.phone)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Project name:</strong> ${escapeHtml(payload.projectName || "-")}</td></tr>
        </tbody>
      </table>
      <div style="margin:0 0 16px;">
        <p style="margin:0 0 6px;"><strong>Notes</strong></p>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;white-space:pre-wrap;">${escapeHtml(payload.notes || "-")}</div>
      </div>
      <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;">
        <p style="margin:0 0 6px;"><strong>Uploaded file:</strong> ${escapeHtml(payload.fileName)}</p>
        <p style="margin:0;">
          <a href="${escapeHtml(payload.fileUrl)}" target="_blank" rel="noopener noreferrer" style="color:#406aac;text-decoration:underline;">
            Open BOQ file
          </a>
        </p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

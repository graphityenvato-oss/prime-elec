type QuoteEmailItem = {
  name: string;
  partNumber: string;
  codeNo?: string;
  quantity: number;
  source: "stock" | "external";
  brand?: string;
  category?: string;
};

type QuoteEmailPayload = {
  fullName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  projectNotes?: string | null;
  needsConsultation?: boolean;
  cartItems: QuoteEmailItem[];
  totalItems: number;
  totalQuantity: number;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function buildQuotationEmailContent(payload: QuoteEmailPayload) {
  const subject = `New Quotation Request - ${payload.fullName}`;

  const itemsText = payload.cartItems
    .map((item, index) => {
      const meta = [
        item.source === "stock" ? "Stock" : "External",
        item.brand ? `Brand: ${item.brand}` : null,
        item.category ? `Category: ${item.category}` : null,
        item.codeNo ? `Code: ${item.codeNo}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      return [
        `${index + 1}. ${item.name}`,
        `   Order#: ${item.partNumber}`,
        `   Qty: ${item.quantity}`,
        meta ? `   ${meta}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const text = [
    "New quotation request received",
    "",
    `Full name: ${payload.fullName}`,
    `Company: ${payload.company || "-"}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "-"}`,
    `Consultation requested: ${payload.needsConsultation ? "Yes" : "No"}`,
    `Total distinct items: ${payload.totalItems}`,
    `Total quantity: ${payload.totalQuantity}`,
    "",
    "Project notes:",
    payload.projectNotes || "-",
    "",
    "Items:",
    itemsText || "-",
  ].join("\n");

  const rowsHtml = payload.cartItems
    .map((item, index) => {
      const meta = [
        item.source === "stock" ? "Stock" : "External",
        item.brand ? `Brand: ${item.brand}` : null,
        item.category ? `Category: ${item.category}` : null,
      ]
        .filter(Boolean)
        .join(" • ");
      return `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(item.partNumber)}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(item.codeNo || "-")}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${escapeHtml(meta || "-")}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.45;">
      <h2 style="margin:0 0 12px;color:#406aac;">New quotation request received</h2>
      <table style="border-collapse:collapse;margin:0 0 16px;width:100%;max-width:760px;">
        <tbody>
          <tr><td style="padding:6px 0;"><strong>Full name:</strong> ${escapeHtml(payload.fullName)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Company:</strong> ${escapeHtml(payload.company || "-")}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Email:</strong> ${escapeHtml(payload.email)}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Phone:</strong> ${escapeHtml(payload.phone || "-")}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Consultation requested:</strong> ${payload.needsConsultation ? "Yes" : "No"}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Total distinct items:</strong> ${payload.totalItems}</td></tr>
          <tr><td style="padding:6px 0;"><strong>Total quantity:</strong> ${payload.totalQuantity}</td></tr>
        </tbody>
      </table>
      <div style="margin:0 0 16px;">
        <p style="margin:0 0 6px;"><strong>Project notes</strong></p>
        <div style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;white-space:pre-wrap;">${escapeHtml(payload.projectNotes || "-")}</div>
      </div>
      <p style="margin:0 0 8px;"><strong>Requested items</strong></p>
      <table style="border-collapse:collapse;width:100%;max-width:980px;font-size:13px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">#</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Order#</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Code</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Source / Meta</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || `<tr><td colspan="6" style="padding:8px;border:1px solid #e5e7eb;">No items</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  return { subject, text, html };
}

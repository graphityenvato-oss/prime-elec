type QuotePdfItem = {
  name: string;
  partNumber: string;
  codeNo?: string;
  quantity: number;
  source: "stock" | "external";
  brand?: string;
  category?: string;
};

type QuotePdfPayload = {
  fullName: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  projectNotes?: string | null;
  needsConsultation?: boolean;
  cartItems: QuotePdfItem[];
  totalItems: number;
  totalQuantity: number;
};

const wrapLine = (text: string, maxChars = 90) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
};

export async function buildQuotationPdfAttachment(
  payload: QuotePdfPayload,
): Promise<{
  filename: string;
  content: string;
  type: string;
}> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

  const pdf = await PDFDocument.create();
  let page = pdf.addPage([595.28, 841.89]); // A4 portrait
  const { height } = page.getSize();
  const margin = 40;
  let y = height - margin;

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const lineHeight = 14;
  const smallLineHeight = 12;

  const ensureSpace = (needed = 20) => {
    if (y - needed > margin) return;
    page = pdf.addPage([595.28, 841.89]);
    y = height - margin;
  };

  const drawText = (
    text: string,
    opts?: { size?: number; bold?: boolean; color?: [number, number, number] },
  ) => {
    const size = opts?.size ?? 10;
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: opts?.bold ? bold : font,
      color: opts?.color
        ? rgb(opts.color[0], opts.color[1], opts.color[2])
        : rgb(0, 0, 0),
    });
    y -= size >= 14 ? lineHeight + 2 : smallLineHeight;
  };

  const drawParagraph = (text: string, maxChars = 92, size = 10) => {
    const lines = wrapLine(text, maxChars);
    for (const line of lines) {
      ensureSpace(18);
      drawText(line, { size });
    }
  };

  drawText("Prime Elec - Quotation Request", {
    size: 16,
    bold: true,
    color: [0.25, 0.42, 0.67],
  });
  y -= 4;

  drawText(`Date: ${new Date().toLocaleString()}`, { size: 9 });
  y -= 6;

  drawText("Customer Information", { size: 12, bold: true });
  drawText(`Full name: ${payload.fullName}`, { size: 10 });
  drawText(`Company: ${payload.company || "-"}`, { size: 10 });
  drawText(`Email: ${payload.email}`, { size: 10 });
  drawText(`Phone: ${payload.phone || "-"}`, { size: 10 });
  drawText(
    `Consultation requested: ${payload.needsConsultation ? "Yes" : "No"}`,
    { size: 10 },
  );
  drawText(`Total distinct items: ${payload.totalItems}`, { size: 10 });
  drawText(`Total quantity: ${payload.totalQuantity}`, { size: 10 });
  y -= 6;

  drawText("Project Notes", { size: 12, bold: true });
  drawParagraph(payload.projectNotes || "-", 88, 10);
  y -= 6;

  drawText("Requested Items", { size: 12, bold: true });

  payload.cartItems.forEach((item, index) => {
    ensureSpace(80);
    drawText(`${index + 1}. ${item.name}`, { size: 10, bold: true });
    drawText(`Order#: ${item.partNumber}`, { size: 10 });
    drawText(`Code: ${item.codeNo || "-"}`, { size: 10 });
    drawText(`Quantity: ${item.quantity}`, { size: 10 });
    drawText(
      `Source: ${item.source === "stock" ? "Stock" : "External"} | Brand: ${item.brand || "-"} | Category: ${item.category || "-"}`,
      { size: 9 },
    );
    y -= 4;
  });

  const pdfBytes = await pdf.save();
  const filename = `quotation-${
    payload.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "request"
  }.pdf`;

  return {
    filename,
    content: Buffer.from(pdfBytes).toString("base64"),
    type: "application/pdf",
  };
}

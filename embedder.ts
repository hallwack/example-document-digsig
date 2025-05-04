import { PDFDocument } from "pdf-lib";
import fs from "fs";
import { DocumentMetadata } from "./types";

export async function embedMetadataToPDF(
  metadata: DocumentMetadata,
  outputPath: string,
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(metadata.document);

  const metaBuffer = Buffer.from(JSON.stringify(metadata, null, 2), "utf-8");
  pdfDoc.attach(metaBuffer, "metadata.json", {
    mimeType: "application/json",
    description: "Metadata tanda tangan",
    creationDate: new Date(),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

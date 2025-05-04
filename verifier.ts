import { PDFDocument } from "pdf-lib";
import fs from "fs";
import forge from "node-forge";
import nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";
import { DocumentMetadata } from "./types";

export async function verifyPDF(pdfPath: string): Promise<boolean> {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const attachments = pdfDoc.getAttachments();
  const meta = attachments["metadata.json"];

  if (!meta) throw new Error("❌ Metadata tidak ditemukan");

  const metaStr = new TextDecoder().decode(meta.content);
  const data: DocumentMetadata = JSON.parse(metaStr);

  // Verifikasi RSA
  const rsaPub = forge.pki.publicKeyFromPem(data.rsaPublicKeyPem);
  const md = forge.md.sha256.create();
  md.update(data.document, "utf8");
  const validRSA = rsaPub.verify(
    md.digest().bytes(),
    forge.util.decode64(data.rsaSignatureBase64),
  );

  // Verifikasi Ed25519
  const validEd = nacl.sign.detached.verify(
    naclUtil.decodeUTF8(data.document),
    naclUtil.decodeBase64(data.edSignatureBase64),
    naclUtil.decodeBase64(data.edPublicKeyBase64),
  );

  console.log(`🔒 RSA Valid: ${validRSA}, 🔐 EdDSA Valid: ${validEd}`);
  return validRSA && validEd;
}

import { signDocument } from "./signer";
import { embedMetadataToPDF } from "./embedder";
import { verifyPDF } from "./verifier";
import fs from "fs";

const [, , command, input, outputOrName] = process.argv;

async function main() {
  if (command === "sign") {
    const text = fs.readFileSync(input, "utf8");
    const metadata = signDocument(text, outputOrName || "User A");
    await embedMetadataToPDF(metadata, "./signed-output.pdf");
    console.log("✅ Dokumen ditandatangani dan disimpan ke signed-output.pdf");
  } else if (command === "verify") {
    const result = await verifyPDF(input);
    console.log(result ? "✅ Verifikasi berhasil" : "❌ Verifikasi gagal");
  } else {
    console.log(`Usage:
  node cli.js sign input.txt "User A"     → Tanda tangan & export ke PDF
  node cli.js verify signed-output.pdf    → Verifikasi PDF`);
  }
}

main();

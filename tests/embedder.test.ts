import { embedMetadataToPDF } from "../src/embedder";
import { signDocument } from "../src/signer";
import fs from "fs";

test("should embed metadata to PDF file", async () => {
  const metadata = signDocument("Isi dokumen", "User A");
  await embedMetadataToPDF(metadata, "test-output.pdf");

  expect(fs.existsSync("test-output.pdf")).toBe(true);
});

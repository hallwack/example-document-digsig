import { signDocument } from "../src/signer";
import { embedMetadataToPDF } from "../src/embedder";
import { verifyPDF } from "../src/verifier";

test("should verify signed PDF correctly", async () => {
  const metadata = signDocument("Test Dokumen", "User A");
  await embedMetadataToPDF(metadata, "verify-test.pdf");
  const result = await verifyPDF("verify-test.pdf");

  expect(result).toBe(true);
});

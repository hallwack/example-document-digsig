import { signDocument } from "../src/signer";

test("should sign document with RSA and EdDSA", () => {
  const doc = "Dokumen tes";
  const metadata = signDocument(doc, "User A");

  expect(metadata.document).toBe(doc);
  expect(metadata.rsaPublicKeyPem).toMatch(/BEGIN PUBLIC KEY/);
  expect(metadata.edPublicKeyBase64.length).toBeGreaterThan(0);
  expect(metadata.rsaSignatureBase64.length).toBeGreaterThan(0);
  expect(metadata.edSignatureBase64.length).toBeGreaterThan(0);
});

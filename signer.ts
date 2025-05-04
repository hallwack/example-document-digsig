import forge from "node-forge";
import nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";
import { DocumentMetadata } from "./types";

export function signDocument(
  content: string,
  commonName: string,
): DocumentMetadata {
  // 1. RSA
  const rsa = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const rsaPrivPem = forge.pki.privateKeyToPem(rsa.privateKey);
  const rsaPubPem = forge.pki.publicKeyToPem(rsa.publicKey);

  // 2. Ed25519
  const edKey = nacl.sign.keyPair();
  const edPubB64 = naclUtil.encodeBase64(edKey.publicKey);
  const edPriv = edKey.secretKey;

  // 3. Hash + Signature
  const md = forge.md.sha256.create();
  md.update(content, "utf8");
  const hash = md.digest().bytes();
  const rsaSig = rsa.privateKey.sign(md);
  const rsaSigB64 = forge.util.encode64(rsaSig);
  const edSig = nacl.sign.detached(naclUtil.decodeUTF8(content), edPriv);
  const edSigB64 = naclUtil.encodeBase64(edSig);

  // 4. Sertifikat self-signed
  const cert = forge.pki.createCertificate();
  cert.publicKey = rsa.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  const attrs = [{ name: "commonName", value: commonName }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(rsa.privateKey, forge.md.sha256.create());
  const certPem = forge.pki.certificateToPem(cert);

  return {
    document: content,
    rsaPublicKeyPem: rsaPubPem,
    edPublicKeyBase64: edPubB64,
    rsaSignatureBase64: rsaSigB64,
    edSignatureBase64: edSigB64,
    rsaCertificatePem: certPem,
    signedAt: new Date().toISOString(),
  };
}

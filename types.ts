export interface DocumentMetadata {
  document: string;
  rsaPublicKeyPem: string;
  edPublicKeyBase64: string;
  rsaSignatureBase64: string;
  edSignatureBase64: string;
  rsaCertificatePem: string;
  signedAt: string;
}

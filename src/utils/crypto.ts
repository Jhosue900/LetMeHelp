// Utilidades criptográficas usadas para el "enlace privado" de administración.
// Todo corre en el navegador con Web Crypto API — no depende de ningún backend.

const TOKEN_BYTES = 32; // 256 bits de entropía

/**
 * Genera un token de administración criptográficamente seguro.
 * Se entrega una única vez al usuario como parte de /administrar/:token.
 * Nunca se guarda en texto plano en Supabase — solo su SHA-256 (ver hashToken).
 */
export function generateManagementToken(): string {
  const bytes = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

/**
 * Calcula SHA-256(token) en hex, usando el mismo algoritmo que
 * `encode(digest(p_token, 'sha256'), 'hex')` del lado de PostgreSQL,
 * para que ambos lados siempre coincidan.
 */
export async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
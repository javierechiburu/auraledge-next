/**
 * Determina si un correo es administrador, según la variable de entorno
 * ADMIN_EMAILS (lista separada por comas). Solo se evalúa en el servidor.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

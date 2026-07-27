import { z } from "zod";

/**
 * Esquemas de validación (zod) para los payloads de las rutas API. Reemplazan la
 * validación manual y garantizan tipos/forma antes de tocar la lógica de negocio.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const email = z
  .string()
  .trim()
  .regex(EMAIL_RE, "Correo inválido.")
  .transform((s) => s.toLowerCase());

export const registerSchema = z.object({
  email,
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre."),
  email,
  phone: z.string().trim().optional(),
});

export const checkoutSchema = z.object({
  // Solo importa el slug: el servidor reconstruye precio/nombre desde Strapi.
  items: z
    .array(z.object({ slug: z.string().min(1) }))
    .min(1, "El carrito está vacío."),
  customer: customerSchema,
});

/** Parsea con un esquema; devuelve el dato tipado o el primer mensaje de error.
 *  (Uso en rutas API — respuesta 400 con `error`.) */
export function parsePayload<T>(
  schema: z.ZodType<T>,
  data: unknown
): { ok: true; data: T } | { ok: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message ?? "Datos inválidos." };
}

/** Devuelve el primer mensaje de error, o null si es válido. (Uso en formularios.) */
export function firstError(schema: z.ZodType, data: unknown): string | null {
  const result = schema.safeParse(data);
  return result.success ? null : result.error.issues[0]?.message ?? "Datos inválidos.";
}

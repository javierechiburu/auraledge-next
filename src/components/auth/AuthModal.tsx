"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/auth/GoogleButton";

export default function AuthModal() {
  const { authOpen, authMode, openAuth, closeAuth, login, register } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const isLogin = authMode === "login";

  // Limpia el formulario al abrir/cerrar o cambiar de modo.
  useEffect(() => {
    setError(null);
    setPassword("");
    setSentTo(null);
  }, [authOpen, authMode]);

  // Cierra con Escape y bloquea el scroll del fondo mientras está abierto.
  useEffect(() => {
    if (!authOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAuth();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [authOpen, closeAuth]);

  if (!authOpen) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isLogin && password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        closeAuth();
      } else {
        const { needsConfirmation } = await register(email, password);
        if (needsConfirmation) {
          setSentTo(email); // muestra pantalla "revisa tu correo"
        } else {
          closeAuth();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuth();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isLogin ? "Iniciar sesión" : "Crear cuenta"}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-100 rounded-2xl border border-line bg-[#0b0b0b] p-7 shadow-2xl"
      >
        <button
          onClick={closeAuth}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        {sentTo ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber/15 text-2xl">
              ✉️
            </div>
            <h2 className="font-display text-2xl normal-case">
              Revisa tu correo
            </h2>
            <p className="mt-3 text-sm text-muted">
              Te enviamos un enlace de confirmación a{" "}
              <strong className="text-white">{sentTo}</strong>. Ábrelo para
              activar tu cuenta y luego inicia sesión.
            </p>
            <button
              onClick={() => openAuth("login")}
              className="btn btn-primary mt-6 w-full justify-center"
            >
              Ir a iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-orbitron text-2xl font-extrabold tracking-tighter normal-case">
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {isLogin
                ? "Accede para ver tus compras y descargas."
                : "Guarda tus compras y descárgalas cuando quieras."}
            </p>

            <GoogleButton
              className="mt-6"
              label={
                isLogin ? "Continuar con Google" : "Registrarse con Google"
              }
            />

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" /> o con tu correo{" "}
              <span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
              />
              <input
                type="password"
                required
                placeholder={
                  isLogin ? "Contraseña" : "Contraseña (mín. 8 caracteres)"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center disabled:opacity-50"
              >
                {loading
                  ? isLogin
                    ? "Ingresando…"
                    : "Creando cuenta…"
                  : isLogin
                    ? "Iniciar sesión"
                    : "Crear cuenta"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <button
                type="button"
                onClick={() => openAuth(isLogin ? "register" : "login")}
                className="text-amber hover:underline"
              >
                {isLogin ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

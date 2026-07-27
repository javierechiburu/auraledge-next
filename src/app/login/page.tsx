"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * El login vive en un modal global (ver AuthModal). Esta ruta solo existe por
 * compatibilidad con enlaces antiguos: abre el modal y vuelve al inicio.
 */
function LoginRedirect() {
  const { openAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    openAuth("login");
    router.replace("/");
  }, [openAuth, router]);
  return null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}

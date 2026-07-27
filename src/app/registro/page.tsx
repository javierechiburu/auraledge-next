"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * El registro vive en el modal global (ver AuthModal). Esta ruta solo existe por
 * compatibilidad con enlaces antiguos: abre el modal y vuelve al inicio.
 */
function RegisterRedirect() {
  const { openAuth } = useAuth();
  const router = useRouter();
  useEffect(() => {
    openAuth("register");
    router.replace("/");
  }, [openAuth, router]);
  return null;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterRedirect />
    </Suspense>
  );
}

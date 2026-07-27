import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Términos y Condiciones | Genio Music",
  description: "Términos y condiciones de uso de Genio Music.",
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y Condiciones" updated="27 de julio de 2026">
      <section>
        <p>
          Estos Términos y Condiciones regulan el uso del sitio de <strong>Genio Music</strong>
          {" "}y la compra de productos digitales (pistas, beats y plantillas). Al usar el sitio o
          realizar una compra, aceptas estos términos. Si no estás de acuerdo, no utilices el
          servicio.
        </p>
      </section>

      <section>
        <h2>1. El servicio</h2>
        <p>
          Genio Music vende <strong>productos digitales</strong> descargables. Cada producto
          incluye una vista previa de algunos segundos; el archivo completo se entrega tras
          confirmarse el pago. Nos reservamos el derecho de modificar el catálogo, los precios y
          la disponibilidad en cualquier momento.
        </p>
      </section>

      <section>
        <h2>2. Cuenta de usuario</h2>
        <p>
          Puedes comprar con o sin cuenta. Si creas una cuenta, eres responsable de mantener la
          confidencialidad de tus credenciales y de toda actividad realizada en ella. Notifícanos
          ante cualquier uso no autorizado.
        </p>
      </section>

      <section>
        <h2>3. Precios y pagos</h2>
        <p>
          Los precios se muestran en pesos chilenos (CLP) e incluyen los impuestos aplicables. Los
          pagos se procesan a través de <strong>Mercado Pago</strong>; Genio Music no almacena
          datos de tarjetas. La compra se perfecciona cuando Mercado Pago confirma la aprobación
          del pago.
        </p>
      </section>

      <section>
        <h2>4. Entrega digital</h2>
        <p>
          Al aprobarse el pago, enviaremos a tu correo un enlace de descarga personal y temporal
          (expira a los 7 días). El enlace es de uso individual; no lo compartas. Si expira, podemos
          generarte uno nuevo previa verificación de tu compra.
        </p>
      </section>

      <section>
        <h2>5. Reembolsos</h2>
        <p>
          Por tratarse de <strong>bienes digitales de descarga inmediata</strong>, las ventas son
          finales y no se aceptan reembolsos una vez entregado el archivo, salvo que el producto
          presente un defecto comprobable o no corresponda a lo descrito. En esos casos, escríbenos
          y buscaremos una solución (reemplazo o reembolso).
        </p>
      </section>

      <section>
        <h2>6. Propiedad intelectual y licencias</h2>
        <p>
          Todos los productos son propiedad de Genio Music o de sus creadores. La compra te otorga
          una <strong>licencia de uso</strong>, no la propiedad del producto. El alcance de lo que
          puedes y no puedes hacer se detalla en la página de{" "}
          <a href="/licencias">Licencias</a>.
        </p>
      </section>

      <section>
        <h2>7. Uso aceptable</h2>
        <p>
          Te comprometes a no revender, redistribuir ni compartir los archivos completos, ni a
          usar el sitio para fines ilícitos o que vulneren derechos de terceros.
        </p>
      </section>

      <section>
        <h2>8. Limitación de responsabilidad</h2>
        <p>
          El servicio se ofrece &quot;tal cual&quot;. En la medida permitida por la ley, Genio
          Music no será responsable de daños indirectos derivados del uso del sitio o de los
          productos.
        </p>
      </section>

      <section>
        <h2>9. Cambios</h2>
        <p>
          Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con
          su fecha de actualización.
        </p>
      </section>

      <section>
        <h2>10. Ley aplicable y contacto</h2>
        <p>
          Estos términos se rigen por las leyes de Chile. Ante cualquier duda, escríbenos a{" "}
          <a href="mailto:contacto@geniomusic.cl">contacto@geniomusic.cl</a>.
        </p>
      </section>

      <section>
        <p className="text-xs">
          <strong>Aviso:</strong> este documento es una base y debe ser revisado por un
          profesional legal antes de su uso definitivo.
        </p>
      </section>
    </LegalPage>
  );
}

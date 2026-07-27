import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de Privacidad | Genio Music",
  description: "Cómo Genio Music recopila, usa y protege tus datos.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" updated="27 de julio de 2026">
      <section>
        <p>
          En <strong>Genio Music</strong> respetamos tu privacidad. Esta política explica qué datos
          recopilamos, cómo los usamos y qué derechos tienes, conforme a la Ley N° 19.628 sobre
          Protección de la Vida Privada (Chile).
        </p>
      </section>

      <section>
        <h2>1. Datos que recopilamos</h2>
        <ul>
          <li>
            <strong>De contacto y cuenta:</strong> nombre y correo electrónico (y teléfono si lo
            proporcionas al comprar).
          </li>
          <li>
            <strong>De compra:</strong> productos adquiridos, montos y estado del pago.
          </li>
          <li>
            <strong>Técnicos:</strong> datos mínimos de la sesión para autenticarte.
          </li>
        </ul>
        <p>
          <strong>No almacenamos datos de tarjetas.</strong> Los pagos los procesa Mercado Pago en
          su propio entorno seguro.
        </p>
      </section>

      <section>
        <h2>2. Cómo usamos tus datos</h2>
        <ul>
          <li>Procesar tus compras y entregarte los productos digitales.</li>
          <li>Enviarte el correo con tus enlaces de descarga.</li>
          <li>Gestionar tu cuenta y mostrar tu historial de compras.</li>
          <li>Cumplir obligaciones legales y prevenir fraude.</li>
        </ul>
      </section>

      <section>
        <h2>3. Terceros que intervienen</h2>
        <ul>
          <li>
            <strong>Mercado Pago</strong> — procesamiento de pagos.
          </li>
          <li>
            <strong>Resend</strong> — envío de los correos de descarga.
          </li>
          <li>
            <strong>Proveedor de hosting</strong> — infraestructura del sitio.
          </li>
        </ul>
        <p>Estos proveedores solo reciben los datos necesarios para prestar su servicio.</p>
      </section>

      <section>
        <h2>4. Cookies y sesión</h2>
        <p>
          Usamos una cookie de sesión <strong>httpOnly</strong> para mantenerte autenticado. No
          usamos cookies de rastreo publicitario de terceros.
        </p>
      </section>

      <section>
        <h2>5. Tus derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación o eliminación de tus datos personales escribiendo
          a <a href="mailto:contacto@geniomusic.cl">contacto@geniomusic.cl</a>. Atenderemos tu
          solicitud dentro de los plazos que exige la ley.
        </p>
      </section>

      <section>
        <h2>6. Seguridad y retención</h2>
        <p>
          Aplicamos medidas razonables para proteger tu información (cifrado en tránsito, acceso
          restringido). Conservamos tus datos mientras tengas cuenta o mientras sea necesario para
          fines legales y contables.
        </p>
      </section>

      <section>
        <h2>7. Contacto</h2>
        <p>
          Dudas sobre privacidad:{" "}
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

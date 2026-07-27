import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Licencias | Genio Music",
  description: "Qué puedes hacer con las pistas, beats y plantillas de Genio Music.",
};

export default function LicenciasPage() {
  return (
    <LegalPage title="Licencias" updated="27 de julio de 2026">
      <section>
        <p>
          Al comprar en <strong>Genio Music</strong> adquieres una <strong>licencia de uso</strong>
          {" "}del producto digital, no su propiedad. Genio Music (y sus creadores) conservan todos
          los derechos de autor. Cada producto indica el tipo de licencia incluida.
        </p>
      </section>

      <section>
        <h2>Licencia Estándar</h2>
        <ul>
          <li>Uso en proyectos personales y comerciales propios (canciones, videos, redes).</li>
          <li>Distribución en plataformas de streaming a tu nombre.</li>
          <li>Uso no exclusivo: el mismo producto puede licenciarse a otras personas.</li>
        </ul>
      </section>

      <section>
        <h2>Licencia Premium</h2>
        <ul>
          <li>Todo lo de la licencia Estándar.</li>
          <li>Incluye los archivos separados (stems) cuando el producto lo indique.</li>
          <li>Mayores límites de reproducciones/distribución según se especifique.</li>
        </ul>
      </section>

      <section>
        <h2>Uso permitido</h2>
        <ul>
          <li>Incorporar el producto en tus propias creaciones (mezclas, canciones, contenido).</li>
          <li>Publicar y monetizar esas creaciones a tu nombre.</li>
        </ul>
      </section>

      <section>
        <h2>Uso NO permitido</h2>
        <ul>
          <li>Revender, redistribuir o regalar el archivo original tal cual.</li>
          <li>Compartir el enlace de descarga o los archivos con terceros.</li>
          <li>Registrar el producto como propio (Content ID, sello) impidiendo su uso a otros.</li>
          <li>Usarlo en contenido ilegal, difamatorio o que infrinja derechos de terceros.</li>
        </ul>
      </section>

      <section>
        <h2>Créditos</h2>
        <p>
          Los créditos a Genio Music son bienvenidos pero no obligatorios, salvo que el producto
          indique lo contrario.
        </p>
      </section>

      <section>
        <h2>Exclusividad</h2>
        <p>
          Salvo que se ofrezca explícitamente una <strong>licencia exclusiva</strong>, todas las
          licencias son <strong>no exclusivas</strong>: el mismo producto puede venderse a más
          personas.
        </p>
      </section>

      <section>
        <h2>Dudas</h2>
        <p>
          Para licencias especiales o exclusivas, escríbenos a{" "}
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

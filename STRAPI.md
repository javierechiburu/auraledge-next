# Integración con Strapi (backend `../cms`)

El backend vive en `geniomusic/cms` (Strapi 5, TypeScript). Los **content-types
ya están definidos como código** (no hay que crearlos a mano en el admin) y los
permisos públicos de lectura se otorgan solos al arrancar (ver
`cms/src/index.ts`). Mientras Strapi no esté disponible, el frontend usa datos
mock (`src/lib/mock-data.ts`) automáticamente.

## 1. Levantar Strapi en local

```bash
cd ../cms
npm run develop
```

Corre en `http://localhost:1337`. La primera vez, entra a
`http://localhost:1337/admin` y **crea tu usuario administrador**.

> Si ves `SqliteError: unable to open database file`, asegúrate de que en
> `cms/.env` la variable `DATABASE_FILENAME=.tmp/data.db` no esté vacía.

## 2. Content-Types (ya creados en código)

### Product — `cms/src/api/product/content-types/product/schema.json`
Pista musical (producto digital):

| Campo             | Tipo            | Notas                                             |
|-------------------|-----------------|---------------------------------------------------|
| `name`            | string (req)    | Título de la pista                                |
| `slug`            | uid (req)       | Único, deriva de `name`                           |
| `subtitle`        | string          |                                                   |
| `description`     | text            |                                                   |
| `price`           | decimal (req)   | En CLP (entero, p. ej. 12990)                     |
| `compareAtPrice`  | decimal         | Precio tachado (opcional)                         |
| `genre`           | string          | Trap, Reggaetón, Drill…                           |
| `bpm`             | integer         | Tempo                                             |
| `musicalKey`      | string          | Tonalidad (Am, C#m…)                              |
| `durationSeconds` | integer         | Duración total                                    |
| `previewSeconds`  | integer (def 30)| Segundos de preview permitidos                    |
| `tag` / `badge`   | string          | Etiquetas visuales                                |
| `features`        | json            | Array de strings (`["WAV + MP3", "Stems"]`)       |
| `bestValue`       | boolean         |                                                   |
| `highlight`       | boolean         |                                                   |
| `image`           | media (imagen)  | Portada                                           |
| `previewClip`     | media (audio)   | **PÚBLICO**: clip de preview de pocos segundos    |
| `fullTrack`       | media (audio)   | **PRIVADO** (`private: true`): pista completa     |

> **Importante:** subes DOS archivos por pista: el `previewClip` (recortado a
> los segundos que quieras mostrar) y el `fullTrack` (la pista completa que solo
> se entrega tras el pago). El `fullTrack` es un campo privado: no se expone en
> la API pública; solo se lee desde el servidor con el API token.

### Order — `cms/src/api/order/content-types/order/schema.json`

| Campo            | Tipo         | Notas                                          |
|------------------|--------------|------------------------------------------------|
| `items`          | json (req)   | `[{ slug, name, price, qty, image }]`          |
| `customer`       | json (req)   | `{ name, email, phone }`                        |
| `total`          | decimal (req)| Calculado en el servidor                        |
| `status`         | enum (req)   | `pending`/`approved`/`rejected`/`cancelled`     |
| `mpPreferenceId` | string       | Id de preferencia de Mercado Pago               |
| `mpPaymentId`    | string       | Id del pago                                     |
| `fulfilledAt`    | datetime     | Marca de entrega (idempotencia del correo)      |

Las órdenes **no son públicas**: se crean/actualizan solo con el API token del
servidor (nunca desde el navegador).

## 3. Permisos

- **Lectura de pistas (público):** `product.find` y `product.findOne` se
  habilitan automáticamente en el rol *Public* al arrancar (`cms/src/index.ts`).
- **Órdenes y archivo privado:** requieren un **API Token** de tipo *Full
  access*. Créalo en **Settings → API Tokens** y ponlo en el `.env.local` del
  frontend como `STRAPI_API_TOKEN`.

## 4. Variables de entorno del frontend

Copia `.env.example` a `.env.local` y completa (ver ese archivo para la lista
completa y comentada): `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_API_TOKEN`,
`NEXT_PUBLIC_SITE_URL`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`,
`DOWNLOAD_TOKEN_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

## 5. Flujo de compra y entrega digital

1. `/checkout` → `POST /api/checkout`. **El servidor ignora los precios del
   cliente** y los reconstruye desde Strapi por `slug` (`buildVerifiedCart`).
2. Crea la orden (`createOrder`) y una **preferencia** de Mercado Pago
   (`external_reference = order.id`). Redirige a Checkout Pro.
3. Mercado Pago notifica a `/api/webhooks/mercadopago`. El handler **valida la
   firma HMAC** (`MP_WEBHOOK_SECRET`), consulta el pago real y actualiza la orden.
4. Si el pago está **aprobado** y la orden no se había entregado, se generan
   **links de descarga firmados** (`DOWNLOAD_TOKEN_SECRET`, expiran en 7 días) y
   se envía el correo con **Resend**. Se marca `fulfilledAt` (idempotente).
5. La descarga pasa por `/api/download/[slug]`: verifica token + que la orden
   esté pagada y contenga ese slug, y **transmite el `fullTrack` privado sin
   exponer su URL**.

Ver `DEPLOY.md` para el despliegue en producción (Vercel + Railway/Supabase + R2).

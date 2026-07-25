# Integración con Strapi

Esta guía describe los **content-types** que debes crear en Strapi para que el
frontend consuma datos reales. Mientras Strapi no esté disponible, el sitio usa
datos mock (`src/lib/mock-data.ts`) automáticamente, así que puedes desarrollar
sin backend.

## 1. Levantar Strapi

```bash
npx create-strapi-app@latest auraledge-cms --quickstart
```

Corre en `http://localhost:1337`. Crea tu usuario admin.

## 2. Content-Type: **Product** (Collection Type)

| Campo            | Tipo                 | Notas                                    |
|------------------|----------------------|------------------------------------------|
| `name`           | Text (short)         | Requerido                                |
| `slug`           | UID (target: name)   | Requerido, único                         |
| `subtitle`       | Text (short)         |                                          |
| `description`    | Text (long)          |                                          |
| `price`          | Decimal              | Requerido                                |
| `compareAtPrice` | Decimal              | Precio tachado (opcional)                |
| `tag`            | Text (short)         | Ej: "Best Seller", "New"                 |
| `badge`          | Text (short)         | Ej: "-30%"                               |
| `features`       | JSON                 | Array de strings: `["40h","ANC"]`        |
| `batteryHours`   | Integer              |                                          |
| `noiseCancelling`| Integer              | Porcentaje (0-100)                       |
| `bestValue`      | Boolean              | Aparece en el carrusel "Best Value"      |
| `highlight`      | Boolean              | Producto destacado del Hero/Highlight    |
| `image`          | Media (single)       | Imagen del producto                      |

> Si prefieres no usar el tipo JSON para `features`, puedes usar un Text corto
> con valores separados por coma (`40h, ANC, Fast Charge`); el frontend soporta
> ambos formatos.

## 3. Content-Type: **Testimonial** (Collection Type)

| Campo    | Tipo           | Notas                    |
|----------|----------------|--------------------------|
| `name`   | Text (short)   | Requerido                |
| `role`   | Text (short)   | Ej: "Producer"           |
| `quote`  | Text (long)    | Requerido                |
| `rating` | Integer        | 1-5                      |
| `avatar` | Media (single) | Foto del cliente         |

## 4. Content-Type: **Order** (Collection Type)

| Campo           | Tipo                 | Notas                                          |
|-----------------|----------------------|-------------------------------------------------|
| `items`         | JSON                 | Array de `{ slug, name, price, qty, image }`     |
| `customer`      | JSON                 | `{ name, email, phone }`                         |
| `total`         | Decimal              | Requerido                                        |
| `status`        | Enumeration           | `pending`, `approved`, `rejected`, `cancelled`   |
| `mpPreferenceId`| Text (short)         | Id de la preferencia de Mercado Pago             |
| `mpPaymentId`   | Text (short)         | Id del pago aprobado por Mercado Pago            |

**Permisos**: habilita `create` y `update` para `Order` en el rol que uses (Public si no hay
`STRAPI_API_TOKEN`, o el token de API si usas uno). El frontend crea la orden en
`POST /api/orders` (dentro de este content-type) al iniciar el checkout, y la actualiza cuando
llega la notificación de pago.

## 5. Permisos (endpoints públicos)

**Settings → Users & Permissions → Roles → Public** → habilita `find` y
`findOne` para `Product` y `Testimonial`.

Si prefieres endpoints protegidos, crea un **API Token**
(Settings → API Tokens, tipo *Read-only*) y ponlo en `.env.local` como
`STRAPI_API_TOKEN`. El frontend lo enviará como `Authorization: Bearer`.

## 6. Variables de entorno del frontend

Copia `.env.example` a `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=              # opcional

NEXT_PUBLIC_SITE_URL=http://localhost:3000
MP_ACCESS_TOKEN=               # requerido para que /api/checkout funcione
NEXT_PUBLIC_MP_PUBLIC_KEY=     # opcional, solo si se usan Bricks en el cliente
```

## 7. Cómo consume los datos el frontend

- `src/lib/api/strapi.ts` — cliente con `getProducts()`, `getProductBySlug()`,
  `createOrder()`, `updateOrder()`. Normaliza respuestas de Strapi **v4**
  (`{id, attributes}`) y **v5** (plano), y las URLs de media a absolutas.
- `src/app/api/*` — Route Handlers de Next.js que exponen una capa propia
  (`/api/products`, `/api/products/[slug]`, `/api/orders`, `/api/checkout`,
  `/api/webhooks/mercadopago`), usadas por los Client Components (checkout) y
  cualquier otro consumidor, sin exponer `STRAPI_API_TOKEN` al navegador.
- Si Strapi no responde (o devuelve vacío), cae en los datos mock, de modo que la
  UI nunca se rompe. Lo mismo para `createOrder()`: si Strapi no tiene el
  content-type `Order` todavía, genera un id local y el checkout sigue
  funcionando (la orden simplemente no queda persistida).
- Usa **ISR** con `revalidate: 60` (revalida cada 60s). Cámbialo a
  `cache: "no-store"` en `strapiFetch` si necesitas datos siempre frescos.

## 8. Endpoints usados

```
GET  /api/products?populate=image&pagination[pageSize]=100
GET  /api/products?filters[slug][$eq]=<slug>&populate=image
GET  /api/testimonials?populate=avatar&pagination[pageSize]=50
POST /api/orders
PUT  /api/orders/:id
```

## 9. Integración con Mercado Pago

El flujo de pago vive enteramente en Next.js (`src/lib/api/mercadopago.ts` +
`src/app/api/checkout/route.ts` y `src/app/api/webhooks/mercadopago/route.ts`),
usando el SDK oficial `mercadopago` (Node, v2 de la API):

1. El usuario completa sus datos en `/checkout` → `POST /api/checkout`.
2. La ruta crea la orden en Strapi (`createOrder`) y luego una **preferencia**
   de pago (`createPreference`), enviando `external_reference: order.id`.
3. El cliente redirige a `init_point` (Checkout Pro de Mercado Pago).
4. Mercado Pago notifica el resultado a `notification_url`
   (`/api/webhooks/mercadopago`); ese handler consulta el pago y actualiza la
   orden en Strapi (`updateOrder`) con `status` y `mpPaymentId`.

Si `MP_ACCESS_TOKEN` no está configurado, `/api/checkout` responde `501` con un
mensaje claro en vez de fallar de forma silenciosa — el checkout queda
"preparado" pero inactivo hasta que se cargue la credencial real.

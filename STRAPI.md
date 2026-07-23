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

## 4. Permisos (endpoints públicos)

**Settings → Users & Permissions → Roles → Public** → habilita `find` y
`findOne` para `Product` y `Testimonial`.

Si prefieres endpoints protegidos, crea un **API Token**
(Settings → API Tokens, tipo *Read-only*) y ponlo en `.env.local` como
`STRAPI_API_TOKEN`. El frontend lo enviará como `Authorization: Bearer`.

## 5. Variables de entorno del frontend

Copia `.env.example` a `.env.local`:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=            # opcional
```

## 6. Cómo consume los datos el frontend

- `src/lib/strapi.ts` — cliente con `getProducts()`, `getProductBySlug()`,
  `getTestimonials()`. Normaliza respuestas de Strapi **v4** (`{id, attributes}`)
  y **v5** (plano), y las URLs de media a absolutas.
- Si Strapi no responde (o devuelve vacío), cae en los datos mock, de modo que la
  UI nunca se rompe.
- Usa **ISR** con `revalidate: 60` (revalida cada 60s). Cámbialo a
  `cache: "no-store"` en `strapiFetch` si necesitas datos siempre frescos.

## 7. Endpoints usados

```
GET /api/products?populate=image&pagination[pageSize]=100
GET /api/products?filters[slug][$eq]=<slug>&populate=image
GET /api/testimonials?populate=avatar&pagination[pageSize]=50
```

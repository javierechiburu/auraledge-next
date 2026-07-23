# AuralEdge — E-commerce (Next.js + Strapi)

Tienda de audífonos premium construida con **Next.js 15 (App Router)** y
**TypeScript**, con **Strapi** como headless CMS.

## Stack

- Next.js 15 · React 19 · TypeScript
- App Router + Server Components (fetch de datos en el servidor con ISR)
- Strapi (headless CMS) — ver [STRAPI.md](./STRAPI.md)
- Carrito con Context + `localStorage`
- CSS puro (tema oscuro con degradados naranja/rojo)

## Arranque rápido

```bash
npm install
cp .env.example .env.local   # ajusta NEXT_PUBLIC_STRAPI_URL si hace falta
npm run dev
```

Abre http://localhost:3000. **Funciona sin Strapi**: si el backend no está
disponible usa datos mock (`src/lib/mock-data.ts`).

## Estructura

```
src/
  app/
    layout.tsx              # Root layout, fuentes, CartProvider, Navbar, CartDrawer
    page.tsx                # Home (server component, fetch de Strapi)
    globals.css             # Estilos globales / tema
    products/[slug]/page.tsx# Detalle de producto (SSG con generateStaticParams)
  components/
    Navbar, Hero, BestValue, Highlight, Collection,
    Testimonials, CTA, Footer, CartDrawer,
    ProductMedia, AddToCartButton
  context/
    CartContext.tsx         # Estado del carrito (persistido en localStorage)
  lib/
    strapi.ts               # Cliente de Strapi + fallback a mock
    mock-data.ts            # Datos de respaldo
    types.ts                # Tipos compartidos
```

## Conectar Strapi

Sigue [STRAPI.md](./STRAPI.md): crea los content-types `Product` y
`Testimonial`, habilita permisos públicos (o usa un API Token) y apunta
`NEXT_PUBLIC_STRAPI_URL` a tu instancia. El frontend detecta y consume los datos
reales automáticamente.

## Scripts

| Comando         | Descripción                    |
|-----------------|--------------------------------|
| `npm run dev`   | Servidor de desarrollo         |
| `npm run build` | Build de producción            |
| `npm start`     | Sirve el build                 |
| `npm run lint`  | Lint                           |
```

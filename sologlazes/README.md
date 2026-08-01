# SoloGlazes.com.ar — redesign

Каркас проекта на Next.js 15 (App Router) по спецификации из `01-PRD.md` → `04-ER-Diagram.md`.

## Что уже есть
- `tailwind.config.ts` — все токены дизайн-системы (цвет/типографика/тени/радиусы)
- `prisma/schema.prisma` — полная схема БД из ER-документа
- `app/layout.tsx`, `app/globals.css` — шрифты (Fraunces + Inter), базовые стили, `prefers-reduced-motion`
- `components/shop/site-header.tsx`, `site-footer.tsx` — навигация по IA п.4
- `components/shop/product-card.tsx` — карточка товара по DS п.6.2
- `app/page.tsx` — главная страница (hero → коллекции → «как это работает» → галерея → CTA WhatsApp)

## Contenido de las páginas — real vs. redactado

Además del catálogo, se migró texto real de sologlazes.com.ar a:
- `/nosotros` — bio real de Anna Sologubova y Fedor Sologubov
- `/contacto` — dirección, WhatsApp, email y horario reales
- `/envios-y-devoluciones` — tarifas de envío y política de reembolso reales
- `/guia/como-aplicar` — tablas de proporciones de preparación e instrucciones GRRR reales
- `/terminos`, `/privacidad` — condensado del texto real (plantilla estándar de Shopify que el
  cliente ya tenía publicada; algunos campos como [INSERTAR DIRECCIÓN COMERCIAL] seguían sin
  completar en el sitio original — recomendar al cliente completarlos antes del lanzamiento)

Páginas que siguen con copy propio (no existen en el sitio actual): la narrativa larga de
`/`, `/guia` (texto introductorio) y `/guia/superficies` — esta última se reescribió para
explicar las 3 líneas reales (Cristalina/Floating/GRRR) en vez de la distinción ficticia
"mate/brillante/satinado" que no existe en el sitio original.

## Datos del catálogo

`prisma/seed.ts` ya no tiene datos de muestra inventados — carga los **16 productos reales**
de sologlazes.com.ar (nombres, descripciones, precios, variantes de peso 0.5kg/1kg con sus
precios reales, e imágenes) tal como estaban publicados el 31/07/2026. Las fotos por ahora
hotlinkean al CDN de Shopify del sitio actual (`next.config.ts` lo permite) — migrarlas a
Cloudinary/UploadThing sigue siendo un pendiente del PRD, no bloquea el uso del scaffold.

Cosas que **no** se replicaron del sitio real (quedan simplificadas a propósito):
- El sitio real no tiene filtros de "superficie" o "efecto" — solo Disponibilidad y Precio.
  Este scaffold sólo filtra por Temperatura (dato real de las fichas) y Serie.
- El "Pack Prueba 5x200g" está cross-listado en Cristalina y Floating en el sitio real;
  acá vive solo en Cristalina (el schema es 1 producto → 1 colección).
- Reseñas de clientes: el sitio real no tenía ninguna publicada — se sembró vacío.

## Estado de conexión a base de datos (actualizado)

**Conectado a Prisma/PostgreSQL de punta a punta:**
- Sitio público: главная, `/catalogo`, `/catalogo/[collection]`, `/producto/[slug]`, búsqueda, `sitemap.xml`
- **Checkout real**: crea `Order`+`OrderItem`+`Address`, dispara email de confirmación
- **Auth real**: registro (`/registrarse`) hashea la contraseña con bcrypt; login (`/ingresar`) usa `next-auth/react` `signIn` + verifica el hash; sesión visible en el header (avatar + cerrar sesión)
- **`/cuenta/pedidos*`**, **`/cuenta/favoritos`** — protegidos por sesión real, datos reales
- **`/admin/*` completo** — pedidos (con cambio de estado + email automático), productos, categorías, reseñas (aprobar/rechazar), usuarios, galería (aprobar/rechazar), estadísticas (agregados reales de `Order`)
- **`/admin` ahora vive en su propio root layout** (`app/admin/layout.tsx`, con `<html>/<body>` propios) — separado del sitio público, que se movió a `app/(site)/` con su propio root layout. Ya no comparten header/footer.

**Credenciales demo (sembradas por `prisma:seed`):** `maria@example.com` / `sologlazes123`

**Detalles menores que quedan para después:**
- `sendOrderDeliveredEmail` (falta el template — ver TODO en `lib/email/send.ts`)
- Sin analytics conectado — "Conversión" en `/admin/estadisticas` no se puede calcular todavía (ver nota en la página)
- No hay verificación de email al registrarse (el campo `emailVerified` existe en el modelo pero no se usa)

## Запуск локально
```bash
npm install
cp .env.example .env        # заполнить DATABASE_URL и т.д.
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Дальше (следующие шаги реализации, по PRD п.9)
1. `/catalogo` — список + фильтры (DS п.6.3), серверные Server Components + Prisma-запрос по `ProductAttributeValue`
2. `/producto/[slug]` — карточка товара (галерея, характеристики, отзывы)
3. Auth (NextAuth) — вход/регистрация/`/cuenta`
4. Корзина/чекаут (архитектура под Mercado Pago, боевые ключи — на стороне клиента при деплое)
5. Email через Resend (шаблоны по `EmailType` из схемы)
6. `/admin` — CMS
7. SEO-слой: sitemap.xml, robots.txt, JSON-LD, OpenGraph

# Deploy — SoloGlazes (GitHub + Vercel + Supabase)

Guía exacta para esta combinación. ~15 min.

## 1. Repo en GitHub

```bash
cd sologlazes
git init
git add .
git commit -m "Initial scaffold"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sologlazes.git
git push -u origin main
```
(Crear antes el repo vacío `sologlazes` en github.com — sin README ni .gitignore, ya vienen en el proyecto.)

## 2. Supabase

1. supabase.com → **New project**. Elegí un password de base de datos y **guardalo**.
2. Cuando el proyecto esté listo: **Project Settings → Database → Connection string**.
3. Vas a ver dos modos — necesitamos los dos:
   - **Transaction pooler** (puerto `6543`) → esto va en `DATABASE_URL`
   - **Session/Direct connection** (puerto `5432`) → esto va en `DIRECT_URL`
4. En ambas, reemplazá `[YOUR-PASSWORD]` por el password que guardaste en el paso 1.

El `schema.prisma` de este proyecto ya está configurado para usar `DATABASE_URL` (pooled, para
el runtime en Vercel) y `DIRECT_URL` (directa, para migraciones) — es el patrón estándar de
Prisma + Supabase, no hace falta tocar nada más.

## 3. Importar en Vercel

1. vercel.com → **Add New → Project** → seleccioná el repo `sologlazes` de GitHub
2. Framework: se detecta solo (Next.js)
3. **Antes de darle Deploy**, abrí **Environment Variables** y cargá:

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | Supabase → Connection string → Transaction pooler (puerto 6543) |
| `DIRECT_URL` | Supabase → Connection string → Direct connection (puerto 5432) |
| `AUTH_SECRET` | Generar local: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Dejalo vacío por ahora, lo completamos en el paso 5 |
| `RESEND_API_KEY` | resend.com → API Keys (podés usar el dominio de prueba de Resend mientras no verifiques `sologlazes.com.ar`) |
| `MERCADO_PAGO_ACCESS_TOKEN` | Dejar vacío — el checkout ya funciona con "coordinar por WhatsApp" sin esto |

4. **Deploy**. La primera build puede fallar si `DATABASE_URL` todavía no tiene tablas — es
   normal, seguimos al paso 4 y luego re-deployamos.

## 4. Crear las tablas y sembrar datos reales

En tu máquina, con el repo clonado y un `.env` local apuntando a Supabase (mismos
`DATABASE_URL`/`DIRECT_URL` del paso 2):

```bash
npm install
npx prisma migrate deploy
npm run prisma:seed
```

Esto crea el schema completo y carga los 16 productos reales + usuario demo
(`maria@example.com` / `sologlazes123`).

## 5. Completar `NEXTAUTH_URL` y re-deployar

1. Copiá la URL que te dio Vercel (`https://sologlazes-xxxx.vercel.app` o tu dominio si ya lo
   conectaste)
2. Vercel → Settings → Environment Variables → editá `NEXTAUTH_URL` con esa URL
3. Deployments → ⋯ en el último deploy → **Redeploy**

## 6. Verificar

- `/` y `/catalogo` — deberían mostrar los 16 productos reales
- Crear una cuenta en `/registrarse`, loguearte, hacer un pedido de prueba en `/checkout`
- Revisar Resend Dashboard → Logs para confirmar que llegó el email de confirmación
- Para entrar a `/admin`, hace falta un usuario con `role: ADMIN` — por ahora no hay UI para
  promoverlo, así que se cambia a mano: Supabase → Table Editor → tabla `User` → editá el
  campo `role` del usuario que quieras a `ADMIN`

## 7. Dominio propio

Vercel → Settings → Domains → agregá `sologlazes.com.ar` → seguí las instrucciones de DNS que
te da Vercel (dependen de dónde está comprado el dominio). Después de que propague, actualizá
`NEXTAUTH_URL` al dominio final y volvé a hacer Redeploy.

## Antes de mandar tráfico real

- Reemplazar `MERCADO_PAGO_ACCESS_TOKEN` con claves reales, o dejar el checkout solo con la
  opción "coordinar por WhatsApp" si todavía no está listo
- Migrar las fotos de producto del CDN de Shopify a un storage propio (Cloudinary/UploadThing)
  — `next.config.ts` permite el hotlink temporal, pero no es ideal a largo plazo
- Cambiar la contraseña o borrar el usuario demo sembrado
- Que el equipo legal revise `/terminos` y `/privacidad` — quedaron campos sin completar del
  sitio original (dirección comercial, número de registro, etc.)

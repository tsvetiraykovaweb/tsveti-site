# Deployment — GitHub · Supabase · Vercel

Стъпки за свързване на трите услуги за сайта на **Цветелина Райнова**.

## Архитектура

```
GitHub (source)  →  Vercel (build + hosting)  →  Production URL
                         ↓
                    Supabase (DB, Auth, Storage)
```

- **GitHub** държи кода; push към `main` стартира deploy на Vercel.
- **Vercel** билдва Next.js и сервира сайта.
- **Supabase** — backend (по-късно: съдържание, auth, снимки).

---

## 1. Supabase

### 1.1 Ключове от Dashboard

1. Отвори [Supabase Dashboard](https://supabase.com/dashboard) → твоят проект.
2. **Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (само сървър / Vercel, никога в браузър)

3. **Settings → General** → **Reference ID** (напр. `abcdefghijklmnop`) — нужен за `supabase link`.

### 1.2 Локален `.env.local`

```powershell
Copy-Item .env.example .env.local
```

Попълни реалните стойности в `.env.local` (файлът **не** се качва в Git).

### 1.3 Auth redirect URLs (важно за `/admin/login`)

В Supabase: **Authentication → URL Configuration**

| Поле | Стойности |
| ---- | --------- |
| **Site URL** | `https://cvetelina-raynova.vercel.app` |
| **Redirect URLs** | `http://localhost:3000/**` |
| | `https://cvetelina-raynova.vercel.app/**` |
| | `https://*.vercel.app/**` (preview deploys) |

### 1.4 Supabase CLI (опционално, за migrations)

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

---

## 2. GitHub

Репото: **https://github.com/vemidi-dev/cvetelina-raynova**

Production URL: **https://cvetelina-raynova.vercel.app**

### Първи push (ако още не е направен)

```powershell
git add .
git commit -m "Initial project setup for Цветелина Райнова"
git push -u origin main
```

### Клон

По подразбиране: `main`.

---

## 3. Vercel

### 3.1 Свързване с GitHub

1. [Vercel Dashboard](https://vercel.com) → **Add New → Project**.
2. Import `vemidi-dev/cvetelina-raynova`.
3. Framework: **Next.js** (auto-detect).
4. Root directory: `.` (project root).

Или от CLI (след `vercel link`):

```powershell
vercel git connect
```

### 3.2 Environment variables в Vercel

**Settings → Environment Variables** — добави за **Production**, **Preview**, и **Development**:

| Variable | Notes |
| -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role — **Sensitive** |
| `NEXT_PUBLIC_SITE_URL` | Production: `https://cvetelina-raynova.vercel.app` |

Скрипт (след попълване на `.env.local`):

```powershell
.\scripts\sync-vercel-env.ps1
vercel --prod
```

### 3.3 Deploy

- Автоматично при push към `main`.
- Ръчно: `vercel --prod` от проектната папка.

---

## 4. Проверка след setup

```powershell
npm run build
npm run dev
```

- Локално: http://localhost:3000
- Production: URL от Vercel dashboard

---

## 5. Често срещани проблеми

| Проблем | Решение |
| ------- | ------- |
| Admin redirect loop | Провери Supabase Auth redirect URLs |
| Build fail на Vercel | Провери env vars в Vercel dashboard |
| Supabase „Invalid API key“ | Сравни `.env.local` с Dashboard → API |
| Service role в браузър | Никога `NEXT_PUBLIC_` за service role |

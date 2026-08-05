# Deployment — GitHub · Supabase · Vercel

Стъпки за свързване на услугите за сайта на **Цветелина Райкова**.

> **Важно:** Този проект е за клиент. Използвай **отделни** GitHub, Vercel и Supabase акаунти/организации — без връзка с лични vemidi профили.

## Архитектура

```
GitHub (source)  →  Vercel (build + hosting)  →  Production URL
                         ↓
                    Supabase (DB, Auth, Storage)
```

---

## 0. Нови акаунти (препоръчително)

| Услуга | Действие |
| ------ | -------- |
| **GitHub** | [tsvetiraykovaweb](https://github.com/tsvetiraykovaweb) → repo `tsveti-site` |
| **Vercel** | Нов team/account → import от новия GitHub repo |
| **Supabase** | Нов проект в Supabase org за клиента |

Локално: `git remote` и `.vercel` **не** трябва да сочат към vemidi акаунти.

---

## 1. Supabase

### 1.1 Ключове от Dashboard

1. [Supabase Dashboard](https://supabase.com/dashboard) → проект за Цветелина.
2. **Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (само сървър / Vercel)

3. **Settings → General** → **Reference ID** — за `supabase link`.

### 1.2 Локален `.env.local`

```powershell
Copy-Item .env.example .env.local
```

### 1.3 Auth redirect URLs

**Authentication → URL Configuration** (след първи Vercel deploy — замени с реалния production URL):

| Поле | Стойности |
| ---- | --------- |
| **Site URL** | `https://YOUR-PRODUCTION-DOMAIN.vercel.app` |
| **Redirect URLs** | `http://localhost:3000/**` |
| | `https://YOUR-PRODUCTION-DOMAIN.vercel.app/**` |
| | `https://*.vercel.app/**` |

### 1.4 Supabase CLI (опционално)

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

---

## 2. GitHub — `tsvetiraykovaweb/tsveti-site`

Repo: **https://github.com/tsvetiraykovaweb/tsveti-site**

Локалният `origin` вече сочи към този repo. Push изисква GitHub login като **tsvetiraykovaweb** (не vemidi-dev).

### 2.1 Влез с клиентския GitHub акаунт

```powershell
gh auth login
# Избери: GitHub.com → HTTPS → Login with browser
# Влез като tsvetiraykovaweb
```

Ако `gh` още е на vemidi:

```powershell
gh auth logout -h github.com -u vemidi-dev
gh auth login
```

### 2.2 Push

```powershell
git push -u origin main
```

Ако `origin` липсва:

```powershell
git remote add origin https://github.com/tsvetiraykovaweb/tsveti-site.git
git push -u origin main
```

---

## 3. Vercel (нов профил / team)

### 3.1 Свързване с GitHub

1. Влез в **новия** Vercel акаунт.
2. **Add New → Project** → Import от новия GitHub repo.
3. Framework: **Next.js** (auto-detect).

Или от CLI (логнат в новия Vercel акаунт):

```powershell
vercel link
vercel git connect
```

### 3.2 Environment variables

**Settings → Environment Variables** — Production, Preview, Development:

| Variable | Notes |
| -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Sensitive |
| `NEXT_PUBLIC_SITE_URL` | Production URL от Vercel |

След `.env.local`:

```powershell
.\scripts\sync-vercel-env.ps1
vercel --prod
```

### 3.3 Deploy

- Автоматично при push към `main`.
- Ръчно: `vercel --prod`.

---

## 4. Почистване на vemidi връзки (ако бяха създадени по грешка)

| Място | Действие |
| ----- | -------- |
| Локално | `git remote remove origin` (ако сочи към vemidi) |
| Локално | Изтрий папка `.vercel` |
| Vercel (vemidi) | Изтрий проект `cvetelina-raynova` от vemidi dashboard |
| GitHub (vemidi-dev) | **Settings → Delete repository** за `cvetelina-raynova` |

---

## 5. Проверка

```powershell
git remote -v          # трябва да е новия GitHub или празно
Test-Path .vercel      # False, докато не vercel link в нов акаунт
npm run build
npm run dev
```

---

## 6. Често срещани проблеми

| Проблем | Решение |
| ------- | ------- |
| Admin redirect loop | Supabase Auth redirect URLs |
| Build fail на Vercel | Env vars в новия Vercel проект |
| Wrong account deploy | `vercel logout` → login с клиентски акаунт |
| Service role в браузър | Никога `NEXT_PUBLIC_` за service role |

# 🧪 POC Prompt — Astro + Tailwind (SSG) with D1 on Cloudflare Pages

## Role

You are a **senior full-stack engineer** with strong experience in **Astro**, **Tailwind CSS**, and **Cloudflare Pages**.

## Goal

Build a **proof-of-concept** for a **single-page, SEO-friendly company website** with **inline editing**, using **Static Site Generation (SSG)** and **redeploy-on-save**, deployed to **Cloudflare Pages**.

The site must be simple, robust, and suitable for **non-technical users**.

---

## 🔒 Non-Negotiable SEO Requirement

- The site must be **fully static**.
- All visible content must exist **directly in the generated HTML** (`dist/index.html`).
- After editing and saving content, a **new static build must be deployed**.
- Search engines must be able to index the edited text **without relying on client-side JavaScript**.
- No runtime fetching of content for normal visitors.

---

## 🧱 Architecture (Mandatory)

- Framework: **Astro (SSG mode only)**
- Styling: **Tailwind CSS**
- Hosting: **Cloudflare Pages**
- Content persistence: **Cloudflare D1 database**
- Rendering: **Static build output only**

### ❌ Explicitly Forbidden

- SSR or edge rendering
- Cloudflare KV for runtime rendering
- Client-side content fetching for display
- CMS frameworks
- React / Vue / Svelte

---

## 🗄️ Content Model (D1)

- Use **Cloudflare D1** as the single source of truth for content.
- Store content as **key–value pairs** in a table named `content`.

SQL schema:

```sql
CREATE TABLE content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Example keys:

- `hero_title`
- `hero_subtitle`
- `about_text`
- `services_text`
- `contact_text`

---

## 🏗️ Build-Time Content Flow (Critical)

- The Astro build must **fetch content from D1 at build time**.
- A build script (e.g. `scripts/fetch-content.mjs`) must:
  1. Query D1 for all content keys
  2. Write the result to a local file:
     - `src/content/site.json`
- Astro must import `site.json` and render static HTML from it.
- The final output must contain **no dependency on D1 or APIs at runtime**.

---

## ✏️ Inline Editing Behavior

1. Default mode is **read-only**
2. Edit mode is enabled via `?edit=true`
3. In edit mode:
   - Elements with `data-editable="key"` become `contenteditable="true"`
   - A floating **Save** button appears
4. Editing is **plain text only**
   - Strip or reject HTML
   - Store plain strings in D1

Example markup:

```html
<h1 data-editable="hero_title">{content.hero_title}</h1>
<p data-editable="about_text">{content.about_text}</p>
```

---

## 💾 Save + Redeploy Flow (Critical)

### Save

When the user clicks **Save**:

1. Collect all `[data-editable]` elements
2. Build a `{ key: value }` object
3. Send it via `POST /api/save`
4. Include an `ADMIN_TOKEN` for authorization

### Backend (`/api/save`)

- Implemented as a **Cloudflare Pages Function**
- Responsibilities:
  - Validate `ADMIN_TOKEN`
  - Upsert key–value pairs into **D1**
  - Trigger a **Cloudflare Pages Deploy Hook**

### After Redeploy

- The Pages build runs:
  - `node scripts/fetch-content.mjs`
  - `astro build`
- The generated `dist/index.html` contains the updated text
- The live site reflects changes
- Crawlers receive updated static HTML

---

## 🔐 Security (POC Level)

- Use a shared secret: `ADMIN_TOKEN`
- Token is sent via request header
- Token is validated server-side
- No user accounts or auth UI required

---

## 🎨 Frontend Requirements

- Astro components only
- Tailwind CSS for layout and typography
- Minimal, content-first design
- Vanilla JavaScript for edit/save logic
- No frontend frameworks

---

## 📦 Deliverables

Provide **full contents** for all required files:

- Project folder structure
- `package.json`
- `astro.config.mjs`
- `tailwind.config.js`
- `src/pages/index.astro`
- `src/content/site.json` (generated at build time; not manually edited)
- `scripts/fetch-content.mjs`
- Frontend JS for inline editing
- Pages Function for `/api/save`
- `wrangler.toml` (with D1 binding)

---

## ⚙️ Cloudflare Pages Configuration

Include instructions for:

- Build command (e.g. `node scripts/fetch-content.mjs && astro build`)
- Output directory (`dist`)
- D1 database binding
- Deploy Hook creation and usage
- Environment variables:
  - `ADMIN_TOKEN`
  - `CF_PAGES_DEPLOY_HOOK_URL` (or equivalent name you choose for the deploy hook URL)

---

## ▶️ Instructions

Clearly explain:

- How to run locally
- How to deploy to Cloudflare Pages
- How to create and connect a D1 database
- How the redeploy-on-save flow works end-to-end

---

## 🚫 Hard Constraints

- ❌ No SSR
- ❌ No runtime database access for visitors
- ❌ No GitHub commits for content edits
- ❌ No CMS platforms
- ❌ No client-side rendering of content for normal visitors

---

## ✅ Final Reminder

Content edits must only become live **after a successful static redeploy**, and the edited text must exist **directly in the generated HTML** so it is fully indexable by search engines.

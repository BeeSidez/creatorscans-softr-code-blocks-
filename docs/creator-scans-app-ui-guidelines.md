# Creator Scans — App UI Guidelines

The single reference for building **in-app Vibe Code blocks** (dashboard, notifications, recently-published, onboarding, etc.). App feel = **Intercom / Linear**, not a landing page. No marketing heroes inside the app.

> Scope: the logged-in product experience. Website/landing blocks are not covered here.

---

## 1. Colour

### Core palette (use these for 90% of UI)

| Token | Hex | Use |
|---|---|---|
| **Primary** | `#5E7BF6` | Primary buttons & CTAs (periwinkle), white text. The default action colour. |
| **Accent** | `#000A30` | Page / section headings (darkest). |
| **Navy** | `#001364` | Body text, card titles, stat values. |
| **Muted** | `#6b7a99` | Secondary / helper / caption text. |
| **Border** | `#eef4fd` | Hairline borders (1px), chart tracks, empty-state fills. |
| **Surface** | `#FFFFFF` | Cards and page surface. |
| **Success** | `#16a34a` | Positive states (verified, approved, "up"). |
| **TikTok pink** | `#FE2C55` | Live indicators, hearts, alerts. **Use sparingly** — it is an accent, not a primary. |

### Extended scale (data-viz, charts, the richer report surfaces)

Blues — darkest → lightest:

| Token | Hex |
|---|---|
| blue | `#294ff6` |
| blue2 | `#4466f8` |
| blue3 | `#5e7bf6` (= Primary) |
| blue4 | `#7a93ff` |
| blue5 | `#879cf7` |

Navy (dark backgrounds, profile header gradient): `#000f4d` · `#001364` · `#152237`
Light fills: `#f8fbff` · `#eef4fd` · `#fafbff` · lavender `#d8d8ff`

**Rule of thumb:** simple blocks (lists, settings, notifications) use the *core* palette with `#5E7BF6` as the single action colour. Data-dense blocks (the creator dashboard, charts, donuts) draw from the *extended* blue scale.

### Paste-ready token object

```js
const CS = {
  primary: "#5E7BF6",  // periwinkle — primary buttons & CTAs (white text)
  accent:  "#000A30",  // headings (darkest)
  navy:    "#001364",  // body text, titles, stat values
  muted:   "#6b7a99",  // secondary / helper text
  border:  "#eef4fd",  // 1px borders, chart tracks
  surface: "#FFFFFF",  // cards
  success: "#16a34a",  // positive states
  tiktok:  "#FE2C55",  // live / hearts / alerts — sparingly

  // extended scale (charts, dashboard)
  blue: "#294ff6", blue2: "#4466f8", blue3: "#5e7bf6", blue4: "#7a93ff", blue5: "#879cf7",
  navy1: "#000f4d", navy2: "#001364", navy3: "#152237",
  light1: "#f8fbff", light2: "#eef4fd", light3: "#fafbff", lavender: "#d8d8ff",
};
```

---

## 2. Typography

**Inter everywhere.** Headings = Medium/Semibold, Body = Normal, Buttons = Semibold.

| Use | Size / weight | Colour |
|---|---|---|
| Page header (h2) | 24px / 600–700 | Accent |
| Card title (h3) | 16px / 600 | Navy |
| Section pill / eyebrow | 12px / 600, uppercase, letter-spacing 0.05em | Primary |
| Body | 14px / 400 | Navy |
| Helper / muted | 13–14px / 400 | Muted |
| Caption | 12px | Muted |
| Big stat / number | 24–28px / 700–800 | Navy |

---

## 3. Layout

Wrap every block:

```jsx
<div className="container py-6">
  <div className="content mx-auto" style={{ maxWidth: 1140 }}>
    …
  </div>
</div>
```

- **`maxWidth: 1140`** inline (not `max-w-4xl`, which is 896px and wrong for app blocks).
- Reading-column blocks (notifications, single-form settings) may narrow to ~680px.
- Roundness: `rounded-xl` / `rounded-lg` (medium). Shadows: `shadow-sm`. Borders: 1px `#eef4fd`. Keep it compact (size S).

---

## 4. Icons

- **Lucide** (`lucide-react`) only. **Never emoji** in UI.
- Conventions: views `Eye`, likes `ThumbsUp`/`Heart`, comments `MessageCircle`, shares `Share2`, live `Radio`, shop `ShoppingBag`, refresh `RefreshCw`.

---

## 5. Components & feedback

- shadcn from `@/components/ui/*` (Button, Input, Select, Card, Badge, Avatar, Separator…).
- Feedback via `Toaster` + `toast` from `sonner`.
- Buttons: primary = `style={{ backgroundColor: "#5E7BF6", color: "#fff" }}`, semibold. Secondary = `variant="outline"` with navy text + `#eef4fd` border.

---

## 6. Modals

- Open with `window.openSwModal(url, size)` — sizes `sm` / `md` / `lg`.
- Plain `<a>` tags do **not** trigger Softr modals.
- Example (per-card detail): `window.openSwModal(\`/proof?recordId=\${record.id}\`, "lg")`.

---

## 7. Data layer (Softr Vibe) — read this before wiring data

- Field values live at **`record.fields.<alias>`**, never `record.<alias>`.
- `q.select({ alias: "FieldID" })`. **Writes use the alias** as the key (`fields: { aliasName: value }`) — field IDs as keys throw "Record data cannot be empty".
- Every alias you select must be **used** in the block, or the analyzer can refuse to save.
- Lists: `useRecords({ select })` → `data?.pages?.flatMap(p => p?.items ?? []) ?? []`.
- Single record: `useRecord` + `useCurrentRecordId`.
- Logged-in user: `useCurrentUser()` → **`.id` only** (the Users record id). It does **not** expose tokens or linked records. Need more? Read the Users record server-side (n8n) by that id.
- Select / linked values are **objects**: `f.x?.label`, `f.x?.id`.
- **Attachments** come back as a single **object** `{ id, url }`, an **array** `[{ url }]`, **or** a string. Handle all three:
  ```js
  const url = Array.isArray(v) ? v[0]?.url : (typeof v === "object" ? v?.url : v);
  ```
- **Lookups drift.** Parallel lookup fields (Views, Embed, Share as separate columns) do **not** stay index-aligned in the data layer — you'll join a title from one row to a video from another. For any array-of-objects coming from n8n, write the **whole thing as JSON into ONE long-text field** and `JSON.parse` it in the block. Each object keeps its own fields together.
- The Vibe **Actions tab is read-only** (FIELDS USED is auto-pulled from `q.select`). Never tell anyone to edit it; debug 400s via the console / Network tab.

---

## 8. Established patterns

- **Two-state dashboard.** The creator dashboard renders an **API state** (instant on connect — profile + metrics computed from the API videos + top videos) when scrape fields are empty, and the **full scrape state** (GMV, demographics, collabs, LIVE) once they're populated. Detect with a scrape-only field (`Data period` / GMV). Never render scrape-only fields unconditionally.
- **Per-user data = Source-tab filter.** Code can't filter on a user relation; bind the block's Source to the table and filter "where `users`/`User` contains the logged-in user."
- **Webhook triggers send an id, not secrets.** Buttons that fire an n8n webhook POST `{ user_id }`; n8n loads the full record (tokens, links) server-side. Tokens never touch the browser.
- **Inline video = TikTok player embed.** Use the stored Embed Link (`tiktok.com/player/v1/{id}`) in a 9/16 `<iframe>`; set `autoplay=0` when several render at once.

---

## 9. Copy rules (in-app text)

- **No em dashes** — use full stops, commas, or colons.
- **No "scraped" language**, no fake deletion/urgency countdowns.
- Evergreen wording — avoid "new", "just launched", "overnight".

# Jude Mpoyo | Full-stack Developer

[![Nuxt](https://img.shields.io/badge/Nuxt-4.2-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Stack](https://img.shields.io/badge/Stack-PHP%20%2F%20Laravel-8892BF?logo=laravel&logoColor=white)](https://laravel.com)
[![Learning](https://img.shields.io/badge/Learning-Go-00ADD8?logo=go&logoColor=white)](https://go.dev)

Portfolio of Jude Mpoyo, a full-stack developer based in Kolwezi, DRC. Built around web development, frontend contributions to Miabi and GoPosta, and deployment and operation on his own infrastructure. The main audience is people commissioning freelance and remote work.

## 🏗 Concept: "Proof by Infrastructure"

The design moves away from traditional creative portfolios to embrace a **technical documentation** aesthetic:
- **Blueprint UI**: Monochromatic palette (Concrete/Chrome), 40px construction grid, and 1px technical borders.
- **Log Level Interaction**: A global switch between `INFO` (summary) and `DEBUG` (additional technical context).
- **YAML Stack**: Skills presented as infrastructure configuration files.
- **Status Bar**: Profile information and a visitor-local clock; this is not infrastructure monitoring.

## 🛠 Tech Stack

- **Framework**: Nuxt 4 / Vue 3
- **Styling**: Tailwind CSS 4; legacy theme migration is a separate planned batch.
- **I18n**: `@nuxtjs/i18n`, English by default and French at `/fr`. SEO and sitemap alignment are a separate planned batch.
- **State**: Custom composables for Global Log Level management.
- **Deployment**: Configured for SSG (Static Site Generation) with Nitro.

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (SSG)
npm run generate
```

## 📂 Project Structure

- `app/components/layout/`: Modular layout components (Header, Footer, Nav).
- `app/components/sections/`: Technical data sheets for About, Projects, and Contact.
- `app/composables/`: Technical state management (Log Levels, etc.).
- `i18n/locales/`: English and French content in JSON format.

## 🌐 Localization

The main content is managed in `i18n/locales/*.json`, English first and French second. Some existing decorative labels and metadata still need localization in later batches.

## Content evidence

- Uzaraka: team project; Nuxt 3 frontend contribution; private repository.
- Miabi: merged frontend contributions and hands-on server installations, with app deployment and management.
- GoPosta: merged frontend contributions.
- LaraApiStarter: Laravel 12 API starter with Actions and typed DTOs; no security or production-readiness guarantee.
- No public Lighthouse score is claimed. Local audit reports are review artifacts, not deployed-site measurements.

---
**Designed by Jude Mpoyo // Built with Nuxt & Concrete Aesthetics**

## Production journal design

The default experience uses a warm paper, ink and copper palette, a system sans-serif for content and JetBrains Mono for annotations. Go is highlighted as an active learning direction, not claimed as a professional backend contribution.

- Project contributions are linked individually, without maintenance-heavy PR totals.
- Terminal mode opens an optional floating non-modal window and is lazy-loaded on request. Commands are a fixed allowlist, never evaluated as code.
- Miabi's contribute/install/operate steps and the factual TLS incident are interactive.
- Motion 14.0.0 drives the delivery diagram, scroll-linked production journal, project reveals and Go lettering. It is dynamically imported after initial page loading and is skipped entirely for reduced motion. Initial viewport text is never hidden. Animations use transforms and opacity. The measured standalone API bundle is 23.1 kB gzip; inspect the Nuxt build for the actual emitted scene chunk.
- Tailwind v4 design tokens live in `app/assets/css/main.css`; the unused legacy JavaScript configuration has been removed.
- The photo easter egg remains available via triple-click on the About signature, Ctrl+Shift+J, and the timed invitation. The portrait uses a native modal with keyboard focus containment and restoration; the terminal deliberately remains non-modal so the page can still be used.

## Deployment base and contact configuration

The site can be published at the domain root or under a subdirectory. `.env.example` documents `NUXT_APP_BASE_URL`, `NUXT_PUBLIC_SITE_URL` and `NUXT_PUBLIC_WHATSAPP_NUMBER`. Static output must be regenerated after configuration changes.

## Floating terminal and interactions

The terminal is a non-modal floating window: visitors can drag it, move it with keyboard arrows from the grip, minimize it to a dock or maximize it. It includes project details, contribution links, the TLS incident, tool information, search, contact links, theme/language commands, session history and completion. Command history is held in Nuxt client state; commands do not execute system code.

Motion entrances replay on viewport re-entry in either scroll direction. Hover and focus interactions add spring feedback to projects, tools, calls to action and the portrait. The delivery diagram loops only while in view and pauses in background tabs. All animation remains optional under reduced-motion preferences.

The About section now includes the existing portrait, while the original shortcut and timed invitation remain available. A dedicated toolbench separates current tools from Go, which is explicitly marked as a learning direction.


### Preview the static site locally

```sh
npm run generate:local
npm run preview
```

Open the local URL printed by the preview command. `generate:local` builds with
`NUXT_APP_BASE_URL=/`, so assets resolve correctly when the output is served at
localhost's root. It does not modify `.env`. Alternatively, after this local
build, use `npx serve .output/public`.

A build generated with `/jude/` expects the **entire** output directory to be
mounted under `/jude/`, including its assets. Serving that output at `/` does not
simulate the production mount and can leave the page without styles.

### Build for deployment

```sh
# Subdirectory: publish the output contents in the host's jude directory.
NUXT_APP_BASE_URL=/jude/ npm run generate

# Domain root: publish the output contents in the host's public root.
NUXT_APP_BASE_URL=/ npm run generate
```

Each generation replaces `.output/public`. Regenerate with the deployment base
before publishing after a local preview. `NUXT_PUBLIC_SITE_URL` is the production
origin only, without a path.

The unused Bunny font provider is disabled. JetBrains Mono still uses the Google
provider during generation; uncached font downloads therefore require network
access. This setting does not change Google site verification or analytics.

### Apache / nginx hosting

The exported `.htaccess` intentionally contains comments only. Static EN/FR pages
are served from their generated directories without a rewrite fallback. This
avoids `Options`, `Header`, and rewrite directives that restricted hosting can
reject with HTTP 500. Replace the previously deployed `.htaccess` too; uploading
only visible files may leave the old hidden file in place. Publish the contents
of `.output/public`, not the source `public` directory.

An nginx response header does not identify which server ultimately reads
`.htaccess`; nginx may proxy to Apache. If HTTP 500 persists with the minimal
file, consult the hosting error log or ask the host for the exact rejected
directive. No root access is required to replace the site's own `.htaccess`.

### Offline fallback

A small service worker caches only `offline.html` after a successful connected
visit. It intercepts navigation failures within the configured base path and
shows a self-contained EN/FR profile and contact page. It does not cache the live
portfolio, analytics, or third-party requests. Registration requires HTTPS (or
localhost) and is disabled in development. A first-ever visit without a network
connection cannot download this fallback. The retry button reloads the original
URL; network detection alone is not proof that the server is reachable.

When changing the fallback page, increment the cache version in `public/sw.js`.

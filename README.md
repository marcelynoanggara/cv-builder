# CV Builder

An interactive, open-source CV builder with a clean and simple UI. Fill in your details, watch a live preview update as you type, pick a template and accent color, then export to PDF — all from your browser, installable as an app on Android.

**Live demo:** https://marcelynoanggara.github.io/cv-builder/

## Features

- ✏️ **Simple editor** — collapsible sections with live summaries, one thing at a time
- 👀 **Live preview** — updates instantly as you typ
- 🎨 **Total design freedom** — one-tap style presets, 5 templates, any accent color, 3 fonts + upload your own, custom CSS
- 🖼️ **Optional profile photo** — upload, auto-resized, shown in every template
- 🧩 **Custom layout** — reorder sections, toggle visibility, sidebar position, header alignment
- 🎲 **Random CV generator** — one click for a fresh random persona (great for inspiration)
- ℹ️ **About dialog** — professional in-app overview
- 🖨️ **Export to PDF** — print-optimized A4 layout, one click
- 💾 **Auto-save** — your CV is stored in the browser, no account needed
- 📦 **Export / import JSON** — back up or move your CV between devices
- 📱 **PWA** — installable on Android, works offline via service worker
- 🆓 **100% free & open source** (MIT)

## Run locally

No build step needed — it's plain HTML, CSS, and JavaScript:

```bash
# from the repo root
python3 -m http.server 8080
# then open http://localhost:8080
```

## Tech

- Vanilla HTML / CSS / JavaScript (no frameworks, no build)
- PWA: Web App Manifest + Service Worker (cache-first, offline fallback)
- Deployed with GitHub Pages + GitHub Actions

## Project structure

```
├── index.html          # app shell
├── styles.css          # app + CV template + print styles
├── app.js              # editor, templates, export, PWA install
├── manifest.json       # PWA manifest
├── sw.js               # service worker (offline support)
├── icons/              # app icons (PNGs stored as .b64, decoded at deploy —
│                       #   decode locally with: base64 -d icons/icon-192.png.b64 > icons/icon-192.png)
└── .github/workflows/  # GitHub Pages deploy
```

## Contributing

Contributions are welcome! Fork the repo, make your change, and open a pull request. Ideas: more templates, photo upload, multi-language UI, DOCX export.

## License

MIT — see [LICENSE](LICENSE).

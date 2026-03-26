# lingua-docs

Documentation site for the [Lingua](https://github.com/rivalex/lingua) Laravel package.

Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages at [rivalex.github.io/lingua-docs](https://rivalex.github.io/lingua-docs/).

## Local development

```bash
npm install
npm run docs:dev
```

Open http://localhost:5173/lingua-docs/

## Build

```bash
npm run docs:build
npm run docs:preview
```

## Adding screenshots

Place screenshots in `docs/public/screenshots/`. Reference them in markdown as:

```markdown
<div class="screenshot">
  <img src="/screenshots/my-screenshot.png" alt="Description" />
  <div class="screenshot-caption">Caption text</div>
</div>
```

Recommended screenshot filenames:
- `hero.png` — home page hero image
- `languages-page.png` — languages management page
- `language-add-modal.png` — add language modal
- `translations-page.png` — translations management page
- `translations-filters.png` — translations with filters applied
- `translation-editor-html.png` — HTML editor
- `selector-sidebar.png` — language selector (sidebar mode)
- `selector-dropdown.png` — language selector (dropdown mode)
- `selector-modal.png` — language selector (modal mode)

## Deployment

Push to `main` and the GitHub Actions workflow deploys automatically to GitHub Pages.

**First-time setup:**
1. Go to the repository Settings → Pages
2. Set Source to **GitHub Actions**
3. Push to `main`

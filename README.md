# erenege.com

Personal website — research hub for Eren Ege Çelik.

Static Next.js site with bilingual UI (TR/EN), modern dark theme, and
content-driven sections for whitepapers, blog posts, and live trade
data from a Polymarket market-making bot.

## Sections

- **Home** — hero, recent research, live PnL preview, projects
- **Research** — ongoing threads, planned publications, interests
- **Whitepapers** — markdown-driven, statically prerendered
- **Blog** — shorter notes, same content pipeline
- **Trades** — live(-ish) feed of paper PnL from the bot
- **CV** — education, experience, skills, certificates, languages

## Stack

- Next.js 15 (App Router) + TypeScript
- CSS Modules + custom design tokens
- `gray-matter` + `react-markdown` + `remark-gfm` for content
- Static site generation throughout (no backend)
- Hosted on Vercel, auto-deploy from `main`

## Adding content

**A new whitepaper:**
```
content/whitepapers/your-slug.md
```
With frontmatter (see `polymarket-5min-microstructure.md` for the
template). Push to `main` → Vercel rebuilds → live.

**A new blog post:**
```
content/blog/your-slug.md
```
Same pattern, simpler frontmatter.

**Updating trade data:**
The bot pushes to `public/data/trades.json` on a schedule. See
`docs/trades-pipeline.md` for the contract and producer options.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Contact

- **Email**: erenegecelik62@gmail.com
- **GitHub**: [ErenEgeCelik](https://github.com/ErenEgeCelik)

Built with Next.js, deployed on Vercel.

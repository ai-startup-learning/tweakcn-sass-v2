<div align="center">
  <h1>SaaS Kit v3</h1>
  <p>A production-ready Next.js SaaS starter with a visual theme editor for Tailwind CSS &amp; shadcn/ui</p>
</div>

<br />

**SaaS Kit v3** is a powerful Visual Theme Editor for Tailwind CSS & shadcn/ui components. It comes with beautiful theme presets to get started, while offering advanced customisation for each aspect of your UI.

Built on top of [tweakcn](https://github.com/jnsahaj/tweakcn) (Apache 2.0), extended with SaaS features including authentication, billing, AI theme generation, and more.

## Features

- Visual theme editor for shadcn/ui
- AI-powered theme generation from images or descriptions
- Community theme gallery
- Subscription billing with Polar
- Authentication with Better Auth (GitHub + Google OAuth)
- PostgreSQL database with Drizzle ORM
- Rate limiting with Upstash/Vercel KV
- Figma integration

## Getting Started

See [SETUP.md](SETUP.md) for full setup instructions including database, authentication, billing, and deployment.

### Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your credentials in .env.local

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: Better Auth
- **Payments**: Polar
- **AI**: Google Gemini + Groq
- **Rate Limiting**: Upstash / Vercel KV

## Attribution

This project is based on [tweakcn](https://github.com/jnsahaj/tweakcn) by Sahaj Jain, licensed under the Apache License 2.0.
See [NOTICE](NOTICE) for full attribution details.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

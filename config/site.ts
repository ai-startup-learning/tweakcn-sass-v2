/**
 * Site-wide brand and product configuration.
 *
 * ─────────────────────────────────────────────────────────────────
 *  CLONING THIS REPO FOR A NEW PRODUCT?
 *  Update the values below. Everything else will follow automatically.
 *  Also update:
 *    - .env.local  (secrets, BASE_URL, EMAIL_FROM, etc.)
 *    - public/live-preview.js  ALLOWED_ORIGINS array
 *    - public/live-preview.min.js  same array (minified copy)
 * ─────────────────────────────────────────────────────────────────
 */
export const siteConfig = {
  /** Short product name — used in titles, emails, UI copy */
  name: "SaaS Kit",

  /** Canonical production URL — no trailing slash */
  url: "https://sass-kit-v3.com",

  /** Default OpenGraph image (absolute URL) */
  ogImage: "https://sass-kit-v3.com/og-image.v050725.png",

  /** One-line tagline */
  tagline: "Beautiful themes for shadcn/ui",

  /** Full product description used in metadata */
  description:
    "Customize theme for shadcn/ui with SaaS Kit's interactive editor. Supports Tailwind CSS v4, Shadcn UI, and custom styles. Modify properties, preview changes, and get the code in real time.",

  /** Author / team name shown in metadata */
  creator: "SaaS Kit v3 Team",

  /** Contact / support email */
  email: "hello@sass-kit-v3.com",

  /** External social / community links */
  links: {
    github: "https://github.com/sass-kit-v3/saaskit-v3",
    discord: "https://discord.gg/Phs4u2NM3n",
    twitter: "https://x.com/iamsahaj_xyz",
    contact: "https://x.com/messages/compose?recipient_id=1426676644152889345",
  },

  /** Paid tier display name */
  proTier: "Pro",
} as const;

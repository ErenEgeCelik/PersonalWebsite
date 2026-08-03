/**
 * Single source of truth for site-level identity.
 * When the custom domain is attached, change SITE_URL here only —
 * layout metadata, sitemap, robots and the RSS feed all read from it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://personal-website-new-phi-rose.vercel.app";

export const SITE_TITLE = "Eren Ege Çelik";

export const SITE_DESCRIPTION =
  "Physics undergraduate at METU. I build quantitative trading systems for prediction markets, and write up what I find — including the results that make me look worse.";

export const SITE_EMAIL = "erenege3500@gmail.com";

export const SITE_GITHUB = "https://github.com/ErenEgeCelik";

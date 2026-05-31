export const siteConfig = {
  name: "LaunchLens",
  title: "LaunchLens — Validate Startup Ideas with AI",
  description:
    "LaunchLens analyzes risks, competitors, market assumptions, and MVP paths — so founders move forward with clarity before they build.",
  tagline: "Validate your startup idea before you build",
  keywords: [
    "startup validation",
    "AI startup analysis",
    "idea validation",
    "founder tools",
    "MVP planning",
    "competitor analysis",
    "market research",
    "startup ideas",
  ],
} as const;

export function getSiteUrl(): string {
  const url = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

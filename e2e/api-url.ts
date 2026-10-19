// The one place the API's address is decided. playwright.config.ts starts the
// server here and the reseed fixture talks to it here, so the two cannot drift.
// Port 5055, not 5000, keeps a running `pnpm dev` out of the way; the host
// matches the app's so the refresh cookie is same-site.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5055";

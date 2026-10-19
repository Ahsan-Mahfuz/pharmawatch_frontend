export const NAV = [
  { href: "/", label: "Today", idx: "01", badge: "none" },
  { href: "/batches", label: "Batches", idx: "02", badge: "none" },
  { href: "/counter", label: "Counter sale", idx: "03", badge: "cart" },
  { href: "/medicines", label: "Medicines", idx: "04", badge: "none" },
  { href: "/suppliers", label: "Suppliers", idx: "05", badge: "none" },
  { href: "/approvals", label: "Approvals", idx: "06", badge: "pending" },
  { href: "/reports", label: "Reports", idx: "07", badge: "none" },
  { href: "/risk-model", label: "Risk model", idx: "08", badge: "none" },
] as const;

export type NavItem = (typeof NAV)[number];

export function isCurrent(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

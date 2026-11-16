"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  type AdminNavItem,
  isNavItemActive,
  navGroupsFor,
} from "@/config/admin-navigation";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types";

/**
 * Grouped, role-filtered navigation: a role only ever sees the pages the
 * service will actually serve it.
 */
export function AdminNav({
  role,
  onNavigate,
}: {
  role: AdminRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Console navigation" className="flex flex-col gap-6">
      {navGroupsFor(role).map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-1">
          {group.label ? (
            <p className="px-3 pb-1 text-[10.5px] font-semibold tracking-widest text-muted-foreground uppercase">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={isNavItemActive(item, pathname)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

function NavItem({
  item: { title, href, icon: Icon },
  active,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active
          ? "bg-primary font-semibold text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="size-[17px] shrink-0" strokeWidth={active ? 2.2 : 1.9} />
      <span>{title}</span>
    </Link>
  );
}

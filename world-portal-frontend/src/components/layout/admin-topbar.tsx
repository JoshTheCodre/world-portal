"use client";

import * as React from "react";
import Link from "next/link";

import { ArrowUpRight, LogOut, Menu, Search, Settings, X } from "lucide-react";

import { AdminUserCard } from "@/components/admin/admin-user-card";
import { CommandPalette } from "@/components/admin/command-palette";
import { UserAvatar } from "@/components/admin/user-avatar";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AdminNav } from "@/components/layout/admin-nav";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { commandPalette } from "@/content/admin";
import { useLogout } from "@/features/auth/api/use-logout";
import type { AdminUser } from "@/types";

export function AdminTopbar({ user }: { user: AdminUser }) {
  const [navOpen, setNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const logout = useLogout();

  // ⌘K / Ctrl+K opens search from anywhere in the console.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Phones and tablets: the navigation lives in a drawer. */}
        <div className="flex items-center gap-3 lg:hidden">
          <Drawer open={navOpen} onOpenChange={setNavOpen} direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Open navigation">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-background text-foreground">
              <DrawerTitle className="sr-only">Console navigation</DrawerTitle>
              <div className="flex items-center justify-between border-b border-border/60 px-5 pt-5 pb-4">
                <Logo href="/admin" tone="dark" />
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close navigation"
                    className="text-foreground hover:bg-muted/60"
                  >
                    <X />
                  </Button>
                </DrawerClose>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pt-6">
                <AdminNav role={user.role} onNavigate={() => setNavOpen(false)} />
              </div>
              {/* Who is signed in, and a way out — the sidebar's footer is hidden here. */}
              <div className="border-t border-border/60 p-5">
                <AdminUserCard user={user}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Sign out"
                    isLoading={logout.isPending}
                    onClick={() => logout.mutate()}
                  >
                    <LogOut />
                  </Button>
                </AdminUserCard>
              </div>
            </DrawerContent>
          </Drawer>
          <Logo href="/admin" tone="dark" className="lg:hidden" />
        </div>

        {/* Search: a full field from small screens up, an icon on phones. */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-border/70 bg-muted/50 px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:flex"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="flex-1 text-left">{commandPalette.trigger}</span>
          <kbd className="hidden items-center rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] md:inline-flex">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={commandPalette.label}
            className="sm:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
          </Button>

          <ThemeToggle />

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground sm:inline-flex"
          >
            <Link href="/">
              View site
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="rounded-full ring-offset-2 transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <UserAvatar user={user} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-[13px] font-semibold text-foreground">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CommandPalette role={user.role} open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}

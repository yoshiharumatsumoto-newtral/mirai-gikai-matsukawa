"use client";

import { Menu } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { routes } from "@/lib/routes";
import { RubyToggle } from "@/lib/rubyful";

const MENU_LINKS: { label: string; href: string }[] = [
  { label: "テーマ一覧", href: routes.home() },
  { label: "はじめての方へ", href: routes.guide() },
  { label: "インタビューごとの参加状況", href: routes.participation() },
];

export function HamburgerMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="end">
        <nav aria-label="メニュー" className="mb-3 flex flex-col gap-1">
          {MENU_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href as Route}
              className="rounded-md px-2 py-2 text-sm font-bold text-mirai-text hover:bg-mirai-surface"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <RubyToggle />
      </PopoverContent>
    </Popover>
  );
}

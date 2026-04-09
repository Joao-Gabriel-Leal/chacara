"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-white/15 bg-white/5"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunMedium className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}

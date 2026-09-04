import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers — import Link / useRouter / redirect from here, never from "next/*".
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

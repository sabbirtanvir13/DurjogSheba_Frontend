"use client";

import { ArrowUpRight, Heart, Menu, ShieldPlus, Siren, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2";

export interface NavItem {
  label: string;
  href: string;
}

export const primaryNavItems: NavItem[] = [
  { label: "Find Shelters", href: "/shelters" },
  { label: "Relief Needs", href: "/relief-needs" },
  { label: "Rescue Requests", href: "/rescue-requests" },
  { label: "About Us", href: "/about" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((previous) => !previous);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white",
        "border-b border-slate-200/80",
        "transition-shadow duration-300",
        isScrolled && "shadow-[0_4px_20px_-10px_rgba(15,23,42,0.22)]",
      )}
    >
      {/* Emergency Announcement */}
      <div className="border-b border-red-100 bg-[#FFF8F7]">
        <div className="mx-auto flex min-h-10 max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2 sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              <Siren className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            </span>

            <p className="text-xs text-slate-600 sm:text-[13px]">
              <span className="font-semibold text-slate-900">
                Emergency assistance available.
              </span>{" "}
              We are here to help communities in need.
            </p>
          </div>

          <Link
            href="/rescue-requests"
            className={cn(
              "group inline-flex items-center gap-1.5",
              "rounded-md px-2.5 py-1",
              "text-xs font-semibold text-red-700",
              "transition-colors hover:bg-red-100",
              focusRing,
            )}
          >
            Request Rescue
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="DurjogSheba home"
          className={cn(
            "group flex shrink-0 items-center gap-3 rounded-lg",
            focusRing,
          )}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm transition-colors group-hover:bg-green-800">
            <ShieldPlus className="h-6 w-6" aria-hidden="true" />
          </span>

          <span className="flex flex-col gap-0.5">
            <span className="text-[17px] font-bold leading-tight tracking-tight text-slate-900">
              DurjogSheba
            </span>

            <span className="font-[family-name:var(--font-bengali)] text-[11px] font-semibold tracking-wide text-green-700">
              দুর্যোগ সেবা
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden h-full items-center gap-1 xl:flex"
        >
          {primaryNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center px-3.5",
                  "text-[13px] font-medium",
                  "transition-colors duration-200",
                  "after:absolute after:bottom-[17px] after:left-3.5 after:right-3.5",
                  "after:h-[2px] after:rounded-full",
                  "after:transition-transform after:duration-200",

                  isActive
                    ? "text-green-700 after:scale-x-100 after:bg-green-700"
                    : "text-slate-600 after:scale-x-0 after:bg-green-700 hover:text-green-700 hover:after:scale-x-100",

                  focusRing,
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/donate"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 rounded-lg border-slate-200 px-3.5",
                "text-[13px] font-semibold text-slate-700",
                "transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-800",
                focusRing,
              )}
            >
              <Heart
                className="mr-1.5 h-4 w-4 text-green-700"
                aria-hidden="true"
              />
              Donate Now
            </Link>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-9 rounded-lg px-3 text-[13px] font-semibold",
                "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                focusRing,
              )}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-9 rounded-lg bg-green-700 px-4",
                "text-[13px] font-semibold text-white",
                "shadow-sm transition-all hover:bg-green-800 hover:shadow",
                focusRing,
              )}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center",
              "rounded-lg border border-slate-200 text-slate-700",
              "transition-colors hover:bg-slate-50 hover:text-green-700",
              "xl:hidden",
              focusRing,
            )}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu
        isOpen={isMenuOpen}
        pathname={pathname}
        onNavigate={closeMenu}
      />
    </header>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  onNavigate: () => void;
}

export function MobileMenu({ isOpen, pathname, onNavigate }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="border-b border-slate-200 bg-white px-4 py-6 shadow-lg xl:hidden"
    >
      <nav className="flex flex-col space-y-2">
        {primaryNavItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                focusRing,
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
        <Link
          href="/donate"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 justify-center rounded-lg border-slate-200 text-sm font-semibold text-slate-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800",
            focusRing,
          )}
        >
          <Heart className="mr-1.5 h-4 w-4 text-green-700" aria-hidden="true" />
          Donate Now
        </Link>

        <Link
          href="/login"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-10 justify-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            focusRing,
          )}
        >
          Login
        </Link>

        <Link
          href="/register"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ size: "sm" }),
            "h-10 justify-center rounded-lg bg-green-700 text-sm font-semibold text-white shadow-sm hover:bg-green-800",
            focusRing,
          )}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

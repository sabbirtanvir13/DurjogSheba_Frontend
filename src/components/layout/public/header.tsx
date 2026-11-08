"use client";

import {
  ArrowUpRight,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Siren,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetMe, useLogout } from "@/hooks";
import { toast } from "react-toastify";

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

export function getDashboardHref(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "VOLUNTEER":
      return "/volunteer";
    case "DONOR":
      return "/donor";
    default:
      return "/dashboard";
  }
}



export function Header() {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: user, isLoading: userLoading } = useGetMe();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onError: (err: any) => {
        toast.error(err?.data?.message || err?.message || "Logout failed");
      },
    });
  };

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isMenuOpen && !isProfileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, isProfileOpen]);

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
          <Image
            src="/Logo.png"
            alt="DurjogSheba Logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
            priority
          />

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

            {!userLoading && user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white py-1.5 pl-2 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50",
                    isProfileOpen &&
                      "border-green-600 bg-green-50/50 ring-2 ring-green-600/10",
                    focusRing,
                  )}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-700 text-xs font-bold text-white shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="max-w-[120px] truncate text-[13px]">
                    {user.name || "My Account"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-400 transition-transform duration-200",
                      isProfileOpen && "rotate-180 text-green-700",
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all animate-in fade-in-0 zoom-in-95 z-50">
                    {/* User Info Header */}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                          {user.role || "MEMBER"}
                        </span>
                      </div>
                    </div>

                    <div className="my-1.5 h-px bg-slate-100" />

                    {/* Menu Items */}
                    <div className="space-y-0.5">
                      <Link
                        href={getDashboardHref(user.role)}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                      >
                        <LayoutDashboard className="h-4 w-4 text-green-700" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href={`${getDashboardHref(user.role)}/profile`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                      >
                        <User className="h-4 w-4 text-slate-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href={`${getDashboardHref(user.role)}/settings`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                      >
                        <Settings className="h-4 w-4 text-slate-500" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="my-1.5 h-px bg-slate-100" />

                    {/* Logout Option */}
                    <button
                      type="button"
                      disabled={logoutPending}
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span>{logoutPending ? "Logging out..." : "Log Out"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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
        user={user}
        userLoading={userLoading}
        onLogout={handleLogout}
      />
    </header>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  onNavigate: () => void;
  user?: any;
  userLoading?: boolean;
  onLogout?: () => void;
}

export function MobileMenu({
  isOpen,
  pathname,
  onNavigate,
  user,
  userLoading,
  onLogout,
}: MobileMenuProps) {
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

        {!userLoading && user ? (
          <div className="flex flex-col gap-2">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 text-sm font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user.email}
                </p>
                <span className="mt-1 inline-flex items-center rounded-md bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-800">
                  {user.role || "MEMBER"}
                </span>
              </div>
            </div>

            {/* Links */}
            <Link
              href={getDashboardHref(user.role)}
              onClick={onNavigate}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-10 justify-start gap-2.5 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-800",
                focusRing,
              )}
            >
              <LayoutDashboard className="h-4 w-4 text-green-700" />
              Dashboard
            </Link>

            <Link
              href={`${getDashboardHref(user.role)}/profile`}
              onClick={onNavigate}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-10 justify-start gap-2.5 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-800",
                focusRing,
              )}
            >
              <User className="h-4 w-4 text-slate-500" />
              My Profile
            </Link>

            <Link
              href={`${getDashboardHref(user.role)}/settings`}
              onClick={onNavigate}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-10 justify-start gap-2.5 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-800",
                focusRing,
              )}
            >
              <Settings className="h-4 w-4 text-slate-500" />
              Settings
            </Link>

            <div className="my-1 h-px bg-slate-100" />

            <button
              type="button"
              onClick={() => {
                onNavigate();
                if (onLogout) onLogout();
              }}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-10 justify-center gap-2 rounded-xl border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50",
                focusRing,
              )}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Home,
  Stethoscope,
  Gavel,
  Wind,
  Warehouse,
  Building2,
  Activity,
  ShieldCheck,
  LogOut,
  Plus,
  PhoneIncoming,
  PhoneOutgoing,
  Route,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { Button, Container, Logo } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { EASE, springPhysics } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Header — morphing mega menu. One physical panel slides between triggers
   (transform-only x morph); its content exits toward where you came from and
   enters from where you're heading, blur-to-sharp. A hover pill morphs along
   the top-level items via layoutId.
   ──────────────────────────────────────────────────────────────────────────── */

type NavLink = { href: string; label: string; desc: string; icon: LucideIcon };

const productLinks: NavLink[] = [
  {
    href: "/inbound-calling",
    label: "Inbound Calling",
    desc: "24/7 answering, intake & routing",
    icon: PhoneIncoming,
  },
  {
    href: "/outbound-calling",
    label: "Outbound Campaigns",
    desc: "Follow-ups, reactivation & reminders",
    icon: PhoneOutgoing,
  },
  {
    href: "/how-it-works",
    label: "How It Works",
    desc: "From first ring to CRM sync",
    icon: Route,
  },
  {
    href: "/integrations",
    label: "Integrations",
    desc: "CRM, calendars & phone systems",
    icon: Plug,
  },
];

const industries: NavLink[] = [
  {
    href: "/industries/real-estate",
    label: "Real Estate",
    desc: "Agent & brokerage lead qualification",
    icon: Home,
  },
  {
    href: "/industries/dentists",
    label: "Dentists",
    desc: "Booking, recall & emergency triage",
    icon: Stethoscope,
  },
  {
    href: "/industries/injury-lawyers",
    label: "Injury Lawyers",
    desc: "New-case intake & urgency triage",
    icon: Gavel,
  },
  {
    href: "/industries/hvac",
    label: "HVAC",
    desc: "Emergency dispatch & seasonal surges",
    icon: Wind,
  },
  {
    href: "/industries/roofing",
    label: "Roofing",
    desc: "Storm surges & inspection scheduling",
    icon: Warehouse,
  },
  {
    href: "/industries/property-management",
    label: "Property Management",
    desc: "Tenant maintenance & leasing calls",
    icon: Building2,
  },
  {
    href: "/industries/chiropractors",
    label: "Chiropractors",
    desc: "New patient & recurring care booking",
    icon: Activity,
  },
  {
    href: "/industries/insurance",
    label: "Insurance",
    desc: "Quotes, claims intake & policy service",
    icon: ShieldCheck,
  },
];

const MENUS = [
  { id: "industries", label: "Industries", activePrefixes: ["/industries"] },
] as const;
type MenuId = (typeof MENUS)[number]["id"];

const PANEL_W = 620;
/* Per-menu natural heights — the panel morphs between them on the same
   spring that slides it, so no menu's content ever clips. */
const PANEL_HEIGHTS: Record<MenuId, number> = { industries: 384 };

const flatLinks: { href: string; label: string }[] = [
  { href: "/inbound-calling", label: "Inbound" },
  { href: "/outbound-calling", label: "Outbound" },
  { href: "/how-it-works", label: "How It Works" },
];

const flatLinksAfterIndustries: { href: string; label: string }[] = [
  { href: "/integrations", label: "Integrations" },
];

/* ── Panel item — icon + label + description row ───────────────────────────── */

function PanelItem({ link, compact = false }: { link: NavLink; compact?: boolean }) {
  return (
    <Link
      href={link.href}
      className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent-tint/60"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent transition-colors group-hover/item:border-accent/30">
        <link.icon aria-hidden className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-semibold text-ink">
          {link.label}
        </span>
        <span className={cn("block leading-snug text-ink-light", compact ? "text-[12px]" : "text-[12.5px]")}>
          {link.desc}
        </span>
      </span>
    </Link>
  );
}

/* ── Menu panels ───────────────────────────────────────────────────────────── */

function IndustriesPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-2 gap-1">
        {industries.map((l) => (
          <PanelItem key={l.href} link={l} compact />
        ))}
      </div>
      <div className="mt-auto border-t border-line px-3 pt-2.5">
        <Link
          href="/industries"
          className="text-[13px] font-semibold text-accent transition-colors hover:text-accent-deep"
        >
          All industries →
        </Link>
      </div>
    </div>
  );
}

/* ── Header ────────────────────────────────────────────────────────────────── */

export function Header() {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const reduce = useReducedMotion() ?? false;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mega menu state
  const [open, setOpen] = useState<MenuId | null>(null);
  const [panelX, setPanelX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<MenuId, HTMLButtonElement | null>>({
    industries: null,
  });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pinnedOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
    setProfileOpen(false);
    pinnedOpen.current = false;
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape + outside click close the mega menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        pinnedOpen.current = false;
        setOpen(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        pinnedOpen.current = false;
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openMenu = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const trigger = triggerRefs.current[id];
    const nav = navRef.current;
    if (trigger && nav) {
      const t = trigger.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      setPanelX(t.left + t.width / 2 - n.left - PANEL_W / 2);
    }
    setOpen((prev) => {
      if (prev && prev !== id) {
        const prevIdx = MENUS.findIndex((m) => m.id === prev);
        const nextIdx = MENUS.findIndex((m) => m.id === id);
        setDirection(nextIdx > prevIdx ? 1 : -1);
      }
      return id;
    });
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (pinnedOpen.current) return;
    closeTimer.current = setTimeout(() => setOpen(null), 130);
  };

  const forceClose = () => {
    pinnedOpen.current = false;
    scheduleClose();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const morph = reduce ? { duration: 0 } : springPhysics;

  /* Directional content swap — exits toward where you came from */
  const contentVariants = {
    enter: (d: number) =>
      reduce
        ? { opacity: 0 }
        : { opacity: 0, x: d * 24, filter: "blur(6px)" },
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) =>
      reduce
        ? { opacity: 0 }
        : { opacity: 0, x: d * -24, filter: "blur(6px)" },
  };

  const hoverPill = (id: string) =>
    hovered === id && (
      <motion.span
        layoutId="nav-hover-pill"
        transition={morph}
        style={{ borderRadius: 9999 }}
        className="absolute inset-0 bg-ink/[0.05]"
      />
    );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || mobileOpen
          ? "border-b border-line bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="SkipDial home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav
          ref={navRef}
          aria-label="Main"
          className="relative hidden items-center gap-1 lg:flex"
          onMouseLeave={() => {
            setHovered(null);
            scheduleClose();
          }}
        >
          {flatLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => {
                setHovered(link.href);
                forceClose();
              }}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                isActive(link.href) ? "text-ink" : "text-ink-light hover:text-ink"
              )}
            >
              {hoverPill(link.href)}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}

          {MENUS.map((menu) => {
            const expanded = open === menu.id;
            const active = menu.activePrefixes.some((p) => pathname.startsWith(p));
            return (
              <button
                key={menu.id}
                ref={(el) => {
                  triggerRefs.current[menu.id] = el;
                }}
                type="button"
                aria-expanded={expanded}
                aria-haspopup="true"
                aria-controls="skipdial-mega-panel"
                onMouseEnter={() => {
                  pinnedOpen.current = false;
                  setHovered(menu.id);
                  openMenu(menu.id);
                }}
                onClick={() => {
                  pinnedOpen.current = true;
                  openMenu(menu.id);
                }}
                className={cn(
                  "relative flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                  active || expanded ? "text-ink" : "text-ink-light hover:text-ink"
                )}
              >
                {hoverPill(menu.id)}
                <span className="relative z-10 flex items-center gap-1">
                  {menu.label}
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      expanded && "rotate-180"
                    )}
                  />
                </span>
              </button>
            );
          })}

          {flatLinksAfterIndustries.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => {
                setHovered(link.href);
                forceClose();
              }}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
                isActive(link.href) ? "text-ink" : "text-ink-light hover:text-ink"
              )}
            >
              {hoverPill(link.href)}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}

          <Link
            href="/blog"
            onMouseEnter={() => {
              setHovered("blog");
              scheduleClose();
            }}
            className={cn(
              "relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors",
              isActive("/blog") ? "text-ink" : "text-ink-light hover:text-ink"
            )}
          >
            {hoverPill("blog")}
            <span className="relative z-10">Blog</span>
          </Link>

          {/* The one sliding panel */}
          <AnimatePresence>
            {open && (
              <div
                className="absolute left-0 top-full pt-3"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                }}
                onMouseLeave={scheduleClose}
              >
                <motion.div
                  id="skipdial-mega-panel"
                  initial={
                    reduce
                      ? { opacity: 0, x: panelX, height: PANEL_HEIGHTS[open] }
                      : { opacity: 0, y: 10, scale: 0.98, x: panelX, filter: "blur(6px)", height: PANEL_HEIGHTS[open] }
                  }
                  animate={
                    reduce
                      ? { opacity: 1, x: panelX, height: PANEL_HEIGHTS[open] }
                      : { opacity: 1, y: 0, scale: 1, x: panelX, filter: "blur(0px)", height: PANEL_HEIGHTS[open] }
                  }
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: 8, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.15 } }
                  }
                  transition={{ ...morph, filter: { duration: 0.2, ease: EASE } }}
                  style={{ width: PANEL_W }}
                  className="overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-lift"
                >
                  <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                      key={open}
                      custom={direction}
                      variants={contentVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ ...morph, filter: { duration: 0.2, ease: EASE } }}
                      className="h-full"
                    >
                      <IndustriesPanel />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/request-a-free-demo" size="sm" arrow>
            Free Demo
          </Button>

          {sessionStatus === "authenticated" && session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Account menu"
                aria-expanded={profileOpen}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent-tint text-[13px] font-bold text-accent transition-shadow hover:shadow-card"
              >
                {(session.user.name || session.user.email || "?")
                  .charAt(0)
                  .toUpperCase()}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 4, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift"
                  >
                    <p className="truncate px-3 py-2 text-[12px] text-ink-light">
                      {session.user.email}
                    </p>
                    <Link
                      href="/blog/create"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-ink hover:bg-surface-alt"
                    >
                      <Plus aria-hidden className="h-3.5 w-3.5" /> New blog post
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-ink hover:bg-surface-alt"
                    >
                      <LogOut aria-hidden className="h-3.5 w-3.5" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-light transition-colors hover:text-ink"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink lg:hidden"
        >
          {mobileOpen ? (
            <X aria-hidden className="h-5 w-5" />
          ) : (
            <Menu aria-hidden className="h-5 w-5" />
          )}
        </button>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-line bg-bg lg:hidden"
          >
            <Container className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-5">
              <p className="px-3 text-[12px] font-semibold text-ink-faint">
                Product
              </p>
              {productLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium",
                    isActive(l.href) ? "bg-accent-tint/60 text-ink" : "text-ink"
                  )}
                >
                  <l.icon aria-hidden className="h-4 w-4 text-accent" />
                  {l.label}
                </Link>
              ))}

              <p className="mt-2 px-3 text-[12px] font-semibold text-ink-faint">
                Industries
              </p>
              {industries.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink"
                >
                  <l.icon aria-hidden className="h-4 w-4 text-accent" />
                  {l.label}
                </Link>
              ))}

              <Link
                href="/blog"
                className={cn(
                  "mt-2 rounded-xl px-3 py-3 text-[16px] font-semibold",
                  isActive("/blog") ? "bg-accent-tint/60 text-ink" : "text-ink"
                )}
              >
                Blog
              </Link>

              <div className="mt-4 flex flex-col gap-2.5">
                <Button href="/request-a-free-demo" size="lg" arrow className="w-full">
                  Free Demo
                </Button>
                <Button
                  href="mailto:info@skipdial.ai"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Contact us
                </Button>
                {sessionStatus === "authenticated" && session?.user ? (
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-line text-[14px] font-medium text-ink"
                  >
                    <LogOut aria-hidden className="h-3.5 w-3.5" /> Sign out
                  </button>
                ) : (
                  <Button href="/login" variant="outline" size="lg" className="w-full">
                    Login
                  </Button>
                )}
              </div>

              <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-[14px] text-ink-light">
                <a href="tel:+14808681102" className="flex items-center gap-2.5">
                  <Phone aria-hidden className="h-4 w-4 text-accent" /> (480) 868-1102
                </a>
                <a href="mailto:info@skipdial.ai" className="flex items-center gap-2.5">
                  <Mail aria-hidden className="h-4 w-4 text-accent" /> info@skipdial.ai
                </a>
                <p className="flex items-start gap-2.5">
                  <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  1801 E. Camelback Rd, Suite 201, Phoenix, AZ 85016
                </p>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

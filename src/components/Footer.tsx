import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container, Logo, Button } from "@/components/ui/primitives";

const productLinks = [
  { href: "/inbound-calling", label: "Inbound Calling" },
  { href: "/outbound-calling", label: "Outbound Calling" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/integrations", label: "Integrations" },
  { href: "/blog", label: "Blog" },
];

const industryLinks = [
  { href: "/industries", label: "All Industries" },
  { href: "/industries/home-services", label: "Home Services" },
  {
    href: "/industries/real-estate-property-management",
    label: "Real Estate & Property Mgmt",
  },
  { href: "/industries/professional-offices", label: "Professional Offices" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/skipdialai",
    path: "M13.5 9H15V6.5h-2c-1.93 0-3.5 1.57-3.5 3.5v1.5H7.5V14h2v6.5H12V14h2.25l.5-2.5H12v-1.25c0-.69.56-1.25 1.5-1.25z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/skipdialai",
    path: "M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zm0 5.75A2.25 2.25 0 1 1 12 9.75a2.25 2.25 0 0 1 0 4.5zM16.9 8.35a.85.85 0 1 1-1.7 0 .85.85 0 0 1 1.7 0zM12 5.5c-1.77 0-1.99.01-2.68.04-.7.03-1.17.14-1.59.3-.43.17-.8.4-1.16.76-.36.36-.59.73-.76 1.16-.16.42-.27.9-.3 1.59C5.5 10.01 5.5 10.23 5.5 12s0 1.99.04 2.68c.03.7.14 1.17.3 1.59.17.43.4.8.76 1.16.36.36.73.59 1.16.76.42.16.9.27 1.59.3.69.03.91.04 2.68.04s1.99-.01 2.68-.04c.7-.03 1.17-.14 1.59-.3.43-.17.8-.4 1.16-.76.36-.36.59-.73.76-1.16.16-.42.27-.9.3-1.59.03-.69.04-.91.04-2.68s-.01-1.99-.04-2.68c-.03-.7-.14-1.17-.3-1.59a3.09 3.09 0 0 0-.76-1.16 3.09 3.09 0 0 0-1.16-.76c-.42-.16-.9-.27-1.59-.3C13.99 5.5 13.77 5.5 12 5.5zm0 1.17c1.74 0 1.95.01 2.63.04.63.03.98.13 1.21.22.3.12.52.26.75.49.23.23.37.44.49.75.09.23.19.57.22 1.21.03.68.04.89.04 2.63s-.01 1.95-.04 2.63c-.03.63-.13.98-.22 1.21-.12.3-.26.52-.49.75a2.02 2.02 0 0 1-.75.49c-.23.09-.57.19-1.21.22-.68.03-.89.04-2.63.04s-1.95-.01-2.63-.04c-.63-.03-.98-.13-1.21-.22a2.02 2.02 0 0 1-.75-.49 2.02 2.02 0 0 1-.49-.75c-.09-.23-.19-.57-.22-1.21-.03-.68-.04-.89-.04-2.63s.01-1.95.04-2.63c.03-.63.13-.98.22-1.21.12-.3.26-.52.49-.75.23-.23.44-.37.75-.49.23-.09.57-.19 1.21-.22.68-.03.89-.04 2.63-.04z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/skipdial",
    path: "M8.75 10v7H6.5v-7h2.25zM7.63 6.5a1.31 1.31 0 1 1 0 2.63 1.31 1.31 0 0 1 0-2.63zM17.5 13.13V17h-2.25v-3.5c0-.9-.35-1.5-1.19-1.5-.65 0-1 .44-1.17.86-.06.15-.08.36-.08.57V17h-2.25s.03-6.36 0-7h2.25v1c.3-.46.83-1.13 2.02-1.13 1.48 0 2.67.97 2.67 3.26z",
  },
];

export function Footer() {
  return (
    <footer id="contact" className="band-wash-dark relative overflow-hidden text-ink-inverse">
      {/* Top CTA row */}
      <Container className="pb-14 pt-20">
        <div className="flex flex-col gap-10 border-b border-band-dark-line pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <Link href="/" aria-label="SkipDial home" className="inline-block">
              <Logo variant="white" />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-inverse/65">
              AI voice agents that answer your phone, qualify your leads, and
              book your calendar, 24/7.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/request-a-free-demo" variant="inverse" size="lg" arrow>
              Get a Free Demo
            </Button>
            <Button
              href="mailto:info@skipdial.ai"
              variant="ghost"
              size="lg"
              className="text-ink-inverse/70 hover:text-ink-inverse"
            >
              Contact us
            </Button>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 pt-14 md:grid-cols-4">
          <div>
            <p className="text-[12px] font-semibold text-ink-inverse/45">
              Product
            </p>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-ink-inverse/70 transition-colors hover:text-ink-inverse"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-semibold text-ink-inverse/45">
              Industries
            </p>
            <ul className="mt-4 space-y-2.5">
              {industryLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-ink-inverse/70 transition-colors hover:text-ink-inverse"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <p className="text-[12px] font-semibold text-ink-inverse/45">
              Contact Us
            </p>
            <ul className="mt-4 space-y-3 text-[14px] text-ink-inverse/70">
              <li>
                <a
                  href="tel:+14808681102"
                  className="flex items-center gap-2.5 transition-colors hover:text-ink-inverse"
                >
                  <Phone aria-hidden className="h-4 w-4 text-accent-soft" />
                  (480) 868-1102
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@skipdial.ai"
                  className="flex items-center gap-2.5 transition-colors hover:text-ink-inverse"
                >
                  <Mail aria-hidden className="h-4 w-4 text-accent-soft" />
                  info@skipdial.ai
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent-soft" />
                1801 E. Camelback Rd, Suite 201, Phoenix, AZ 85016
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-band-dark-line text-ink-inverse/60 transition-colors hover:border-accent-soft/50 hover:text-ink-inverse"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Legal strip */}
      <div className="border-t border-band-dark-line">
        <Container className="flex flex-col items-start gap-2 py-6 text-[13px] text-ink-inverse/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 All Rights Reserved · SkipDial.ai</p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-ink-inverse"
            >
              Privacy Policy
            </Link>
            <span>Powered by REV77 Digital Marketing</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}

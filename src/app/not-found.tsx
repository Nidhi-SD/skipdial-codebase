import { PhoneMissed } from "lucide-react";
import { Container, Button } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="hero-wash relative flex min-h-[70vh] items-center overflow-hidden pt-16">
      <div
        aria-hidden
        className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(55%_55%_at_50%_45%,black,transparent)]"
      />
      <Container className="relative py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-accent shadow-card">
          <PhoneMissed aria-hidden className="h-6 w-6" />
        </span>
        <p className="mt-6 text-[13px] font-semibold text-accent">
          404 · Line not in service
        </p>
        <h1 className="mt-4 text-display-lg">
          This page missed our call.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-light">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          route you somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" size="lg" arrow>
            Back to Home
          </Button>
          <Button href="/request-a-free-demo" variant="outline" size="lg">
            Get a Free Demo
          </Button>
        </div>
      </Container>
    </section>
  );
}

import { NextResponse } from "next/server";

const VALID_INDUSTRIES = [
  "real-estate",
  "dentists",
  "injury-lawyers",
  "hvac",
  "roofing",
  "property-management",
  "chiropractors",
  "insurance",
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
};

/** Normalizes a phone number to E.164, assuming a US number (+1) when no
 *  country code is present — the lead form has no country selector yet. */
function toE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/[^\d+]/g, "");
    return /^\+\d{8,15}$/.test(digits) ? digits : null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

/** Demo-call intake — places a live outbound call via Vapi using the
 *  single multi-industry demo assistant. The caller's industry/company/
 *  language selections are passed as call-time variables so the assistant
 *  picks the right persona block and introduces itself correctly. */
export async function POST(request: Request) {
  let body: {
    name?: string;
    company?: string;
    phone?: string;
    email?: string;
    industry?: string;
    language?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const company = (body.company ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const industry = (body.industry ?? "").trim();
  const languageCode = (body.language ?? "en").trim();

  const e164Phone = toE164(phone);

  if (
    !name ||
    !company ||
    !e164Phone ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    !VALID_INDUSTRIES.includes(industry)
  ) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 422 });
  }

  const apiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
  const assistantId = process.env.VAPI_DEMO_ASSISTANT_ID;

  if (!apiKey || !phoneNumberId || !assistantId) {
    console.error("[demo-call] missing Vapi env vars");
    return NextResponse.json({ error: "Demo calling is not configured" }, { status: 500 });
  }

  const language = LANGUAGE_NAMES[languageCode] ?? "English";

  try {
    const vapiRes = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        assistantId,
        phoneNumberId,
        customer: { number: e164Phone, name },
        assistantOverrides: {
          firstMessage: `Thanks for calling ${company}, this is James. How can I help you today?`,
          variableValues: {
            industry,
            company_name: company,
            language,
          },
        },
      }),
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      console.error(`[demo-call] Vapi error ${vapiRes.status}: ${errText}`);
      return NextResponse.json({ error: "Could not place call" }, { status: 502 });
    }

    console.log(
      `[demo-call] call placed: ${name} · ${company} · ${e164Phone} · ${email || "no-email"} · industry=${industry} · lang=${language}`
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[demo-call] Vapi request failed", err);
    return NextResponse.json({ error: "Could not place call" }, { status: 502 });
  }
}

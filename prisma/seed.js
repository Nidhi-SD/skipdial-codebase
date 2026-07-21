const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@skipdial.ai";
const DEMO_PASSWORD = "skipdial-demo";

const ADMIN_EMAIL = "nidhibisht@skipdial.ai";
const ADMIN_PASSWORD = "Admin@123";

// Sample posts migrated verbatim from the old src/data/blogs.json.
// Only `date` is explicit here (instead of @default(now())) so the seeded
// posts keep their original newest-first ordering.
const POSTS = [
  {
    id: "ai-voice-agents-transforming-home-services",
    title: "How AI Voice Agents Are Transforming Home Services",
    category: "Industry Insights",
    excerpt:
      "Discover how HVAC, plumbing, and electrical companies are using AI-powered phone agents to capture every lead — even at 2 AM.",
    content:
      "## The Problem with Missed Calls\n\nIn the home services industry, a missed call is a missed job. Studies show that **85% of callers who can't reach a business won't call back**. For HVAC companies during peak summer or plumbers handling emergencies, every unanswered ring is revenue walking out the door.\n\n## Enter AI Voice Agents\n\nAI voice agents like SkipDial are changing the game. These aren't the clunky IVR menus of the past — they're conversational, context-aware agents that can:\n\n- **Answer calls 24/7** with natural, human-like conversation\n- **Book appointments** directly into your scheduling software\n- **Qualify leads** by asking the right questions upfront\n- **Route urgent calls** to on-call technicians\n\n## Real Results\n\nOur clients in home services have seen:\n\n- **40% increase** in booked appointments\n- **Zero missed calls** after business hours\n- **$2,400/month savings** by reducing the need for after-hours answering services\n\n## Getting Started\n\nThe best part? Setup takes less than 15 minutes. SkipDial integrates with your existing phone system and CRM, so there's no disruption to your workflow.\n\nReady to stop missing calls? [Request a free demo](/request-a-free-demo) and see SkipDial in action.",
    coverImage: "",
    authorName: "SkipDial Team",
    date: new Date("2026-07-10"),
  },
  {
    id: "outbound-calling-best-practices-2026",
    title: "5 Outbound Calling Best Practices for 2026",
    category: "Guides",
    excerpt:
      "Maximize your outbound call campaigns with these proven strategies that combine AI efficiency with a human touch.",
    content:
      "## Why Outbound Still Matters\n\nDespite the rise of digital marketing, **phone calls remain the highest-converting channel** for B2B and service businesses. The challenge? Scaling outbound without burning out your team.\n\n## 1. Lead Scoring Before Dialing\n\nDon't waste time on cold leads. Use your CRM data to prioritize prospects who've shown intent — website visits, form fills, or previous inquiries.\n\n## 2. Personalize the Opening\n\nGeneric scripts kill conversations. AI agents can pull context from your CRM to personalize every call:\n\n> \"Hi Sarah, I noticed you requested a quote for commercial HVAC maintenance last week...\"\n\n## 3. Optimal Timing\n\nData shows the best times for outbound calls are:\n- **Tuesday through Thursday**\n- **10 AM – 12 PM** and **2 PM – 4 PM** local time\n\n## 4. Follow-Up Persistence\n\nIt takes an average of **8 touchpoints** to close a deal. AI agents can handle the follow-up cadence automatically, freeing your team to focus on closing.\n\n## 5. Measure and Iterate\n\nTrack key metrics: connection rate, conversion rate, average call duration. Use these insights to continuously refine your approach.\n\n## The AI Advantage\n\nSkipDial's outbound AI agents can make hundreds of personalized calls per day while your team focuses on high-value conversations. [Learn more about outbound calling](/outbound-calling).",
    coverImage: "",
    authorName: "SkipDial Team",
    date: new Date("2026-07-05"),
  },
  {
    id: "real-estate-ai-phone-automation",
    title: "Why Real Estate Offices Need AI Phone Automation",
    category: "Industry Insights",
    excerpt:
      "Property management companies and real estate agencies are leveraging AI voice agents to handle tenant inquiries, schedule showings, and never miss a lead.",
    content:
      "## The Real Estate Communication Challenge\n\nReal estate professionals juggle dozens of calls daily — tenant maintenance requests, prospective buyer inquiries, showing schedules, and vendor coordination. **Missing even one call can mean losing a $500K listing.**\n\n## How AI Voice Agents Help\n\n### For Property Management\n- **Maintenance requests**: AI agents can log tenant issues, assign priority levels, and dispatch work orders automatically\n- **Rent inquiries**: Handle questions about available units, pricing, and lease terms 24/7\n- **Emergency routing**: Urgent issues (flooding, lockouts) get immediately routed to on-call staff\n\n### For Sales Teams\n- **Lead capture**: Every inquiry is logged with full context — no more sticky notes\n- **Showing scheduling**: AI agents check availability and book showings directly into your calendar\n- **Follow-ups**: Automated outbound calls to nurture leads who've gone quiet\n\n## The ROI\n\nReal estate teams using SkipDial report:\n\n| Metric | Before | After |\n|--------|--------|-------|\n| Missed calls | 35% | 0% |\n| Lead response time | 4 hours | Instant |\n| Showings booked/week | 12 | 28 |\n\n## Start Today\n\nSkipDial is purpose-built for real estate. [See how it works for your industry](/industries/real-estate-property-management).",
    coverImage: "",
    authorName: "SkipDial Team",
    date: new Date("2026-06-28"),
  },
];

async function main() {
  const hashedDemoPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const hashedAdminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      password: hashedDemoPassword,
      role: "user",
    },
  });

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      name: "Admin",
      password: hashedAdminPassword,
      role: "admin",
    },
  });

  for (const post of POSTS) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
  }

  console.log(`Seeded demo user  -> email: ${DEMO_EMAIL} / password: ${DEMO_PASSWORD}`);
  console.log(`Seeded admin user -> email: ${ADMIN_EMAIL} / password: ${ADMIN_PASSWORD}`);
  console.log(`Seeded ${POSTS.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

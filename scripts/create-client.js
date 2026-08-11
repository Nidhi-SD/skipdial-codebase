#!/usr/bin/env node
/* Provision a client portal login.
 *
 * There is no public sign-up: SkipDial creates the account, links it to the
 * client's single voice-platform agent (Vapi or Retell), and emails the
 * credentials. This script is that step.
 *
 *   node scripts/create-client.js --agents
 *   node scripts/create-client.js --agents --provider retell
 *   node scripts/create-client.js --email jane@acme.com --company "Acme Dental" \
 *     --agent 3ae3e55f-6350-43f3-8ad2-485bffd3bc11
 *   node scripts/create-client.js --email owner@lotsofsunshine.com --company "Lots of Sunshine" \
 *     --provider retell --agent agent_97617aacab6fea929308884cf5
 *
 * Re-running for an existing email updates the linked agent and, unless
 * --keep-password is passed, issues a fresh password. */

const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// .env is not auto-loaded outside Next, so read it for the API keys/DATABASE_URL.
try {
  require("fs")
    .readFileSync(require("path").join(__dirname, "..", ".env"), "utf8")
    .split("\n")
    .forEach((line) => {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    });
} catch {
  /* .env is optional when the vars are already exported */
}

const prisma = new PrismaClient();

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

/* Ambiguous glyphs (0/O, 1/l/I) are excluded — these get retyped by hand from
   an email, and a password nobody can read is a support ticket. */
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePassword(groups = 3, size = 5) {
  const chars = [];
  const bytes = crypto.randomBytes(groups * size);
  for (let i = 0; i < groups * size; i++) {
    chars.push(ALPHABET[bytes[i] % ALPHABET.length]);
  }
  return Array.from({ length: groups }, (_, g) =>
    chars.slice(g * size, (g + 1) * size).join("")
  ).join("-");
}

/* ── Vapi ──────────────────────────────────────────────────────────────────── */

async function vapiListAgents() {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) {
    console.error("VAPI_API_KEY is not set — cannot list Vapi agents.");
    process.exit(1);
  }
  const res = await fetch("https://api.vapi.ai/assistant?limit=100", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`Vapi returned ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const agents = await res.json();

  const linked = await prisma.user.findMany({
    where: { vapiAssistantId: { not: null } },
    select: { email: true, vapiAssistantId: true },
  });
  const byId = new Map(linked.map((u) => [u.vapiAssistantId, u.email]));

  console.log(`\n${agents.length} Vapi assistant(s):\n`);
  for (const a of agents) {
    const owner = byId.get(a.id);
    console.log(`  ${a.id}  ${(a.name || "(unnamed)").padEnd(46)}${owner ? `→ ${owner}` : ""}`);
  }
  console.log("");
}

/** Returns null (skip verification) when VAPI_API_KEY isn't set, so a
 *  missing key degrades to "unverified" rather than crashing the script. */
async function vapiVerifyAgent(agentId) {
  const apiKey = process.env.VAPI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(`https://api.vapi.ai/assistant/${encodeURIComponent(agentId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return { ok: false, status: res.status };
  const agent = await res.json();
  return { ok: true, name: agent.name || "(unnamed)" };
}

/* ── Retell ────────────────────────────────────────────────────────────────── */

async function retellListAgents() {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    console.error("RETELL_API_KEY is not set — cannot list Retell agents.");
    process.exit(1);
  }
  const res = await fetch("https://api.retellai.com/list-agents", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.error(`Retell returned ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const agents = await res.json();

  const linked = await prisma.user.findMany({
    where: { retellAgentId: { not: null } },
    select: { email: true, retellAgentId: true },
  });
  const byId = new Map(linked.map((u) => [u.retellAgentId, u.email]));

  console.log(`\n${agents.length} Retell agent(s):\n`);
  for (const a of agents) {
    const owner = byId.get(a.agent_id);
    console.log(
      `  ${a.agent_id}  ${(a.agent_name || "(unnamed)").padEnd(46)}${owner ? `→ ${owner}` : ""}`
    );
  }
  console.log("");
}

/** Same null-on-missing-key contract as vapiVerifyAgent. */
async function retellVerifyAgent(agentId) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(`https://api.retellai.com/get-agent/${encodeURIComponent(agentId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return { ok: false, status: res.status };
  const agent = await res.json();
  return { ok: true, name: agent.agent_name || "(unnamed)" };
}

/* ── Main ──────────────────────────────────────────────────────────────────── */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const provider = args.provider === "retell" ? "retell" : "vapi";

  if (args.agents || args["list-agents"]) {
    if (provider === "retell") await retellListAgents();
    else await vapiListAgents();
    return;
  }

  const email = typeof args.email === "string" ? args.email.trim().toLowerCase() : "";
  const agentIdArg = typeof args.agent === "string" ? args.agent.trim() : "";
  const company = typeof args.company === "string" ? args.company.trim() : null;
  const name = typeof args.name === "string" ? args.name.trim() : company;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(
      'Usage: node scripts/create-client.js --email <address> --agent <agentId> [--provider vapi|retell] [--company "Name"] [--name "Person"] [--password <pw>] [--keep-password]\n' +
        "       node scripts/create-client.js --agents [--provider vapi|retell]        # list agent ids"
    );
    process.exit(1);
  }

  const idField = provider === "retell" ? "retellAgentId" : "vapiAssistantId";

  // Verify the agent exists before minting a login, so a typo surfaces here
  // rather than as an empty dashboard the client reports as broken.
  if (agentIdArg) {
    const verify = provider === "retell" ? retellVerifyAgent : vapiVerifyAgent;
    const result = await verify(agentIdArg);
    if (result && !result.ok) {
      console.error(
        `\n${provider === "retell" ? "Retell" : "Vapi"} does not recognise agent "${agentIdArg}" (HTTP ${result.status}).`
      );
      console.error(`Run \`node scripts/create-client.js --agents --provider ${provider}\` to see valid ids.\n`);
      process.exit(1);
    }
    if (result) console.log(`\nAgent verified: ${result.name}`);

    const clash = await prisma.user.findFirst({
      where: { [idField]: agentIdArg, email: { not: email } },
      select: { email: true },
    });
    if (clash) {
      console.error(
        `\nRefusing to continue: agent ${agentIdArg} is already linked to ${clash.email}.\n` +
          "One agent belongs to one client; unlink the other account first.\n"
      );
      process.exit(1);
    }
  } else {
    console.log("\nNo --agent given: the login will work but the dashboard will show the 'being set up' state.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  const keepPassword = Boolean(args["keep-password"]) && existing;

  let plainPassword = null;
  const data = {
    ...(company ? { company } : {}),
    ...(name ? { name } : {}),
    provider,
    ...(agentIdArg ? { [idField]: agentIdArg } : {}),
  };

  if (!keepPassword) {
    plainPassword = typeof args.password === "string" ? args.password : generatePassword();
    data.password = await bcrypt.hash(plainPassword, 10);
  }

  const user = existing
    ? await prisma.user.update({ where: { email }, data })
    : await prisma.user.create({
        data: { email, role: "user", password: data.password, ...data },
      });

  console.log(`\n${existing ? "Updated" : "Created"} client account\n`);
  console.log(`  Company   ${user.company || "—"}`);
  console.log(`  Email     ${user.email}`);
  console.log(`  Password  ${plainPassword ?? "(unchanged)"}`);
  console.log(`  Platform  ${user.provider}`);
  console.log(`  Agent     ${user[idField] || "not linked"}`);

  if (plainPassword) {
    console.log("\n─── copy into the welcome email ─────────────────────────────\n");
    console.log(`Hi${user.name ? ` ${user.name}` : ""},

Your SkipDial dashboard is ready. You can sign in here:

  https://www.skipdial.ai/login

  Email:    ${user.email}
  Password: ${plainPassword}

You'll see your agent's calls, transcripts and recordings as they come in.

— The SkipDial Team`);
    console.log("\n─────────────────────────────────────────────────────────────");
    console.log("\nSend this over a channel you trust, and store nothing in plain text afterwards.\n");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

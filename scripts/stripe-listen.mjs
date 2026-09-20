import "dotenv/config";

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  console.error("STRIPE_SECRET_KEY não encontrada no .env");
  process.exit(1);
}

const port = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:4000")
  .port;

const wingetPath = join(
  process.env.LOCALAPPDATA ?? "",
  "Microsoft",
  "WinGet",
  "Packages",
  "Stripe.StripeCli_Microsoft.Winget.Source_8wekyb3d8bbwe",
  "stripe.exe"
);
const command = existsSync(wingetPath) ? wingetPath : "stripe";

spawn(
  command,
  [
    "listen",
    "--api-key",
    apiKey,
    "--events",
    "invoice.paid,customer.subscription.deleted",
    "--forward-to",
    `localhost:${port || 4000}/api/stripe/webhook`,
  ],
  { stdio: "inherit" }
).on("exit", (code) => process.exit(code ?? 0));

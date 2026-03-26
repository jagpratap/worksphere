import { delay as mswDelay } from "msw";

const DELAYS = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 700,
} as const;

export async function delay(tier: keyof typeof DELAYS = "normal"): Promise<void> {
  await mswDelay(DELAYS[tier]);
}

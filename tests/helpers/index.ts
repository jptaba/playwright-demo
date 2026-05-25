/**
 * Shared test helper utilities.
 *
 * Add helpers here that are reused across multiple feature areas.
 * Avoid duplicating logic that already exists in page objects.
 */

import { mkdirSync } from 'node:fs';
import type { Page } from '@playwright/test';

/**
 * Captures a full-page screenshot to `artifacts/mcp/<name>.png`.
 * Use at key assertion points for debugging and evidence collection.
 *
 * @example
 * await captureEvidence(page, 'checkout-complete');
 */
export async function captureEvidence(page: Page, name: string): Promise<void> {
  mkdirSync('artifacts/mcp', { recursive: true });
  await page.screenshot({ path: `artifacts/mcp/${name}.png`, fullPage: true });
}

/**
 * Scrolls the page to the bottom to trigger lazy-loaded content.
 * Useful for infinite scroll pages or deferred rendering.
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

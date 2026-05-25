import { test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { users } from '../data/users';
import { frameworkEnv } from '../support/env';
import { authStorageState } from '../support/config';

setup('authenticate as standard user', async ({ page }) => {
  mkdirSync('artifacts/auth', { recursive: true });
  await page.goto(frameworkEnv.baseUrl);
  await page.getByTestId('username').fill(users.standard.username);
  await page.getByTestId('password').fill(users.standard.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL(/\/inventory\.html/);
  await page.context().storageState({ path: authStorageState });
});

# SauceDemo Authentication Test Plan

## Application Overview

SauceDemo is a login-gated storefront where authenticated users can browse inventory. This plan covers successful login behavior from a clean seed state.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-login-standard-user

**File:** `tests/specs/auth/should-login-standard-user.spec.ts`

**Steps:**

1. Fill username with standard_user.
   - expect: Username field contains standard_user.

2. Fill password with secret_sauce.
   - expect: Password field contains secret_sauce.

3. Submit the login form.
   - expect: URL contains /inventory.html.
   - expect: Products heading is visible.

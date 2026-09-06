# End-to-end tests

Run from the repository root with Node.js 24, pnpm 12.3.4 and a running Docker engine:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:e2e
```

`test:e2e` generates the Prisma client before starting Playwright.
The separate `End-to-end tests` GitHub Actions workflow runs on pull requests
targeting `main` and pushes to `main`, using the same Node.js and pnpm versions.
It checks TypeScript before running the browser suite.

The workspace records explicit build-script decisions for pnpm 12 and narrow
release-age exceptions for the pinned Playwright packages so fresh installations
run without interactive approval.

To select tests:

```sh
pnpm test:e2e e2e/gamma.spec.ts
pnpm test:e2e e2e/content.spec.ts
pnpm test:e2e e2e/slack.spec.ts
```

## Coverage

| File              | Flows and assertions                                                                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gamma.spec.ts`   | Website login → real Gamma → OAuth callback → authenticated session; committee member and role from Gamma; logout clears the session and authoring access.                                                                                                |
| `content.spec.ts` | Create news and division pages through the English UI, verify both saved language versions and reload persistence; upload and embed an image in each, verify downloaded bytes; search title/body, follow results, handle empty results and short queries. |
| `slack.spec.ts`   | Publish predefined Markdown through the website; capture the outgoing webhook; validate block structure and preserved text; compare with the Slack serialization API in English and Swedish; check long headers and HTTP 400 fallback.                    |

## Writing tests

Use blank lines to separate setup, actions, and assertions. Longer journeys use
`test.step()` for meaningful phases that also appear in the Playwright report.
Keep assertions in the specs and reusable browser actions in `helpers/browser.ts`.
`fixtures/` holds the Gamma bootstrap, Markdown examples, and upload bytes;
`helpers/gamma.ts` provisions the official OAuth client through Gamma's UI.

Prefer `getByRole()` with an accessible name for interactive controls. Use a
label or placeholder when a role cannot identify the control, and text locators
for plain content. Authoring fields currently use headings without associated
labels, so the helper scopes by heading before selecting the control by role.
The website's logout anchor uses visible text because it has no `href` or
link role. The unnamed search textbox is distinguished from date filters by
its native input type. Uploads use the visible “Select files” button and its
file chooser.

## Isolation

`composer.ts` starts a single stack per Playwright worker using Testcontainers:

- Gamma **2.5.1**, pinned by digest, with test-only users and committee data from its real bootstrap.
- Redis 5.0.14-alpine and two PostgreSQL 16.0-alpine containers for Gamma and the website.
- The real Next.js development server, on an available local port.
- A temporary directory for uploaded files and a loopback HTTP receiver for Slack webhooks.

Gamma's official OAuth client is provisioned through its administrator UI. The website
database initially contains only a committee mapping; member names and roles come from
Gamma. Each test gets a fresh browser context and starts with empty news, pages, media
metadata and notifier tables. No existing database or Slack webhook is used. Tests
run sequentially because they share this disposable stack. Uploads, containers and the
network are removed on teardown, including failures; Testcontainers' resource reaper
handles containers if the runner is forcibly terminated. The Gamma image needs amd64
emulation on ARM machines.

## Slack checks

The local receiver checks the Block Kit subset this application's converter emits:
required fields, header/text limits, absolute image/link URLs, block counts, and valid
rich-text nesting. The contract is based on Slack's [block reference](https://docs.slack.dev/reference/block-kit/blocks/),
[rich text](https://docs.slack.dev/reference/block-kit/blocks/rich-text-block/), and
[header limits](https://docs.slack.dev/reference/block-kit/blocks/header-block/).

Invalid initial payloads fail the tests even if the website sends a successful fallback.
The fallback test intentionally returns `400 invalid_blocks` once and verifies the
second payload. Payloads are never posted to Slack. These local contract checks do not
verify Slack credentials, workspace policies, or every rule enforced by Slack's API.

## Diagnostics

Failures retain screenshots, Playwright traces, Gamma/website logs and captured webhook
JSON under `test-results/`. Startup failures write `startup-<worker>.log` there.
`playwright-report/` contains the HTML report. CI uploads both directories on failure.

```sh
pnpm exec playwright show-report
pnpm exec playwright show-trace test-results/<test>/trace.zip
```

The suite tests a development server, not a production build or deployed Gamma instance.

# Running and testing

## Prerequisites

| Tool | Notes |
|---|---|
| Node.js | Node 22 or later, as set in `package.json` and the `Dockerfile` |
| Yarn | Yarn 4, enabled with `corepack enable` |
| Azure CLI | `az login` with read access to the `sptribs-aat` Key Vault. Development mode reads secrets from it |
| HMCTS VPN | Needed for AAT services (`*.service.core-compute-aat.internal`), AAT IDAM and Key Vault |
| Docker | Only for the Docker set-up, or to run the cftlib stack in `sptribs-case-api` |

## Run locally

```bash
corepack enable
yarn install
az login
yarn start:dev
```

`yarn start:dev` sets `NODE_ENV=development` and runs two `nodemon` processes, one for the Express server and one for the front-end assets. Open <http://localhost:3100>; the dev server is plain HTTP. Sign-in redirects to AAT IDAM, and only accounts with the `citizen` role get past it.

Other start scripts:

| Script | Behaviour |
|---|---|
| `yarn start` | `NODE_ENV=production`, secrets from a mounted volume. Used in deployed environments; run `yarn build` first |
| `yarn start:debug` | Server only, with the `nodemon.express.json` settings |
| `yarn start:docker` | `NODE_ENV=docker`, using `config/docker.yaml` |

Sessions use a file store in `/tmp` unless `REDIS_HOST` is set, so Redis is not needed locally.

To turn off the global rate limiter while testing, start with `RATE_LIMITER_DISABLED=1 yarn start:dev`.

### Against AAT

The defaults in `config/default.yaml` already point at AAT: `sptribs-case-api`, CDAM, IDAM and S2S. Connect the VPN, run `az login` and start the app. You need a 16-digit reference for an AAT case and the subject's name and date of birth on that case. A case created through the AAT deployment of [sptribs-frontend](https://github.com/hmcts/sptribs-frontend) works.

For IDAM to accept the sign-in, `http://localhost:3100/receiver` must be registered as a redirect URI on the app's IDAM client in AAT.

### Against the cftlib stack

[sptribs-case-api](https://github.com/hmcts/sptribs-case-api) can run with CCD, CDAM and the rest of the CFT stack in-process with `./gradlew bootWithCCD`. To point this app at it:

```bash
export CASE_API_URL=http://localhost:4013
export CASE_DOCUMENT_API_URL=http://localhost:4455
yarn start:dev
```

IDAM and S2S stay on AAT in this set-up, so you still need the VPN and `az login`. See the `sptribs-case-api` README for the stack's own prerequisites.

### Against a sptribs-case-api pull request

Set `CASE_API_URL` to the pull request's preview host, for example `http://sptribs-case-api-pr-<number>.preview.platform.hmcts.net`.

### With Docker

```bash
docker-compose build
docker-compose up
```

This builds the production image and exposes port 3100. The container runs in production mode, so it expects its secrets from a mounted volume and has none locally.

### Common problems

| Symptom | Fix |
|---|---|
| Start-up fails in `az keyvault secret show` | Run `az login` again, check `az account show`, and connect the VPN |
| `https://localhost:3100` does not load | The dev server is plain HTTP. Use `http://localhost:3100` |
| IDAM rejects the redirect, or sign-in loops | Register `/receiver` on your local host against the IDAM client, and sign in with a `citizen` account |
| The case finder reports the case as not found | The case reference must be 16 digits with no spaces, and the signed-in user must have access to it through `sptribs-case-api` |
| Subject details is not accepted | The name and date of birth must match the subject on the case. After 10 attempts in 15 minutes the page is rate-limited |
| The session disappears | The `/tmp` file store was cleared, or the 21-minute session expired. Sign in again |

## Unit tests

```bash
yarn test            # Jest
yarn test:coverage   # with a coverage report
yarn lint            # tsc type check and ESLint
```

Jest (`jest.config.js`) runs `*.test.ts` files under `src/main` with `ts-jest` in a Node environment. Coverage thresholds are 70% for branches and 80% for functions, lines and statements. `@hmcts/nodejs-logging` is replaced by a mock in `src/test/unit/mocks`, and a small set of ESM-only dependencies is transformed so the tests run on Node 22.

Unit tests sit next to the code they test, for example `src/main/steps/dss-update/requireVerifiedCase.test.ts` or the `postController.test.ts` file in each step directory.

`yarn cichecks` runs install, build, lint and unit tests together. The GitHub `checks.yml` workflow runs it on every pull request and on every push to `master`.

## Smoke, accessibility, functional and cross-browser tests

`yarn test:smoke`, `yarn test:functional`, `yarn test:a11y` and `yarn test:crossbrowser-e2e` print a message and exit. `Jenkinsfile_CNP` calls the smoke stage against the preview and AAT deployments, which runs `yarn test:smoke`. Browser, accessibility and cross-browser tests for this app are in a separate repository.

## End-to-end tests (hmcts/sptribs-e2etests)

The browser tests for this app are in [hmcts/sptribs-e2etests](https://github.com/hmcts/sptribs-e2etests), a Playwright suite that also covers `sptribs-frontend` and the caseworker journeys in Manage Case.

### What covers this app

`src/tests/E2E/updateCase.test.ts` covers the whole journey:

| Tag | Scenario |
|---|---|
| `@DSSUpdate` | Find a case, verify the subject, upload a document with additional information and submit, in Welsh; and a check of every back link |
| `@updateDSSFirefox` | Upload one document with no additional information, on Firefox |
| `@updateDSSWebkit` | Submit additional information with no documents, on WebKit |
| `@ErrorMessaging` | Validation and error messages, in English and Welsh |
| `@accessibility` | The journey with an axe audit on each page; any violation fails the test |

The tests first create a case through `sptribs-frontend` and then use Manage Case, so they need all three base URLs and exercise both citizen apps and `sptribs-case-api` together.

### Running them

From a checkout of `sptribs-e2etests`:

```bash
yarn install
yarn configure        # playwright install --with-deps
yarn load-secrets     # writes .env from the sptribs-aat Key Vault (az login and VPN)
export DSS_BASE_URL=https://sptribs-frontend.aat.platform.hmcts.net
export UC_BASE_URL=https://sptribs-dss-update-case-web.aat.platform.hmcts.net
export CASEAPI_BASE_URL=https://manage-case.aat.platform.hmcts.net
yarn test:ChromeUC    # or test:FirefoxUC, test:WebkitUC, test:errorMessaging
```

`UC_BASE_URL` is the address of this app. To test a pull request, set it to the preview URL (`https://sptribs-dss-update-case-web-pr-<number>.preview.platform.hmcts.net`).

`yarn test:report` opens the HTML report.

### In the pipelines

- The `sptribs-e2etests` nightly pipeline runs on weekday mornings against AAT. It runs the update-case tests on Chrome, Firefox and WebKit, alongside the DSS create, caseworker and accessibility tests. This is the main browser regression run for this app.
- This repository's `Jenkinsfile_CNP` does not run the end-to-end suite. Run it by hand against your preview deployment when a change affects the journey.

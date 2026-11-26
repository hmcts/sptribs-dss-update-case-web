# sptribs-dss-update-case-web

Citizen web application for adding documents and information to an existing First-tier Tribunal (Special Tribunals) case in the Criminal Injuries Compensation (CIC) jurisdiction.

It is used by appellants and their representatives after an appeal has been submitted. They find the case by its 16-digit reference, confirm the subject's name and date of birth, upload documents and add a note, and submit the update to the case.

Caseworkers do not use this app. They see the submitted documents on the case in Manage Case (ExUI).

The app is a Node.js/Express application rendered with Nunjucks and GOV.UK Frontend. It holds no case logic of its own. Case access, subject verification and the case update are handled by [sptribs-case-api](https://github.com/hmcts/sptribs-case-api), which owns the case type `CriminalInjuriesCompensation` in jurisdiction `ST_CIC`. Documents are stored through CCD Case Document Access Management (CDAM).

New appeals are made in the companion app [sptribs-frontend](https://github.com/hmcts/sptribs-frontend).

## Journey overview

1. The citizen opens the landing page (`/`) and signs in through IDAM (`/login`, then `/receiver`). Only users with the `citizen` role get past sign-in.
2. **Case finder** (`/dss-update/casefinder`): they enter the 16-digit case reference, and the app checks access with `sptribs-case-api`.
3. **Subject details** (`/dss-update/subject-details`): they enter the subject's full name and date of birth, which `sptribs-case-api` verifies against the case.
4. **Upload documents** (`/upload-documents`): they upload files, which go to CDAM, and can add a description of the documents.
5. **Check your answers** (`/dss-update/check-your-answers`): the app verifies the subject again, then sends the document references and description to `sptribs-case-api`, which applies the `citizen-cic-dss-update-case` event.
6. **Confirmation** (`/dss-update/confirmation-page`).

The details, including the session guards and the API calls, are in [docs/journey.md](docs/journey.md).

## Quick start

Prerequisites: Node.js 22, Yarn 4 through Corepack, the Azure CLI signed in with read access to the `sptribs-aat` Key Vault, and the HMCTS VPN for AAT services.

```bash
corepack enable
yarn install
az login
yarn start:dev
```

Open <http://localhost:3100>. In development mode the app:

- listens on port 3100 over plain HTTP;
- reads its secrets from the `sptribs-aat` Key Vault with `az`;
- signs users in through AAT IDAM;
- calls `sptribs-case-api` and CDAM in AAT, unless you set `CASE_API_URL` and `CASE_DOCUMENT_API_URL`.

To run against a local `sptribs-case-api`, or with Docker, see [docs/running-and-testing.md](docs/running-and-testing.md).

## Configuration summary

Configuration uses [node-config](https://github.com/node-config/node-config): `config/default.yaml`, then `config/<NODE_ENV>.yaml`, then the environment variables mapped in `config/custom-environment-variables.yaml`.

| Setting | Environment variable | Notes |
|---|---|---|
| Case API | `CASE_API_URL` | `sptribs-case-api`: access check, subject verification and case update |
| CDAM | `CASE_DOCUMENT_API_URL` | Document upload and delete |
| IDAM | `IDAM_WEB_URL`, `IDAM_API_URL`, `IDAM_END_SESSION_URL`, `IDAM_SECRET` | OpenID Connect sign-in |
| S2S | `RPE_API`, `SERVICE_AUTH_SECRET` | Service token lease; the app leases its token as `sptribs_case_api` |
| Sessions | `REDIS_HOST`, `REDIS_PORT` | Redis when a host is set, otherwise a file store in `/tmp` |
| Rate limiter | `RATE_LIMITER_DISABLED` | Any value turns off the global limit of 30 requests per 15 seconds |

In deployed environments secrets come from the `sptribs-<env>` Key Vault, mounted by the Helm chart and copied into config by `src/main/modules/properties-volume/index.ts`. The full list of keys, secrets and environments is in [docs/configuration.md](docs/configuration.md).

## Tests

| Command | What it runs |
|---|---|
| `yarn test` | Jest unit tests (`*.test.ts` under `src/main`), with coverage thresholds of 70% for branches and 80% for functions, lines and statements |
| `yarn test:coverage` | Unit tests with a coverage report |
| `yarn lint` | TypeScript type check and ESLint |
| `yarn test:smoke`, `yarn test:functional`, `yarn test:a11y`, `yarn test:crossbrowser-e2e` | Print a message and exit. Browser, accessibility and cross-browser tests are in [hmcts/sptribs-e2etests](https://github.com/hmcts/sptribs-e2etests) |
| `yarn cichecks` | Install, build, lint and unit test, as run by the GitHub `checks.yml` workflow |

See [docs/running-and-testing.md](docs/running-and-testing.md) for how the end-to-end suite covers this app.

## Developing

### Code style

The project uses [ESLint](https://github.com/typescript-eslint/typescript-eslint) with Prettier. To lint and fix:

```bash
yarn lint --fix
```

### Testing against a sptribs-case-api pull request

A `sptribs-case-api` pull request deploys its own preview environment. To point this app at it, set `CASE_API_URL` to the preview host (for example `http://sptribs-case-api-pr-<number>.preview.platform.hmcts.net`), either locally or in `charts/sptribs-dss-update-case-web/values.preview.template.yaml` on your own pull request.

Add the `enable_keep_helm` label to a pull request to keep its preview release after the pipeline finishes. With cluster access you can then find its URL with:

```bash
kubectl -n sptribs get ingress | grep <pr-number>
```

### Security

#### Helmet

The app uses [Helmet](https://helmetjs.github.io/) to set security-related HTTP headers, including `Referrer-Policy` and `Content-Security-Policy`. The referrer policy is set by `security.referrerPolicy` in `config/default.yaml`.

#### Rate limiting

Besides the global rate limiter, `POST /dss-update/subject-details` is limited to 10 attempts per 15 minutes for each user and case (`src/main/routes.ts`).

### Health check

The app exposes `/health`, `/health/liveness` and `/health/readiness` through [nodejs-healthcheck](https://github.com/hmcts/nodejs-healthcheck), configured in `src/main/modules/health/index.ts`. `/health` reports a single static check and does not call the app's dependencies.

## Documentation

- [docs/journey.md](docs/journey.md): steps, routing, the case API calls, sessions, Welsh and uploads
- [docs/configuration.md](docs/configuration.md): config keys, secrets, the Helm chart and environments
- [docs/running-and-testing.md](docs/running-and-testing.md): running locally, unit tests and the end-to-end suite

Related repositories:

- [hmcts/sptribs-case-api](https://github.com/hmcts/sptribs-case-api): case type definition, callbacks and the `/cases/cica/...` endpoints
- [hmcts/sptribs-frontend](https://github.com/hmcts/sptribs-frontend): the new appeal journey and the citizen dashboard
- [hmcts/sptribs-e2etests](https://github.com/hmcts/sptribs-e2etests): Playwright end-to-end tests

## Licence

This project is licensed under the MIT Licence. See the [LICENSE](LICENSE) file for details.

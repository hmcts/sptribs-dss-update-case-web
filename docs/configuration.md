# Configuration

## How configuration is loaded

The app uses [node-config](https://github.com/node-config/node-config). Values are resolved in this order, each layer overriding the one before:

1. `config/default.yaml`
2. `config/<NODE_ENV>.yaml` (`development.yaml`, `production.yaml`, `docker.yaml` or `test.yaml`)
3. Environment variables listed in `config/custom-environment-variables.yaml`
4. Secrets copied in by `src/main/modules/properties-volume/index.ts` (see [Secrets](#secrets))

`yarn start` sets `NODE_ENV=production`, and the Helm chart sets `NODE_ENV: production` for the pod. `yarn start:dev` sets `NODE_ENV=development`. If `NODE_ENV` is unset the app treats it as `development`.

`NODE_ENV=development` reads secrets from Key Vault with the Azure CLI and serves the front-end assets through `webpack-dev-middleware`. Any value other than `production` turns off the `secure` cookie flag and builds the IDAM callback URL with `http://` and the configured port.

## Environment variables and config keys

| Environment variable | Config key | Default (`default.yaml`) | Purpose |
|---|---|---|---|
| `PORT` | `port` | `3100` | HTTP port |
| `CASE_API_URL` | `services.sptribs.url` | AAT `sptribs-case-api` | Access check, subject verification and case update |
| `CCD_URL` | `services.case.url` | AAT `ccd-data-store-api` | Default base URL of the API client in `src/main/app/case/api.ts`. Every current call passes `services.sptribs.url` instead |
| `CASE_DOCUMENT_API_URL` | `services.cdam.url` | AAT `ccd-case-document-am-api` | Document upload and delete |
| `RPE_API` | `services.authProvider.url` | AAT `rpe-service-auth-provider` | S2S lease endpoint |
| `SERVICE_AUTH_SECRET` | `services.authProvider.secret` | placeholder | S2S TOTP secret |
| none | `services.authProvider.microservice` | `sptribs_case_api` | Microservice name the S2S token is leased as |
| `IDAM_WEB_URL` | `services.idam.authorizationURL` | AAT IDAM `/o/authorize` | OIDC authorisation endpoint |
| `IDAM_API_URL` | `services.idam.tokenURL` | AAT IDAM `/o/token` | OIDC token endpoint |
| `IDAM_END_SESSION_URL` | `services.idam.endSessionURL` | AAT IDAM `/o/endSession` | Sign-out |
| none | `services.idam.clientID` | set in `default.yaml` | OAuth2 client ID |
| `IDAM_SECRET` | `services.idam.clientSecret` | placeholder | OAuth2 client secret |
| `REDIS_HOST`, `REDIS_PORT` | `session.redis.host`, `.port` | empty, `10000` | Session store. With no host, sessions use a file store in `/tmp` |
| `APPINSIGHTS_KEY` | `appInsights.instrumentationKey` | empty | Application Insights |
| `CASE_TYPE`, `JURISDICTION` | `caseType`, `jurisdiction` | `CriminalInjuriesCompensation`, `ST_CIC` | Metadata sent to CDAM with each upload |
| `RATE_LIMITER_DISABLED` | read from `process.env` in `src/main/server.ts` | unset | Any value turns off the global rate limit of 30 requests per 15 seconds per client |

Other keys in `default.yaml` without an environment variable:

| Config key | Default | Purpose |
|---|---|---|
| `session.maxAge` | `1260000` | Session cookie lifetime in milliseconds (21 minutes) |
| `uploadPolicy.documentSize` | `100` | Maximum file size in MiB, checked by the upload page |
| `uploadPolicy.maxNoOfFiles` | `20` | Maximum number of files in one update |
| `documentManagement.uploadSizeinMB` | `101` | Size limit of the `express-fileupload` parser |
| `services.idam.caching` | `false` | In-memory caching of IDAM tokens fetched by `getIdamToken()` in `src/main/app/auth/oidc.ts` |
| `security.referrerPolicy` | `origin` | `Referrer-Policy` header set by Helmet |
| `health.timeout`, `health.deadline` | `5000`, `15000` | Health check timeouts in milliseconds |
| `cookies.expiryTime`, `cookies.cookieName` | `365`, `sptribs-dss-update-case-web-cookie-preferences` | Cookie preferences cookie |
| `dynatrace.dynatraceUrl` | Dynatrace script URL | Real user monitoring script |

There is no feature-flag service. Behaviour is controlled by the keys above.

## Secrets

### Deployed environments

The Helm chart lists the secrets to mount from the `sptribs-<env>` Azure Key Vault under `nodejs.keyVaults.sptribs.secrets`. The pod reads them through [@hmcts/properties-volume](https://github.com/hmcts/properties-volume-nodejs), which exposes each one as `secrets.sptribs.<name>`. `PropertiesVolume.enableFor()` then copies each secret into the config key the code reads. No environment variable is involved.

| Key Vault secret | Config key |
|---|---|
| `idam-dss-update-ui-secret` | `services.idam.clientSecret` |
| `idam-systemupdate-username`, `idam-systemupdate-password` | `services.idam.systemUsername`, `services.idam.systemPassword` |
| `redis-new` (mounted with the alias `redis-access-key`) | `session.redis.key` |
| `s2s-case-api-secret` | `services.authProvider.secret` |
| `app-insights-instrumentation-key` (`app-insights-instrumentation-key-preview` in preview, aliased) | `appInsights.instrumentationKey` |
| `sptribs-dss-update-case-dynatrace-url` | `dynatrace.dynatraceUrl` |

To add a secret:

1. Create it in the `sptribs-<env>` Key Vault for every environment.
2. Add it to `nodejs.keyVaults.sptribs.secrets` in `charts/sptribs-dss-update-case-web/values.yaml`, and in `values.preview.template.yaml` if preview needs it.
3. Add a `setSecret('secrets.sptribs.<name>', '<config.key>')` line to `src/main/modules/properties-volume/index.ts`.
4. For local development, add a `setLocalSecret()` line as well.

### Development mode

With `NODE_ENV=development`, `PropertiesVolume` does not read a mounted volume. It runs `az keyvault secret show --vault-name sptribs-aat` for `idam-systemupdate-username`, `idam-systemupdate-password`, `idam-dss-update-ui-secret` and `s2s-case-api-secret`, and writes the values into the same config keys. You need `az login` with read access to that vault and, for AAT, the VPN. These values replace anything set through `IDAM_SECRET` or `SERVICE_AUTH_SECRET`.

### Pipeline secrets

`Jenkinsfile_CNP` loads a separate set of secrets from `sptribs-${env}` for the pipeline's own test stages. They do not reach the running pod.

| Key Vault secret | Pipeline variable |
|---|---|
| `idam-dss-update-ui-secret` | `IDAM_SECRET` |
| `idam-systemupdate-username`, `idam-systemupdate-password` | `CITIZEN_USERNAME`, `CITIZEN_PASSWORD` |
| `s2s-secret-sptribs-dss-update-case-web` | `SERVICE_AUTH_SECRET` |

## Helm chart

The chart is `charts/sptribs-dss-update-case-web`, a wrapper around the HMCTS `nodejs` chart (version 3.x, from `oci://hmctsprod.azurecr.io/helm`).

| File | Role |
|---|---|
| `values.yaml` | Base values: port 3100, readiness and liveness delays of 130 seconds, AAD identity `sptribs`, ingress `sptribs-dss-update-case-web.{{ .Values.global.environment }}.platform.hmcts.net`, spot instances off, `NODE_ENV: production`. Sets the service URLs for the environment (`CASE_API_URL`, `CCD_URL`, `CASE_DOCUMENT_API_URL`, IDAM and `RPE_API`), `REDIS_HOST` (the `sptribs-frontend-<env>` Azure Cache for Redis) and `REDIS_PORT`, and lists the Key Vault secrets |
| `values.preview.template.yaml` | Pull request deployments: `RATE_LIMITER_DISABLED: true`, the AAT Redis host, the preview Application Insights secret, and the `idam-pr` sub-chart, which registers the preview `/receiver` URL as an IDAM redirect URI |
| `values.aat.template.yaml` | AAT pipeline stage: sets only the image and ingress host |

The deployed releases in AAT, demo, perftest, ithc and prod are managed by Flux in [hmcts/cnp-flux-config](https://github.com/hmcts/cnp-flux-config) under `apps/sptribs/sptribs-dss-update-case-web/`. The base release sets two replicas with autoscaling up to four. The AAT, demo, perftest and ITHC overrides turn on ingress session affinity. The image is `hmctsprod.azurecr.io/sptribs/dss-update-case-web`. The per-environment files hold overrides such as the production ingress host and IDAM URLs.

## Environments

| Environment | URL | Deployed by |
|---|---|---|
| Preview | `https://sptribs-dss-update-case-web-pr-<number>.preview.platform.hmcts.net` | Jenkins, for each pull request |
| AAT | `https://sptribs-dss-update-case-web.aat.platform.hmcts.net` | Jenkins on merge to `master`, then Flux |
| Demo | `https://sptribs-dss-update-case-web.demo.platform.hmcts.net` | Flux |
| Perftest | `https://sptribs-dss-update-case-web.perftest.platform.hmcts.net` | Flux |
| ITHC | `https://sptribs-dss-update-case-web.ithc.platform.hmcts.net` | Flux |
| Production | `https://update.special-tribunals.service.gov.uk` | Flux |

All environments run in the `sptribs` Kubernetes namespace.

### Release flow

1. A pull request runs `Jenkinsfile_CNP`: build, lint and unit tests, a Docker image, a preview deployment and a smoke stage. The GitHub workflows run `yarn cichecks` (`checks.yml`), CodeQL analysis (`codeql-analysis.yml`) and a dependency review (`dependency-review.yml`).
2. A merge to `master` builds again, deploys to AAT and publishes an image tagged `prod-<sha>-<timestamp>`.
3. Flux image automation in `cnp-flux-config` picks up the new `prod-` tag and rolls it out to production and the other environments.
4. The pipeline also pushes `master` to the `demo`, `perftest` and `ithc` branches (`syncBranchesWithMaster`).

`Jenkinsfile_nightly` runs on weekday mornings and performs a dependency check and a Fortify scan. The browser tests for this app run in the [hmcts/sptribs-e2etests](https://github.com/hmcts/sptribs-e2etests) nightly pipeline (see [Running and testing](running-and-testing.md)).

### Monitoring

- Application Insights receives requests, dependency calls and exceptions.
- Pod logs: `kubectl logs -n sptribs deploy/sptribs-dss-update-case-web-nodejs`.
- `/health`, `/health/liveness` and `/health/readiness` are provided by `@hmcts/nodejs-healthcheck`. `/health` reports a single static check, so a dependency failure shows in the logs and Application Insights rather than in the health response.

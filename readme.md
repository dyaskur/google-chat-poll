# Absolute Poll - Google Chat Poll Bot

[![Github Action](https://github.com/dyaskur/google-chat-poll/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/dyaskur/google-chat-poll/actions)
[![Coverage Status](https://coveralls.io/repos/github/dyaskur/google-chat-poll/badge.svg?branch=master)](https://coveralls.io/github/dyaskur/google-chat-poll)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dyaskur_google-chat-poll&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=dyaskur_google-chat-poll)

A Google Chat add-on for creating polls and making quick decisions within Google Chat. Built with TypeScript and deployed to Google Cloud Functions.

**Installed over 1 million times** — the #1 poll app on the Google Workspace Marketplace.

<a href="https://workspace.google.com/marketplace/app/absolute_poll/687007803052?pann=b" target="_blank" aria-label="Get it from the Google Workspace Marketplace">
  <img alt="Google Workspace Marketplace badge" src="https://workspace.google.com/static/img/marketplace/en/gwmBadge.svg?" style="height: 68px">
</a>

Landing page: https://absolute-poll.yaskur.com/

## Screenshots

![Create poll form](assets/screenshot_1.png "Create poll form") ![Vote poll message](assets/screenshot_2.png "Vote poll message")

## Features

- Create polls with multiple choices
- Single or multiple choice voting (configurable vote limit)
- Anonymous voting option
- Add more options after poll is created
- Close polls manually or on a schedule with auto-close
- Reminder notifications before auto-close
- Permission control (creator-only or anyone can close)
- No database required — poll state is stored directly in the chat message

### Todo

- [ ] Duplicate Poll
- [ ] Save state to database
- [ ] Schedule poll
- [ ] Deno or Cloudflare worker support

## Getting Started

### Prerequisites

- Node.js 22+
- Yarn
- Google Cloud SDK (for deployment)

### Installation

```bash
yarn install
```

### Development

```bash
yarn start        # Start local dev server via functions-framework
yarn build        # Compile TypeScript
yarn test         # Run tests with coverage
yarn eslint .     # Lint
```

### Deployment

Create a `.env.yaml` file with:

```yaml
FUNCTION_REGION: asia-southeast1
GCP_PROJECT: your-project-id
QUEUE_NAME: your-queue-name
```

```bash
yarn deploy       # Build + deploy to GCP with env vars from .env.yaml
yarn release      # Build + deploy to GCP (production, uses env vars already set in GCP)
```

## Limitations

- Since poll state is stored in the chat message, there is a maximum data size limit. See [this SO question](https://stackoverflow.com/questions/75478309/what-is-the-limit-of-google-chat-message-card-via-chatbot) for details.
- Currently only tested on GCP Cloud Functions.

## Tips

You can test the JSON files in the `tests/json` folder at https://gw-card-builder.web.app/ to preview the card output.

## License

MIT

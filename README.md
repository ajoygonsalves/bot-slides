# Capptions Bot Slides

## Setup

1. Create a Google Cloud Project and enable the Google Slides API
2. Create OAuth 2.0 credentials and download as `credentials.json`
3. Store your presentation ID in `.env` as `PRESENTATION_ID`
4. Run `pnpm install`
5. Run `pnpm dev` to start the development server

## Security

- Never commit `credentials.json` or `token.json`
- Keep your Google Cloud credentials secure

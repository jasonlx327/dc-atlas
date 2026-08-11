# IDC Atlas

IDC Atlas is a source-first data center intelligence site. It combines an
industry map, rolling IDC news, public tender notices, and CWW benchmark data.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

## Runtime

- the public site is rendered with vinext and deployed as a Cloudflare Worker
- `/api/atlas` reads AI HOT and CWW server-side, preserving source attribution
- tender notices are displayed as public-source records with status and links
- static assets are served directly by Cloudflare; only API requests reach the Worker

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build and verify the public homepage
- `npm run cf:types`: refresh Cloudflare binding types
- `npm run cf:check`: build-ready Cloudflare deployment preflight
- `npm run deploy`: build and publish to Cloudflare

## Open-source scope

Code and documentation tracked in this public repository are licensed under
the [Apache License 2.0](LICENSE). Private administrative systems, credentials,
unpublished editorial material, internal datasets, and private operational
automation are not part of this distribution. See
[OPEN_SOURCE_SCOPE.md](OPEN_SOURCE_SCOPE.md) for the exact boundary.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

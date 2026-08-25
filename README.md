# n8n-nodes-srezai

This is an n8n community node. It lets you use [srezai.ru](https://srezai.ru) — web access for AI agents — in your n8n workflows.

srezai gives agents the web: search, page reading, structured extraction, screenshots, claim verification and deep research.

[n8n](https://n8n.io) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In n8n: **Settings > Community Nodes > Install**, then enter `n8n-nodes-srezai`.

## Operations

- **Web Search** — search pages by a text query (1 credit)
- **Image Search** — search images by a text query (1 credit)
- **Read URL** — fetch one page and return clean markdown (1 credit)
- **Extract** — return JSON strictly following your schema (4 credits)
- **Fetch Page (Screenshot)** — render a page and return a screenshot + markdown (3 credits)
- **Deep Research** — reconcile many sources into a written answer (20+ credits)

The node is also usable as a tool by n8n AI Agents (`usableAsTool`).

> Note: `verify_claim` and `get_usage` are available only via the srezai MCP
> server, not the REST API, so they are not exposed by this node. Remaining
> quota is returned in `X-RateLimit-*` response headers.

## Credentials

You need a srezai.ru API key. Create one in your srezai dashboard, then add
**srezai API** credentials in n8n and paste the key. The key is sent as a
`Bearer` token. The credential test calls the free `usage` endpoint.

## Usage

Add the **srezai** node, pick an operation, select your credential, and fill in
the query / URL. For **Extract**, provide a JSON schema describing the fields
you want back.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [srezai.ru](https://srezai.ru)

## License

[MIT](LICENSE)

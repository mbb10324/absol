# Absol

Absol is a planned smart email service with AI-assisted creation and social publishing. Users create expressive messages that can be sent privately, published publicly, or shared with groups. One canonical document powers the rich Absol experience and a conventional email representation.

**Current status:** an early React/TypeScript/Vite scaffold with a mock feed, basic Quill editor, and theme controls. The product described below is planned, not yet implemented.

## Project plan

Start with [CONTEXT.md](CONTEXT.md) for the agreed scope, architectural rules, implementation sequence, and current state.

The complete user-authored specification and amendments are preserved in the repository:

1. [Product specification](docs/plan/product-specification.md)
2. [Architecture clarifications](docs/plan/architecture-clarifications.md)
3. [Final Milestone 1 amendments](docs/plan/milestone-1-amendments.md)

Later amendments supersede conflicting details in earlier documents. The current target is **Milestone 1: The Absol Loop**:

> Local identity → AI generation → manual block editing → Absol and Email previews → explicit public publication → immutable message in Home and on a standalone page.

The initial editor supports Heading, Rich Text, Image, Button, Divider, Columns, and Video. Private messaging, groups, discovery, and AI search follow in later milestones. Freeform layout is deferred.

## Local development

```sh
npm install
npm run dev
```

Existing checks:

```sh
npm run build
npm run lint
```

The current scaffold has no AI server, real authentication, mailbox provisioning, or email delivery. The planned prototype will run locally with IndexedDB persistence and a server-side OpenAI integration. AI configuration and startup instructions will be added when that integration is implemented.

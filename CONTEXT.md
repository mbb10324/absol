# Absol — Project Context

Last consolidated: 2026-09-22.

## Source of truth

This file preserves decisions from the planning conversation so future work can continue without reconstructing it. Complete user-authored documents are retained verbatim in `docs/plan/`.

For conflicting requirements, use this precedence order, highest first:

1. [Final Milestone 1 amendments](docs/plan/milestone-1-amendments.md)
2. [Architecture clarifications](docs/plan/architecture-clarifications.md)
3. [Product specification](docs/plan/product-specification.md)

Later explicit user instructions can revise these decisions. Otherwise, Milestone 1 architecture is frozen: expand it only when implementation exposes a concrete blocker.

## Vision and agreed defaults

Absol is a smart email service with AI-assisted creation and social publishing. One message can function as an email, social post, conversation, webpage, or eventually a trusted interactive document. Audience, delivery, and presentation determine how it is encountered.

- Build a local interactive prototype with live OpenAI integration, not simulated AI.
- Evolve the scaffold's dark visual identity, preserve light mode, and improve responsiveness and accessibility.
- An identity owns addresses; it is not a mailbox. Prototype addresses use `handle@absol.test` and are not real mailboxes.
- Public publication creates discoverable content, not deliveries to every registered inbox.
- Absol View is the rich experience; Email View is a readable conventional email representation. Both derive from one canonical document.
- The refined plan supersedes the earlier combined private/public Home: Home has For You and Following; private mail lives under Messages.
- The refined plan supersedes the earlier freeform-canvas decision: start with structured blocks. Advanced Layout Mode is deferred.
- Initial groups are discoverable and open to joining; restricted message history is available to members. More complex group permissions are later work.
- No production deployment, real authentication, mailbox provisioning, or internet email transport in the local prototype.

## Current repository state

At the planning baseline, the app uses React 18, TypeScript, Vite, React Quill, React Icons, and plain CSS. It contains a mock feed, a basic composer, placeholder interactions, and theme controls. There is no product persistence layer, AI server, account system, or email transport.

During inspection, `npm run lint` passed. `npm run build` failed on an unused `React` import in `src/main.tsx`. This known build issue has not been fixed as part of saving the plan.

Planned features in these documents must not be presented as already implemented.

## Immediate target: Milestone 1 — The Absol Loop

Build one polished workflow before expanding the surrounding social product:

1. Seed or locally create an Absol identity.
2. Ask AI to create a photography website launch announcement using a selected image and a configured destination link.
3. Generate a structured document, then manually edit its content and design.
4. Preview Absol View and Email View with responsive rendering and graceful email fallbacks.
5. Explicitly choose **Publish publicly**.
6. Persist an immutable document snapshot and its message.
7. Open the result in Home and at a standalone local Absol route.

### Composer

Initial blocks: **Heading, Rich Text, Image, Button, Divider, Columns, Video**.

Support text editing, block reordering, typography, backgrounds, images, buttons, spacing, undo/redo, autosave, reload recovery, and local media persistence. Columns reflow on small screens. Email View prioritizes readable content; video degrades to a linked thumbnail. Buttons are ordinary configured links, not native RSVP workflows.

Defer galleries, arbitrary positioning, layers, snapping, advanced breakpoint overrides, animation systems, and executable user HTML/JavaScript.

### Publication

Milestone 1 supports public publication only. Show **Audience: Public** and label the action **Publish publicly**. Drafts remain unpublished; AI, autosave, and ordinary editing cannot publish. Once multiple audience types exist, new messages default to Private.

Sent/published content is immutable. Edit and repost starts a new draft and cannot change the original.

## Domain boundaries and invariants

Keep these concepts distinct without implementing every future subsystem in Milestone 1:

- **Identity / Address:** stable identities can eventually own multiple addresses.
- **Message:** author, subject, explicit audience, conversation relationships, timestamps, categories, and an immutable document snapshot reference.
- **MessageDocument / DocumentSnapshot:** canonical blocks, styling, and asset references; mutable drafts and frozen publication snapshots have distinct roles.
- **MessageUserState:** unique per `(identityId, messageId)`; coexisting `INBOX` and `SENT` labels plus read/saved state. Public bookmarks need no mailbox labels. Archive removes Inbox; receipt history or an explicit archive timestamp distinguishes archived mail from saved public content.
- **Delivery:** transport attempts, independent of social publication. Persist `SIMULATED` versus `LIVE` separately from delivery status.
- **Conversation / MessageReference:** relationships between messages, never authorization grants.

### Audiences and conversations

- Audiences are PRIVATE, PUBLIC, or GROUP. AI cannot alter recipients, groups, visibility, permissions, or publication state.
- Private recipients preserve both the addressed email and the stable internal identity resolved at send time. Historical access never transfers with later address ownership. External recipients have no internal visibility by default.
- Private access includes the author and resolved internal recipients.
- Membership in any selected group grants access to a multi-group message. Leaving removes restricted original content from access unless another selected group still grants it.
- Centralize per-message visibility checks across feeds, profiles, threads, counts, references, search, and AI context. Profiles never expose private messages.
- Conversation counts and previews are viewer-relative. Thread IDs confer no access.
- Private replies to public posts belong to separate private threads referencing the public source.
- Group replies default to the originating group. Outside a group context, select the sole eligible target, require a choice if several are eligible, and offer no group reply if none are eligible.
- URLs do not grant access. Anyone-with-the-link sharing is deferred.

### Forwarding

Forwarding requires source access when the copy is created. It starts a new private draft with no recipients and a captured snapshot. Sending requires explicit recipients. The copy has its own audience and never grants access to its source. Already-copied content is not revoked by later loss of access to the original.

### Revisions and renderers

- `schemaVersion` describes document format; `revision` describes logical document state.
- Every accepted edit increments the revision immediately, including AI application, undo, and redo. Autosave persists revisions; it does not create them. Undo never decrements the revision.
- AI proposals carry `baseDocumentId` and `baseRevision`. Stale proposals cannot silently apply. Discard or regenerate; automatic rebasing is deferred.
- One frozen document drives feed, full-page, mobile, inbox, HTML-email, plain-text, and search representations. Derived outputs may be cached but are not authoritative.
- Derive capabilities from blocks, platform configuration, and renderer support instead of independently editable flags.

## Technical direction and AI

- Retain React, TypeScript, and Vite. Add a local Node/TypeScript API server and development proxy for live AI.
- Put application behavior behind services and typed repositories. Use IndexedDB for demo data and media; UI components should not directly manipulate storage.
- Keep `OPENAI_API_KEY` and `OPENAI_MODEL` server-side. Use the OpenAI Responses API with validated structured outputs.
- First implement `POST /api/ai/compose`: instructions, document, selected block, and optional subject produce version-bound document operations and optional subject suggestions.
- Provide preview, apply, reject, and undo. Reject unsupported operations. Never generate executable user scripts or unrestricted HTML.
- Later add `POST /api/ai/search` and `POST /api/ai/categorize`. Search returns validated visible message IDs and grounded answers. Categories remain editable; classification failures cannot block publishing.
- Bind to localhost, restrict origins, bound requests and outputs, and avoid logging message bodies or credentials. Handle missing configuration, timeouts, refusals, invalid output, and rate limits explicitly, without fake AI fallback responses.
- Support local image/video uploads and HTTPS media URLs. Preserve drafts on storage or media errors. The backend must not automatically fetch arbitrary user-provided URLs.
- Browser visibility checks establish prototype behavior only. Production authorization and authorized candidate retrieval must happen on an authenticated server.

## Milestone 1 verification

The photography announcement loop is the acceptance scenario, not a collection of isolated screens.

- Build and lint pass.
- AI returns supported structured content; malformed operations, provider errors, and stale proposals preserve the draft.
- Manual edits, undo/redo, autosave, and reload recovery work.
- Absol and Email previews derive coherently from the same document at phone, tablet, and desktop sizes.
- Explicit publication produces a persistent Home item and standalone page.
- Editing a subsequent draft cannot mutate a published message.
- Verify keyboard navigation, semantic controls, visible focus, and readable contrast.

Additional implementation safeguards identified in the final review:

- Check both document ID and revision when applying AI proposals, including after switching drafts.
- Atomically persist publication and snapshot; guard duplicate publication clicks and retain recoverable drafts on failure.
- Preserve media referenced by published snapshots when later drafts replace or remove assets.

Use focused automated tests for document, revision, and publication behavior plus browser tests for the full loop. Exercise live AI when credentials are configured; report unavailable live validation accurately.

## Follow-on sequence

1. **Milestone 2 — Private messaging:** private audiences, mailbox state, Inbox/Sent, private threads, replies, forwarding, archive/save/read state, and simulated external delivery.
2. **Milestone 3 — Groups:** membership, feeds and group addresses, contextual replies, and multi-group visibility.
3. **Milestone 4 — Social graph and discovery:** following, profiles, Following, Explore, deterministic For You, trends, and suggestions.
4. **Milestone 5 — AI search and classification:** scoped search, categories, topics, and cross-audience visibility tests.
5. **Milestone 6 — Richer creation:** galleries, link cards, reusable sections, templates, and trusted interactive components. Consider freeform layout only after validating the block editor.

Real mailbox provisioning, SMTP/MIME transport, inbound email, DNS, custom domains, production authentication/authorization, spam and moderation operations, deployment, advanced recommendations, monetization, and livestream infrastructure remain outside the local prototype. The full specification preserves the longer-term roadmap.

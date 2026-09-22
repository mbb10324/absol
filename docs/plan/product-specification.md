# Absol — Smart Email as a Social Platform

## Product vision

Absol is a smart email service built around the idea that an email can be more than a traditional message.

An Absol message can simultaneously function as:

* an email
* a social post
* a conversation
* a shareable webpage
* a rich interactive document

Users receive an Absol email identity, create expressive messages with AI assistance, and choose how each message should be distributed.

A message can be:

* sent privately to one or more recipients
* published publicly
* shared with one or more groups

The same underlying message powers inbox delivery, social discovery, group feeds, public pages, external email delivery, search, and future recommendation systems.

The initial product should feel like a new communication platform rather than a traditional email client with social features added onto it.

The central product statement is:

> Absol lets you create beautiful, intelligent emails that can be sent privately or published socially.

---

# 1. Core product principles

## One message model

Absol should not maintain separate concepts for an "email" and a "social post."

Everything is a message.

What changes is:

* audience
* visibility
* delivery
* presentation

For example:

### Private message

Visible only to designated recipients.

May appear in:

* recipient inboxes
* sender's Sent folder
* private thread history
* AI search where permitted

### Public message

Visible to everyone allowed to access Absol public content.

May appear in:

* For You
* Following
* author profile
* search
* trending
* categories
* direct public URL

Publishing publicly does not create millions of inbox deliveries.

### Group message

Visible according to the group's membership and visibility rules.

May appear in:

* group feed
* member Home feeds
* search
* author profile where appropriate

---

# 2. Separate identity from email address

An Absol account should represent an identity rather than directly representing a single mailbox.

Initial users may have:

`miles@absol.test`

But the data model should support an identity owning multiple addresses later.

Example:

* `miles@absol.com`
* `hello@breman.dev`
* `contact@mycompany.com`

An identity should therefore contain:

* user ID
* handle
* display name
* profile
* avatar
* owned email addresses
* followers/following
* group memberships

An address belongs to an identity.

Initially users receive one Absol address automatically.

---

# 3. Unified namespace

Whenever possible, Absol's social and email identities should share the same namespace.

Example:

Handle:

`@miles`

Email:

`miles@absol.com`

Profile:

`absol.com/miles`

This same concept should extend naturally to groups.

Example:

Group:

`@gaming`

Address:

`gaming@absol.com`

Page:

`absol.com/gaming`

This creates a simple mental model where people, groups, and addresses all feel like part of one communication network.

---

# 4. Core application navigation

Avoid making Absol initially resemble a traditional Gmail sidebar.

Primary navigation:

* Home
* Explore
* Messages
* Groups
* Compose

Secondary navigation:

* Profile
* Settings

## Home

Home contains two primary feeds:

* For You
* Following

### For You

Public Absol messages selected from the wider network.

For the prototype, ranking can use deterministic local rules.

Later this becomes recommendation-driven.

### Following

Public messages from identities the user follows.

---

# 5. Messages

Messages represents traditional mailbox behavior.

Tabs:

* Inbox
* Sent
* Drafts
* Archived

Inbox primarily contains private messages addressed directly to the user.

Group content should not automatically flood the inbox unless a later notification/subscription model explicitly allows it.

Public posts should never automatically create inbox copies.

---

# 6. Groups

Groups combine several familiar concepts:

* communities
* mailing lists
* topic feeds
* shared inboxes
* social pages

Each group should eventually be capable of owning an Absol address.

Example:

`raleigh@absol.com`

Sending a message to that address could publish it into the group, subject to group permissions.

A group page contains:

* group identity
* description
* members
* membership controls
* message feed
* categories/topics
* group rules

Prototype behavior:

* users can discover groups
* users can join and leave groups
* members can view permitted message history
* members can publish messages
* leaving removes restricted group content from subsequent feeds and AI search

Future group permissions may include:

* public read/public post
* public read/member post
* member read/member post
* invite-only
* moderator approval

---

# 7. Message architecture

Keep the following concepts separate:

## Message

Represents communication and distribution.

Suggested fields:

```ts
interface Message {
  id: string;
  authorId: string;
  documentId: string;

  subject: string;

  audience: MessageAudience;

  threadId?: string;
  parentMessageId?: string;

  createdAt: Date;
  publishedAt?: Date;

  categoryMetadata: CategoryMetadata;

  deliveryIds: string[];
}
```

## MessageDocument

Represents content and presentation.

```ts
interface MessageDocument {
  id: string;
  schemaVersion: number;

  theme: DocumentTheme;

  blocks: DocumentBlock[];

  assetIds: string[];

  capabilities: DocumentCapabilities;
}
```

## Delivery

Represents how a message leaves Absol or reaches a recipient.

```ts
interface Delivery {
  id: string;
  messageId: string;

  type:
    | "ABSOL_INTERNAL"
    | "SMTP";

  recipient: string;

  status:
    | "PENDING"
    | "DELIVERED"
    | "FAILED";

  deliveredAt?: Date;
}
```

This separation prevents SMTP from becoming entangled with the social architecture.

A public message may have zero SMTP deliveries.

---

# 8. Audience model

Every message has an explicit audience.

```ts
type MessageAudience =
  | {
      type: "PRIVATE";
      recipients: string[];
    }
  | {
      type: "PUBLIC";
    }
  | {
      type: "GROUP";
      groupIds: string[];
    };
```

The initial prototype should default to Private.

Audience selection must always remain under explicit user control.

AI should never silently change:

* recipients
* visibility
* groups
* publishing state

---

# 9. Conversations instead of comments

Absol should build around conversations rather than cloning traditional social comments.

Every response is another message.

A message may be replied to through different channels depending on permissions.

For example:

Public message:

> I just launched my new project.

Available actions could include:

* Reply privately
* Reply publicly
* Forward
* Save

A group message might allow:

* Reply to sender
* Reply to group
* Reply privately

This creates a model that feels native to email while still producing social discussions.

Thread relationships should therefore exist in the core Message schema from the beginning.

---

# 10. Social interactions

Avoid automatically copying every conventional social network interaction.

Primary Absol interactions should initially revolve around email concepts:

* Reply
* Forward
* Save
* Follow
* Subscribe

A lightweight appreciation/reaction system can still exist.

For example:

* Appreciate
* reactions

But the product should prioritize conversation rather than engagement mechanics.

---

# 11. Composer philosophy

The composer is one of Absol's most important product surfaces.

It should feel considerably more powerful than a traditional rich-text editor without immediately attempting to become Figma.

Initial target:

**Notion + Substack + Canva**

rather than:

**Figma inside Gmail**

Use a block-based editor with extensive visual customization.

---

# 12. Document blocks

Initial supported blocks should include:

* heading
* paragraph
* rich text
* image
* image gallery
* video
* button
* quote
* divider
* spacer
* columns
* link preview
* embed placeholder

Each block can support properties such as:

* width
* alignment
* padding
* margin
* background
* border
* border radius
* typography
* text color
* block color
* spacing

This provides powerful visual design without requiring full freeform positioning immediately.

---

# 13. Advanced layout later

Design the document schema so that future Absol versions can introduce an Advanced Layout Mode.

Advanced Mode may eventually support:

* drag anywhere
* resize handles
* absolute positioning
* layers
* overlap
* snapping
* alignment tools
* reusable sections
* canvas zoom
* breakpoint-specific layouts

The first prototype does not need to implement all of this.

The architecture should merely avoid making it impossible later.

---

# 14. Safe interactive components

Absol messages should eventually behave like miniature applications without allowing arbitrary user JavaScript.

Do not allow executable HTML or unrestricted scripts.

Instead, Absol should expose trusted interactive components.

Examples:

* poll
* RSVP
* countdown
* map
* calendar event
* form
* music player
* product card
* carousel
* donation card
* gallery
* video player
* livestream
* booking widget

These components are rendered and controlled by Absol.

Example capability definition:

```ts
interface DocumentCapabilities {
  richText: boolean;
  images: boolean;
  video: boolean;
  embeds: boolean;
  interactiveComponents: boolean;
  arbitraryScripts: false;
}
```

This gives users app-like power while preserving platform security.

---

# 15. Canonical document model

A message should own exactly one canonical Absol document.

Everything else should derive from that document.

The same source document generates:

* feed card
* full Absol page
* desktop Absol view
* mobile Absol view
* conventional HTML email
* plain-text email
* search text
* AI context
* preview

Avoid storing independent copies for each format.

---

# 16. Absol View vs Email View

This distinction should become a major Absol product concept.

## Absol View

The full rich experience.

May support:

* responsive layouts
* embedded video
* galleries
* interactive components
* polls
* animations
* rich typography
* advanced media
* future livestreams

## Email View

A compatible HTML representation designed for conventional email clients.

Unsupported features degrade gracefully.

Example:

### Video

Absol:

Embedded playable video.

External email:

Thumbnail + "Watch Video on Absol"

### Poll

Absol:

Interactive poll controls.

External email:

"Vote on Absol"

### Interactive gallery

Absol:

Full carousel.

External email:

Static image grid linking to the Absol page.

---

# 17. Shareable pages

Every public or share-enabled message should eventually have a permanent URL.

Example:

`absol.com/miles/abc123`

This means the same content can operate as:

* email
* social post
* newsletter
* microsite
* landing page
* invitation
* announcement
* portfolio piece
* photo album

This capability should influence the architecture even if public URLs in the prototype remain local routes.

---

# 18. AI philosophy

AI should be a native part of Absol rather than a chatbot attached to the composer.

AI should understand:

* message content
* document structure
* blocks
* visual hierarchy
* style
* audience context
* search context
* categories

AI should operate on structured Absol documents rather than generating arbitrary HTML.

---

# 19. AI composer

Users should be able to ask Absol things like:

> Create a birthday invitation using these three photos.

> Turn these notes into a clean company announcement.

> Make this look more professional.

> Make this look like a premium product launch.

> Make the layout less busy.

> Turn this into a visual newsletter.

> Improve this for mobile.

> Rewrite this section but leave everything else alone.

The model should return structured document operations or a proposed updated document.

Example:

```json
{
  "operations": [
    {
      "type": "updateTheme"
    },
    {
      "type": "insertBlock"
    },
    {
      "type": "reorderBlocks"
    },
    {
      "type": "updateTypography"
    }
  ]
}
```

AI-generated changes should always support:

* preview
* apply
* reject
* undo

---

# 20. AI safety boundaries

AI may modify:

* wording
* subject suggestions
* document blocks
* styling
* block ordering
* layouts
* categories

AI must not modify without explicit user action:

* recipients
* groups
* public/private status
* publication state
* account permissions
* subscriptions

An AI operation must never silently convert a private message into a public one.

---

# 21. AI search

Absol should support advanced natural-language search from the beginning.

Users may eventually ask:

> Find the message where Sarah recommended a restaurant in Raleigh.

> What did the engineering group decide about the launch date?

> Show me everything John sent about Kubernetes last month.

Search should use only content the current user is authorized to view.

The prototype should support scope selection such as:

* Inbox
* Public
* Following
* Group
* Everything visible

AI search results should return validated Absol message IDs.

The model should never be trusted to invent message references.

---

# 22. AI categorization

Automatic categorization should be treated as infrastructure rather than merely a visible feature.

Each message can gain metadata such as:

```ts
interface CategoryMetadata {
  categories: string[];
  topics: string[];
  contentType: string;
  language: string;
}
```

Examples:

```json
{
  "categories": ["gaming"],
  "topics": ["world-of-warcraft", "discipline-priest"],
  "contentType": "video",
  "language": "en"
}
```

Users should be able to edit AI-generated categories.

Categorization failure must never prevent sending or publishing.

---

# 23. Why categorization matters

This metadata eventually powers:

* For You
* search
* trending
* recommendations
* category feeds
* topic pages
* related content
* moderation
* content understanding

Later feeds may include:

* Video
* Photos
* Shorts
* Music
* Gaming
* Local
* News
* Technology

These should remain alternate views over the same underlying message system.

Avoid introducing separate content models for every media category.

---

# 24. Explore

Explore should eventually surface:

* trending messages
* suggested accounts
* categories
* groups
* trending topics

For the prototype, use deterministic local scoring.

Example ranking factors:

* recent message
* reaction count
* reply count
* fictional engagement metadata

Personalized recommendation models belong to later milestones.

---

# 25. Profiles

Profiles should contain:

* display name
* handle
* Absol address
* avatar
* biography
* follow button
* public message history
* joined/public groups where appropriate

Public profile content should consist of messages the viewer is authorized to see.

Private messages must never appear on a profile.

---

# 26. Follow system

Following controls the Following feed.

Following someone does not:

* subscribe the user to private email
* grant access to private messages
* override group permissions

It simply means:

> Show me this person's public messages.

---

# 27. Drafts

Drafts are important because rich Absol messages may take significant time to create.

The prototype should support:

* automatic saving
* manual save
* reload recovery
* document versioning
* undo/redo

AI proposals should be generated against a known document version.

If the document changes before the AI result returns, Absol should prevent the stale AI result from silently overwriting newer edits.

---

# 28. Media handling

Prototype support:

* local image upload
* local video upload
* HTTPS image/video URLs

Uploaded assets should persist in IndexedDB.

Media errors should never destroy the document draft.

The application should reject unsupported files cleanly.

The backend should not automatically fetch arbitrary user-provided URLs.

---

# 29. Prototype technical architecture

Retain:

* React
* TypeScript
* Vite

Add a local Node/TypeScript API server.

Suggested application layers:

```text
React UI

Application State

Message Service
Identity Service
Group Service
Feed Service
Search Service
Document Service

Repository Interfaces

IndexedDB Repository
```

The UI should not directly manipulate IndexedDB.

This makes replacement with a production API considerably easier later.

---

# 30. Repository abstraction

Create typed repository interfaces for:

* identities
* addresses
* messages
* documents
* deliveries
* groups
* memberships
* follows
* assets
* drafts

The local prototype uses IndexedDB implementations.

Production can later replace these with API-backed repositories.

---

# 31. Visibility service

Create one centralized authorization/visibility service.

Every feature should ask the same service whether the current identity may see a particular message.

This must be reused by:

* Home
* Explore
* profiles
* groups
* search
* AI context
* threads
* replies

Do not allow individual screens to independently invent their own visibility logic.

---

# 32. Prototype AI API

Use a server-side OpenAI integration.

Never expose the API key in the browser.

Environment variables:

* `OPENAI_API_KEY`
* `OPENAI_MODEL`

Initial routes:

```text
POST /api/ai/compose
POST /api/ai/search
POST /api/ai/categorize
```

## `/api/ai/compose`

Input:

* user instruction
* current document
* optional selected block
* optional subject

Output:

* proposed document operations
* optional subject suggestion

## `/api/ai/search`

Input:

* natural-language query
* search scope
* authorized candidate messages

Output:

* ranked validated message IDs
* short explanations
* grounded response

## `/api/ai/categorize`

Input:

* message text
* structured content summary

Output:

* suggested categories
* topics
* content type

---

# 33. AI backend protections

The local server should:

* bind to localhost
* restrict allowed origins
* limit request size
* limit AI response size
* validate structured responses
* reject unknown document operations
* avoid logging message bodies
* never log API credentials
* handle provider failures explicitly

Handle:

* missing API key
* timeout
* refusal
* invalid response
* rate limits
* malformed operations

Never substitute fake AI output when live AI fails.

---

# 34. Demo onboarding

Because real authentication and mailbox creation are outside the first milestone, onboarding should simulate identity creation.

Example:

Choose:

* display name
* handle

System creates:

`handle@absol.test`

Seed the environment with fictional identities, groups, messages, conversations, and designed messages.

Provide a Reset Demo option.

Clearly label the prototype as a development environment.

---

# 35. Simulated external delivery

Users should be able to enter outside email addresses.

Example:

`friend@gmail.com`

The prototype should create a Delivery record and place the message in Sent.

Display:

`Simulated external delivery`

Do not actually send SMTP email during this milestone.

Real SMTP/MIME delivery belongs to a later phase.

---

# 36. Initial message actions

Private message:

* Reply
* Forward
* Save
* Archive
* Mark unread

Public message:

* Reply publicly
* Reply privately
* Forward
* Save
* Appreciate
* Follow author

Group message:

* Reply to group
* Reply privately
* Forward
* Save
* Appreciate

Available actions should be derived from permissions rather than hardcoded per screen.

---

# 37. Phase 1 prototype scope

The first milestone should prove six fundamental experiences.

## 1. Absol identity

Users create a local identity and receive:

`username@absol.test`

## 2. Beautiful composer

Users create visually expressive messages using structured blocks.

## 3. Audience selection

Every message can be:

* Private
* Public
* Group

## 4. Unified rendering

A single canonical document renders correctly as:

* feed card
* full Absol page
* inbox message
* mobile view
* conventional email preview

## 5. Social discovery

Users can navigate:

* For You
* Following
* Groups
* profiles

## 6. Native AI creation

AI can materially modify and create structured Absol documents.

If these six things feel compelling, the product concept has been meaningfully validated.

---

# 38. Phase 1 implementation order

## Stage 1 — Foundation

* fix existing build issues
* define shared TypeScript domain types
* create repository abstraction
* implement IndexedDB storage
* implement application state
* create visibility service
* seed fictional data

## Stage 2 — Identity and navigation

* local onboarding
* Absol address creation
* Home
* Explore
* Messages
* Groups
* Profile
* Settings

## Stage 3 — Messaging

* message creation
* private audience
* public audience
* group audience
* Inbox
* Sent
* Drafts
* archive
* threads
* private/public replies

## Stage 4 — Composer

* block editor
* typography controls
* backgrounds
* images
* video
* galleries
* buttons
* columns
* templates
* undo/redo
* autosave

## Stage 5 — Rendering

* canonical renderer
* feed renderer
* full-page renderer
* mobile renderer
* external-email renderer
* plain-text renderer

## Stage 6 — Social layer

* follows
* Following feed
* For You
* profiles
* groups
* group feeds
* lightweight reactions
* trending/suggested demo logic

## Stage 7 — AI

* compose assistant
* rewrite assistant
* design/layout assistant
* AI categorization
* AI search
* proposal preview/apply flow

## Stage 8 — Verification

* browser tests
* permissions testing
* draft recovery
* AI failure handling
* responsive layout testing
* keyboard navigation
* accessibility review

---

# 39. Templates

Ship several starter templates to demonstrate what Absol messages can become.

Examples:

### Simple Message

Traditional clean email.

### Announcement

Hero heading, large visual, call-to-action.

### Newsletter

Header, sections, images, links.

### Photo Story

Large imagery and captions.

### Invitation

Event details and RSVP placeholder.

### Product Launch

Hero visual, feature sections, CTA.

Templates should simply create normal Absol documents.

They should not introduce special document formats.

---

# 40. Acceptance tests

## Audience

Verify:

* private messages are only visible to allowed recipients
* public messages appear publicly
* group messages respect group membership
* leaving a restricted group removes future access
* AI search cannot access hidden messages
* profiles never expose private messages

## Messaging

Verify:

* private replies remain private
* public replies appear within public conversations
* group replies follow group permissions
* forwarding creates correct distribution behavior
* Sent records are created

## Composer

Verify:

* block creation
* block deletion
* block reordering
* rich text
* images
* video
* backgrounds
* templates
* undo
* redo
* autosave
* reload recovery

## Rendering

Verify the same canonical document renders coherently in:

* desktop Absol view
* mobile Absol view
* feed card
* inbox
* email preview
* plain text

## AI

Verify:

* AI can create structured documents
* AI can rewrite individual blocks
* AI can suggest layout changes
* AI cannot alter audience
* stale AI proposals cannot overwrite newer edits
* unknown operations are rejected
* invalid message IDs from AI search are ignored
* categorization failures do not block publishing

## Persistence

Verify:

* identities persist
* groups persist
* follows persist
* messages persist
* drafts persist
* uploaded assets persist

---

# 41. Accessibility and responsive behavior

The prototype should support:

* keyboard navigation
* semantic HTML
* labeled controls
* focus states
* sufficient contrast
* screen-reader friendly navigation

Validate layouts at:

* mobile
* tablet
* desktop

Blocks should naturally reflow on mobile rather than relying on arbitrary desktop coordinates.

---

# 42. Explicit prototype exclusions

Do not build during this milestone:

* real mailbox provisioning
* SMTP delivery
* inbound internet email
* DNS configuration
* custom domains
* real authentication
* production authorization
* production moderation
* large-scale recommendation models
* advertising systems
* livestream infrastructure
* arbitrary JavaScript
* unrestricted HTML
* creator monetization
* production deployment

These should not influence the milestone enough to slow validation of the core concept.

---

# 43. Future roadmap

## Phase 2 — Real email

Introduce:

* production accounts
* mailbox provisioning
* SMTP delivery
* inbound email
* MIME parsing
* deliverability infrastructure
* spam filtering
* custom domains
* external email threading

At this point Absol becomes a true email provider.

## Phase 3 — Social intelligence

Introduce:

* personalized For You ranking
* trending topics
* suggested identities
* suggested groups
* semantic recommendations
* category feeds
* advanced moderation

## Phase 4 — Interactive Absol

Introduce trusted components such as:

* polls
* RSVP
* forms
* maps
* events
* music
* products
* interactive galleries

This is where messages increasingly resemble small applications.

## Phase 5 — Media platform

Introduce specialized views over the same message ecosystem:

* Videos
* Images
* Shorts
* Music
* Gaming
* Local
* News

Do not create fundamentally separate content systems unless technically necessary.

## Phase 6 — Live communication

Potentially introduce:

* livestreams
* live events
* live group conversations
* premieres
* live audience interaction

---

# 44. Long-term product opportunity

The most powerful version of Absol is not simply:

> social media built around email.

It becomes a universal communication and publishing layer.

A single Absol document could function as:

* an email
* a social post
* a newsletter
* a webpage
* a community discussion
* an invitation
* a product announcement
* a video post
* a photo album
* a lightweight application

The recipient decides where they encounter it.

An external recipient gets a graceful conventional email.

An Absol user gets the complete interactive experience.

That creates the possibility of a natural network effect:

**Emails are useful outside Absol, but better inside Absol.**

---

# 45. Prototype success criteria

The prototype succeeds if a new user can perform this workflow and immediately understand why Absol is different:

1. Create `name@absol.test`.
2. Open Compose.
3. Ask AI to create a visually rich message.
4. Modify the generated document manually.
5. Preview how it appears inside Absol.
6. Preview how it degrades to normal email.
7. Send it privately, publish it publicly, or share it with a group.
8. See the same underlying message naturally appear in the correct feeds, inboxes, profile, group, and conversation.
9. Discover other messages through For You, Following, groups, and AI search.

If that flow feels cohesive and impressive, Absol has successfully demonstrated its core product thesis.

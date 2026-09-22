# Absol — Architecture Clarifications

These clarifications amend the existing Absol product specification and should be considered part of the implementation contract.

---

# 1. Separate messages from mailbox state

A `Message` represents the shared communication object.

User-specific mailbox behavior must not live on the message itself.

Introduce a separate model:

```ts
interface MailboxEntry {
  id: string;

  identityId: string;
  messageId: string;

  location:
    | "INBOX"
    | "SENT"
    | "ARCHIVE";

  isRead: boolean;
  isSaved: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

This owns user-specific state such as:

* read/unread
* inbox placement
* sent placement
* archived state
* saved state

A recipient marking a message as read must not change its state for another recipient.

Likewise:

* one recipient may archive a message
* another may leave it in Inbox
* the sender retains their Sent entry

These actions affect `MailboxEntry`, not `Message`.

---

# 2. Private-message visibility

The author of a private message always retains access to the message.

Therefore private visibility should conceptually be:

```text
author OR explicit recipient
```

not merely:

```text
explicit recipient
```

Example:

```ts
function canViewPrivateMessage(
  identityId: string,
  message: Message
) {
  return (
    identityId === message.authorId ||
    message.audience.recipients.includes(identityId)
  );
}
```

The actual implementation should use the centralized visibility service rather than duplicating this logic.

---

# 3. Message, mailbox, delivery, and document responsibilities

The domain should maintain four distinct concepts.

## Message

Defines:

* author
* subject
* audience
* conversation relationships
* timestamps
* categorization
* immutable document revision used by the message

## MessageDocument

Defines:

* blocks
* visual styling
* assets
* document schema

## MailboxEntry

Defines:

* which mailbox contains the message
* read/unread state
* archive state
* saved state

## Delivery

Defines an attempt to deliver content through a transport.

Examples:

```text
ABSOL_INTERNAL
SMTP
```

A social publication does not require thousands of Delivery records.

---

# 4. Conversations do not grant visibility

A `threadId` represents a conversational relationship.

It does **not** represent an authorization boundary.

Every message inside a conversation retains its own audience.

Every message must therefore pass an independent visibility check.

This applies everywhere, including:

* thread views
* previews
* reply counts
* notifications
* profile activity
* search
* AI context

A viewer may therefore see only part of a conversation.

Example:

```text
PUBLIC MESSAGE
    |
    |--- Public Reply A
    |
    |--- Private Reply B
    |
    |--- Public Reply C
```

A random Absol user sees:

```text
Public Message
Public Reply A
Public Reply C
```

The author and private respondent may additionally see Private Reply B.

---

# 5. Public replies

Replying publicly to a public message creates another public message.

The new message:

* belongs to the conversation
* references its parent
* has `PUBLIC` audience

Example:

```ts
{
  threadId: original.threadId,
  parentMessageId: original.id,
  audience: {
    type: "PUBLIC"
  }
}
```

---

# 6. Private replies to public messages

A private reply must not simply insert a private message into the public discussion as though everyone can see it.

Instead, choosing:

**Reply privately**

creates or enters a private conversation between the appropriate identities.

The private message may retain a reference to the originating public message.

Example:

```ts
interface MessageReference {
  messageId: string;
  relationship:
    | "REPLY_TO"
    | "FORWARDED_FROM"
    | "REFERENCES";
}
```

The interface may show:

> In response to "My New Project"

with a safe preview of the referenced public content.

The resulting private conversation has its own thread.

---

# 7. Group replies

A group message can potentially belong to multiple groups.

Example:

```ts
audience: {
  type: "GROUP",
  groupIds: [
    "gaming",
    "world-of-warcraft"
  ]
}
```

Access uses OR semantics:

```text
membership in any selected group grants access
```

However, replies must preserve the context from which the user initiated the reply.

If the user opens the message inside:

```text
@gaming
```

and selects:

**Reply to group**

the reply defaults to:

```text
@gaming
```

It must not automatically send to:

```text
@gaming + @world-of-warcraft
```

The user can explicitly add another group if desired.

This prevents accidental cross-posting.

---

# 8. Conversation counts must be viewer-relative

The UI must not expose hidden conversation activity.

For example, a public message must not show:

```text
12 replies
```

if the viewer is only authorized to see 7 of them.

Displayed counts must reflect content visible to the current identity.

The same principle applies to:

* thread previews
* recent responders
* AI summaries
* search snippets
* notifications

---

# 9. Forwarding

Forwarding is a distribution action, not a visibility shortcut.

For the prototype:

**Forward** creates a new private draft.

The new draft contains:

* an immutable snapshot of the forwarded content
* a reference to the original message where allowed
* no recipients initially

The user must explicitly choose recipients.

Forwarding must never automatically change restricted content into public content.

Example flow:

```text
Forward
   ↓
New Private Draft
   ↓
Choose Recipients
   ↓
Send
```

---

# 10. Forward snapshots

The forwarded content should be captured when the forward draft is created.

This prevents future edits or deletions of the original from unexpectedly altering the forwarded message.

Example:

```ts
interface ForwardedContent {
  sourceMessageId?: string;

  snapshot: {
    authorDisplayName: string;
    subject: string;
    content: MessageDocumentSnapshot;
    sentAt: Date;
  };
}
```

Access to the original message and ownership of the copied snapshot are separate concerns.

---

# 11. Public links

Public messages may have public Absol URLs.

Example:

```text
absol.com/miles/abc123
```

Anyone permitted to view public Absol content can open them.

Private and group message URLs do not change their access rules.

Knowing the URL does not grant authorization.

Example:

```text
absol.com/message/xyz123
```

still requires:

```text
visibilityService.canView(...)
```

Defer:

```text
Anyone with the link
```

sharing until a later milestone.

That would introduce a fourth audience model and should be designed intentionally.

---

# 12. Schema version vs document revision

These are separate concepts.

## schemaVersion

Describes the structure of the document format.

Example:

```ts
schemaVersion: 2
```

means the document conforms to version 2 of the Absol document schema.

This is used for:

* migrations
* compatibility
* renderer behavior

## revision

Represents a version of a particular document.

Example:

```ts
revision: 17
```

means the user has produced seventeen saved revisions of this document.

This is used for:

* autosave
* conflict detection
* AI proposal validation
* publishing snapshots

---

# 13. Draft document model

A working draft can contain:

```ts
interface MessageDocument {
  id: string;

  schemaVersion: number;
  revision: number;

  theme: DocumentTheme;
  blocks: DocumentBlock[];

  assetIds: string[];

  createdAt: Date;
  updatedAt: Date;
}
```

Every successful edit increments the document revision.

---

# 14. AI proposal revisions

Every AI operation must identify the revision it was generated against.

Example:

```ts
interface AIComposeProposal {
  baseDocumentId: string;
  baseRevision: number;

  operations: DocumentOperation[];
}
```

Suppose AI starts processing:

```text
revision 12
```

while the user continues editing and reaches:

```text
revision 15
```

The AI response must not silently apply to revision 15.

The UI should instead indicate that the proposal was generated against an older version.

Possible actions:

* discard
* preview against old revision
* regenerate using current content

Future implementations may support intelligent rebasing, but the prototype does not need it.

---

# 15. Sending and publishing freeze a revision

A sent or published message must reference an immutable document snapshot.

Example:

```ts
interface Message {
  id: string;

  documentSnapshotId: string;

  // ...
}
```

Once sent:

```text
Message A
     ↓
Document Revision 17
```

Revision 17 becomes immutable for that message.

If the author chooses:

**Edit and repost**

Absol creates a new draft based on Revision 17.

Changes to that draft do not modify the original message.

This applies equally to:

* private messages
* public publications
* group publications

---

# 16. Canonical source of truth

Immutability does not mean storing separate independent versions for:

* feed
* mobile
* inbox
* external email

All renderings still derive from the same frozen Absol document snapshot.

Example:

```text
Document Snapshot
       |
       |-- Absol Renderer
       |
       |-- Feed Renderer
       |
       |-- Mobile Renderer
       |
       |-- HTML Email Renderer
       |
       └-- Plain Text Renderer
```

Generated representations may later be cached for performance.

They are not authoritative sources.

---

# 17. Delivery environment

Delivery status must distinguish simulated prototype behavior from actual transport delivery.

For example:

```ts
type DeliveryEnvironment =
  | "SIMULATED"
  | "LIVE";
```

A prototype external delivery might contain:

```ts
{
  type: "SMTP",
  environment: "SIMULATED",
  status: "DELIVERED"
}
```

This means:

> The simulation succeeded.

It does not claim that Gmail or another mail server received anything.

The interface can display:

```text
Simulated delivery
```

but the distinction must exist in stored data as well.

---

# 18. Document capabilities

Do not store user-editable capability booleans that can drift away from the actual document.

Instead, capabilities should primarily be derived from:

* supported block types
* platform configuration
* renderer capabilities

For example:

```ts
const documentCapabilities =
  capabilityService.forDocument(document);
```

If the document contains a Video block:

```text
Absol Renderer:
VIDEO_PLAYBACK = supported

Email Renderer:
VIDEO_PLAYBACK = fallback
```

The capability system describes what Absol and each renderer can do.

It should not become another independent piece of content state.

---

# 19. Prototype security boundary

The centralized `VisibilityService` establishes consistent behavior inside the browser prototype.

It does not constitute production authorization.

In the local demo:

```text
Browser
   ↓
Determines visible candidates
   ↓
Local AI server
```

The AI server may trust those candidates only because the entire application is explicitly a single-user development prototype.

This assumption must be documented.

---

# 20. Production security model

Production architecture must instead resemble:

```text
User Request
     ↓
Authenticated Server
     ↓
Authorization
     ↓
Authorized Data Retrieval
     ↓
AI Processing
```

The client must never be trusted to tell the server:

> These are all the messages I am allowed to see.

The server must determine that itself.

The same rule will eventually apply to:

* search
* groups
* profiles
* feeds
* notifications
* AI
* attachments

---

# 21. Revised first milestone

Do not build every navigation surface before testing Absol's central experience.

The earliest usable vertical slice should prove:

```text
Identity
   ↓
AI Compose
   ↓
Manual Edit
   ↓
Absol Preview
   ↓
Email Preview
   ↓
Publish
   ↓
Open Published Message
```

This should happen before substantial investment in broader social features.

---

# 22. Milestone 1 — The Absol Loop

Build exactly one polished end-to-end workflow.

## Identity

Use one seeded or locally created Absol identity:

```text
miles@absol.test
```

## Composer

Initial block support:

* heading
* rich text
* image
* button
* divider
* simple columns
* video

Video includes email degradation behavior.

## AI creation

Users can enter something like:

> Create a launch announcement for my new photography website. Use this image as the hero and add a button to visit it.

AI constructs a structured Absol document.

## Manual editing

The user can:

* edit text
* reorder blocks
* change typography
* change backgrounds
* edit images
* modify buttons
* adjust spacing

## Preview

Provide:

```text
Absol View | Email View
```

The difference should be immediately understandable.

## Publish

Initial publishing may support only:

```text
PUBLIC
```

for this first thin slice.

## Result

The user sees the published message:

* in Home
* on its standalone Absol page
* rendered from the frozen document revision

This proves the core product thesis.

---

# 23. Milestone 2 — Private messaging

Once the Absol Loop works well, add:

* PRIVATE audience
* Inbox
* Sent
* MailboxEntry
* private threads
* Reply
* Forward
* Archive
* Save
* read/unread

This establishes Absol as an actual communication product rather than merely a publishing tool.

---

# 24. Milestone 3 — Groups

Add:

* groups
* membership
* group feeds
* group addresses
* group audience
* contextual replies
* multi-group visibility

Explicitly test:

```text
GROUP [A, B]
```

with identities that belong to:

* A only
* B only
* both
* neither

---

# 25. Milestone 4 — Social graph and discovery

Add:

* following
* profiles
* Following feed
* Explore
* deterministic For You
* trending
* suggested accounts
* suggested groups

Do not build sophisticated personalization yet.

---

# 26. Milestone 5 — AI search and classification

Once meaningful content exists in different visibility domains, add:

* AI search
* keyword search
* categories
* topics
* automatic content classification

This milestone should explicitly test authorization across:

* public messages
* private messages
* groups
* mixed-visibility conversations

---

# 27. Milestone 6 — Richer creation

Expand the editor with:

* galleries
* quotes
* link cards
* reusable sections
* templates
* more typography
* richer backgrounds
* interactive Absol components

Only after the block editor proves successful should Absol consider introducing:

**Advanced Layout Mode**

with freeform positioning.

---

# 28. First editor scope

The initial composer should intentionally remain small.

Version one blocks:

```text
Heading
Rich Text
Image
Button
Divider
Columns
Video
```

These seven elements are enough to prove that Absol documents can significantly exceed traditional emails.

Avoid initially spending time on:

* galleries
* embeds
* layer panels
* arbitrary positioning
* snapping
* advanced responsive overrides
* animation systems

Those are expansion features.

---

# 29. Updated domain relationships

The prototype should conceptually center around:

```text
Identity
   |
   | owns
   ↓
Address


Identity
   |
   | authors
   ↓
Message
   |
   | references immutable
   ↓
Document Snapshot


Message
   |
   | creates per-user state
   ↓
MailboxEntry


Message
   |
   | may generate
   ↓
Delivery


Message
   |
   | belongs to
   ↓
Conversation


Message
   |
   | has
   ↓
Audience
```

These concepts should remain distinct even when the initial implementation stores them locally.

---

# 30. Core invariants

The following should be treated as architectural rules.

### Invariant 1

A message's audience never changes implicitly.

### Invariant 2

AI cannot alter an audience.

### Invariant 3

Being in the same conversation does not imply equal visibility.

### Invariant 4

Every message receives its own authorization decision.

### Invariant 5

Mailbox state belongs to a user, not a message.

### Invariant 6

Sent and published document revisions are immutable.

### Invariant 7

Forwarding never bypasses the original visibility model.

### Invariant 8

A URL never grants access by itself.

### Invariant 9

The same canonical document drives all renderers.

### Invariant 10

Production authorization occurs server-side.

---

# 31. Revised prototype success test

The first major product checkpoint should be extremely simple.

Give a new user a blank composer.

They type:

> Make a visually impressive invitation for my son's birthday. Use this photo, tell everyone it's Saturday at 2 PM, and include an RSVP button.

Absol creates the document.

The user modifies it manually.

They toggle:

```text
Absol View
Email View
```

and immediately understand why the Absol version is richer.

They publish it.

They open:

```text
absol.com/miles/...
```

and see that the email they just created is simultaneously a polished webpage and social object.

If that experience feels genuinely different from writing something in Gmail, Outlook, Substack, or a conventional social network, the central Absol product thesis has been validated.

Everything else can grow outward from that primitive.

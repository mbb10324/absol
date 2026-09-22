# Absol — Final Milestone 1 Architecture Amendments

These amendments supersede the corresponding details in the current architecture specification. No broader architectural redesign is required before implementing Milestone 1.

## 1. Mailbox state uses coexisting labels

A user's relationship to a message must support multiple mailbox states simultaneously.

Use one unique record per:

```text
(identityId, messageId)
```

rather than separate entries for Inbox, Sent, Archive, etc.

```ts
interface MessageUserState {
  identityId: string;
  messageId: string;

  mailboxLabels: MailboxLabel[];

  isRead: boolean;
  isSaved: boolean;

  createdAt: Date;
  updatedAt: Date;
}

type MailboxLabel =
  | "INBOX"
  | "SENT";
```

The combination of labels is allowed.

For example, sending a private message to yourself may produce:

```ts
mailboxLabels: ["INBOX", "SENT"]
```

### Archive behavior

Archive is not a mutually exclusive mailbox location.

Archiving a received message removes its `INBOX` label.

The Archived view is derived from received messages that:

* are visible to the identity
* previously belonged to their mailbox
* no longer have the `INBOX` label

If implementation simplicity requires it, an `archivedAt` timestamp may also be stored explicitly.

### Saved behavior

Saving is independent of mailbox placement.

A public post can therefore have:

```ts
mailboxLabels: [];
isSaved: true;
```

without pretending that the post belongs to the user's Inbox or Sent folder.

---

## 2. Addressed recipients and authorized identities are separate

Private-message addressing must preserve both:

1. the address that was entered
2. the stable Absol identity resolved at send time

Do not authorize historical messages based on current ownership of an email address.

Suggested structure:

```ts
interface PrivateRecipient {
  address: string;

  resolvedIdentityId?: string;

  type:
    | "ABSOL_INTERNAL"
    | "EXTERNAL";
}
```

A private audience becomes:

```ts
interface PrivateAudience {
  type: "PRIVATE";
  recipients: PrivateRecipient[];
}
```

### Internal Absol recipient

If:

```text
jane@absol.com
```

belongs to identity:

```text
identity_123
```

when the message is sent, persist both:

```ts
{
  address: "jane@absol.com",
  resolvedIdentityId: "identity_123",
  type: "ABSOL_INTERNAL"
}
```

Authorization uses:

```text
resolvedIdentityId
```

not current address ownership.

### External recipient

For:

```text
person@gmail.com
```

the record may remain:

```ts
{
  address: "person@gmail.com",
  resolvedIdentityId: undefined,
  type: "EXTERNAL"
}
```

External recipients have no internal Absol visibility unless some later product mechanism explicitly creates it.

### Historical ownership

If an Absol address is later renamed, released, transferred, or attached to another identity, historical private-message access does not transfer with it.

Private authorization is based on the identity resolved when the message was sent.

---

## 3. Forwarding creates a new communication object

Replace the previous forwarding invariant with:

> Forwarding requires access to the source when the forwarded copy is created. The forwarded copy has its own explicit audience and never grants access to the original.

The forwarding flow is:

```text
Authorized viewer
      ↓
Forward
      ↓
Snapshot source content
      ↓
Create new PRIVATE draft
      ↓
Explicitly choose recipients
      ↓
Send new message
```

The new message owns its own:

* message ID
* audience
* immutable document snapshot
* mailbox state
* delivery records

It may retain metadata such as:

```ts
{
  relationship: "FORWARDED_FROM",
  sourceMessageId: "..."
}
```

but access to that source must still be independently authorized.

### Important consequence

Suppose a member of a private group forwards a group message to another person.

Later, the forwarding user leaves the group.

They may lose access to the original group message.

The already-sent forwarded snapshot remains part of the new private message and is not revoked.

The forward is a copied communication, not delegated access to the original.

---

## 4. Milestone 1 publication is explicitly public

Milestone 1 temporarily supports only public publication because private messaging is introduced in Milestone 2.

This does not change Absol's long-term rule that new messages should default to Private once multiple audience types exist.

The Milestone 1 interface must explicitly identify the action as:

**Publish publicly**

rather than simply:

**Send**

or:

**Publish**

The composer should visibly display:

```text
Audience: Public
```

before publication.

A draft remains unpublished until the user intentionally invokes:

**Publish publicly**

AI cannot invoke this action.

AI cannot change publication state.

Manual editing cannot implicitly publish.

Autosave cannot publish.

---

## 5. Revised Milestone 1 success scenario

Use a clearly public use case for the initial vertical slice.

Example user request:

> Create a launch announcement for my new photography website. Use this image as the hero, briefly introduce the site, and add a button that links to it.

Expected flow:

```text
Local Absol Identity
        ↓
AI Generates Structured Document
        ↓
Manual Editing
        ↓
Absol View
        ↓
Email View
        ↓
Publish Publicly
        ↓
Public Absol Page
```

The result should demonstrate:

* visually rich document creation
* AI-assisted layout and writing
* manual block editing
* graceful email degradation
* immutable publication
* public feed rendering
* standalone Absol rendering

A configured button is an ordinary link in Milestone 1.

Interactive components such as native RSVP behavior remain future functionality.

---

## 6. Private responses do not belong to public threads

A private response to a public message starts or joins a separate private conversation.

The relationship should look conceptually like:

```text
PUBLIC THREAD

Public Message A
      ↓
Public Reply B
      ↓
Public Reply C


         reference
             ↑
             |
PRIVATE THREAD

Private Message D
      ↓
Private Reply E
```

`Private Message D` may contain:

```ts
{
  relationship: "REFERENCES",
  messageId: "public-message-a"
}
```

but it does not share the public thread's authorization boundary.

Therefore:

```text
publicThreadId !== privateThreadId
```

Public and private conversations can reference one another without becoming the same conversation.

---

## 7. Multi-group reply context

A message may be visible through multiple groups.

For example:

```ts
{
  type: "GROUP",
  groupIds: [
    "gaming",
    "world-of-warcraft"
  ]
}
```

### Opened from a group

If the user opens the message while browsing:

```text
@gaming
```

then:

**Reply to group**

defaults to:

```text
@gaming
```

### Opened outside a group context

A message may instead be opened from:

* search
* profile
* notification
* standalone message URL
* AI search result

In that situation, determine which target groups the current identity is eligible to reply into.

#### Exactly one eligible group

Automatically select it.

Example:

```text
Message audience:
A + B

User can post to:
B only
```

Default reply target:

```text
B
```

#### Multiple eligible groups

Require explicit user selection.

Do not guess.

Example:

```text
Message audience:
A + B

User can post to:
A + B
```

Present:

```text
Reply to:

○ Group A
○ Group B
```

Do not silently reply to both.

#### No eligible groups

Do not offer a group reply.

Other permitted actions such as private reply may still be available.

---

## 8. Document revision advances on accepted edits

`revision` represents the current logical state of the document, not the last persisted autosave.

Therefore every accepted document mutation advances the revision immediately.

Examples include:

* typing
* adding a block
* deleting a block
* moving a block
* changing styling
* replacing media
* applying an AI proposal
* undo
* redo

Conceptually:

```ts
function commitDocumentChange(change: DocumentChange) {
  document = applyChange(document, change);

  document.revision += 1;

  scheduleAutosave(document);
}
```

Autosave persists the current revision.

It does not create the revision.

---

## 9. Undo and redo produce new revisions

Revision numbers represent chronological document states, not positions inside the undo stack.

Example:

```text
Revision 10
Change heading
→ Revision 11

Undo
→ Revision 12

Redo
→ Revision 13
```

Do not decrement the revision number during undo.

This guarantees that an AI proposal created against Revision 10 cannot accidentally appear valid after the user edits, undoes, and returns to visually similar content.

AI stale-state checking remains simple:

```ts
proposal.baseRevision === currentDocument.revision
```

If false, the proposal cannot silently apply.

---

# Milestone 1 architecture freeze

With these amendments, Milestone 1 should proceed without further expansion of the core architecture unless implementation exposes a concrete blocker.

The first engineering target is:

```text
Seed / Create Identity
        ↓
Open Composer
        ↓
AI Generate
        ↓
Structured Absol Document
        ↓
Manual Block Editing
        ↓
Absol Preview
        ↓
Email Preview
        ↓
Publish Publicly
        ↓
Immutable Document Snapshot
        ↓
Home Feed + Public Message Page
```

Initial supported blocks remain intentionally limited:

```text
Heading
Rich Text
Image
Button
Divider
Columns
Video
```

Anything beyond what is necessary to make this loop polished should be treated as follow-on work rather than a prerequisite.

The next product question should be answered through implementation:

> Does creating, editing, previewing, and publishing an Absol message feel meaningfully better and more expressive than composing a conventional email?

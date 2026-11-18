# Domain Concept Catalog

Before writing or changing requirements, designs, contracts, or code, read the product's domain concepts first. An agent that opens code first rebuilds the product's words and rules from whatever files it happened to read; a short page per topic gives every reader the same frame.

## What a Concept Is

A concept is one topic of what stays true across the whole product:
- The words it defines (terms + "not to confuse with").
- The shapes of its data, keys, and life cycle.
- The naming patterns things follow.
- The business rules that must hold (numbered, with "why").
- The folders that hold the topic.

**A concept holds NO history, decision logs, progress, status, or file paths.** Those change every commit and bury what stays true. History lives in git.

## Catalog Format

A project's concept catalog lives at a fixed location (e.g. `.starciwork/concepts/README.md` for StarCi apps, or `docs/concepts/README.md` for general projects):

```markdown
| Concept | Read when you touch (folders) | One line |
|---|---|---|
| payments | src/features/payments/, src/api/billing/ | How payment intents are created, confirmed, and refunded |
| users | src/features/auth/, src/api/users/ | User identity, roles, and session lifecycle |
```

## Concept File Format (≤ 60 lines)

```markdown
# <Name>
One or two lines summarising the topic.

## Terms
- **<Term>**: its one meaning. *Not to confuse with*: <nearby word that misleads>.

## Data
Shapes, keys, and life cycle of the things this topic defines.

## Naming
The patterns names follow, with examples.

## Rules
1. What must hold — and why.

## Example
An input and its result.

## Don't / Instead
What is NOT done, and what is done in its place.

## Where
The FOLDERS that hold this topic (never specific files).

Related: [<concept>](./<concept>.md)
```

## Read-First Protocol

Before touching any folder in a project:
1. Read the concept catalog (`README.md`).
2. Read the `conventions` concept (naming, keys, error patterns).
3. Read the concept of every folder the work touches.
4. Only then open the code.

## For fe-recon

When surveying an unfamiliar codebase, check for a concept catalog:
- StarCi apps: `.starciwork/concepts/README.md`
- General projects: `docs/concepts/`, `docs/domain/`, `docs/glossary/`
- If none exists: note it as a gap in the recon report and offer to scaffold from the template above.

If a concept catalog exists, read it and include a summary in the recon report under "Domain Concepts".

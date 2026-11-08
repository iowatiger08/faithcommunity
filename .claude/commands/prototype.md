---
description: Build a throwaway prototype to flesh out a design before committing to it — either a runnable terminal app for logic/state questions, or several radically different UI variations switchable from one route.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick a branch

Identify which question is being answered — from the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → Logic prototype (terminal app)
- **"What should this look like?"** → UI prototype (variant switcher)

The two branches produce very different artifacts — getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Locate the prototype code close to where it will actually be used so context is obvious — but name it so a casual reader can see it's a prototype, not production.
2. **One command to run.** Add a script to the project's existing task runner.
3. **No persistence by default.** State lives in memory.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype runnable, no abstractions.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state.
6. **Delete or absorb when done.** When the prototype has answered its question, either delete it or fold the validated decision into the real code.

## Logic Prototype

A tiny interactive terminal app that lets the user drive a state model by hand. Use this when the question is about **business logic, state transitions, or data shape**.

### Process

**1. State the question** — write down what state model and what question you're prototyping, in the prototype's README or a comment at the top. Make the question explicit so it can be checked later.

**2. Pick the language** — use whatever the host project uses.

**3. Isolate the logic in a portable module** behind a small, pure interface that could be lifted out and dropped into the real codebase later:

- **A pure reducer** — `(state, action) => state`. Good when actions are discrete events.
- **A state machine** — explicit states and transitions. Good when "which actions are even legal right now" is part of the question.
- **A small set of pure functions** over a plain data type. Good when there's no implicit current state.
- **A class or module with a clear method surface** when the logic genuinely owns ongoing internal state.

Keep it pure: no I/O, no terminal code, no `console.log` for control flow.

**4. Build the smallest TUI that exposes the state** — on every tick, clear the screen and re-render the whole frame:

1. **Current state**, pretty-printed (one field per line, or formatted JSON). Bold field names, dim less important context.
2. **Keyboard shortcuts** at the bottom: `[a] add user  [d] delete user  [q] quit`.

Read one keystroke at a time, dispatch to a handler, re-render the full frame. The whole frame should fit on one screen.

**5. Make it runnable in one command** — add to `package.json` scripts or equivalent.

**6. Hand it over** — give the user the run command. The interesting moments are when they say "wait, that shouldn't be possible."

**7. Capture the answer** — when done, note what it taught you. Leave a `NOTES.md` if running AFK.

### Anti-patterns

- Don't add tests
- Don't wire it to the real database
- Don't generalise
- Don't blur the logic and the TUI together (the reducer must stay pure)

---

## UI Prototype

Generate **several radically different UI variations** on a single route, switchable from a floating bottom bar.

### Two sub-shapes — strongly prefer sub-shape A

**Sub-shape A (preferred)** — adjustment to an existing page. Variants are rendered on the same route, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay — only the rendering swaps.

**Sub-shape B (last resort)** — a new throwaway route, only when the thing being prototyped genuinely has no existing page to live inside.

### Process

**1. State the question and pick N** — default to 3 variants, cap at 5.

**2. Generate radically different variants** — structurally different (different layout, different information hierarchy, different primary affordance). Three slightly-tweaked card grids isn't a UI prototype.

**3. Wire them together:**

```tsx
const variant = searchParams.get('variant') ?? 'A';
return (
  <>
    {variant === 'A' && <VariantA {...data} />}
    {variant === 'B' && <VariantB {...data} />}
    {variant === 'C' && <VariantC {...data} />}
    <PrototypeSwitcher variants={['A','B','C']} current={variant} />
  </>
);
```

**4. Build the floating switcher** — a fixed-position bar at bottom-centre with left arrow, variant label, right arrow. Clicking updates the URL search param. `←`/`→` arrow keys also cycle (skip when an input is focused). Gate on `process.env.NODE_ENV !== 'production'` so it can't ship to users.

**5. Hand it over** — surface the URL and `?variant=` keys.

**6. Capture the answer and clean up** — once a variant wins, delete the losers and the switcher. Don't leave variant components lying around.

### Anti-patterns

- Variants that differ only in colour or copy
- Sharing too much code between variants (a shared `<Header>` is fine; a shared `<Layout>` defeats the point)
- Wiring variants to real mutations
- Promoting the prototype directly to production

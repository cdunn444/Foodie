# Palate

A personal taste engine for eating well in a new city. Not Yelp — Yelp tells you
what is objectively good. Palate tells you what *you* will like, based on a small
library of places you already love, ranked by the mood you're in tonight.

Built with Expo / React Native. The recommendation engine is a single Claude API
call with web search enabled: your full library, your constraints, and tonight's
mode go in; a Daylist-style titled list of 8 ranked picks comes out.

## The core mechanic: modes

People don't have one taste — they have a few moods, each with different rules.
The app asks which mood you're in and ranks *within that mode*:

| Mode | Kind | Job |
|---|---|---|
| **Scene** | peak | The night out — max energy + design, price no object |
| **Craft** | peak | The room and the cooking — max design + nails a specialty |
| **Solid & easy** | floor | One thing done great, plain wrapper |
| **Reliable local** | floor | The safe local call, no misses |
| **Destination** | peak | The meal that *is* the trip (optional — toggle in Settings) |

Peak modes chase a standout on one axis; floor modes chase the absence of any
weak spot. Dietary constraints are weighted by mode: nearly irrelevant in peak
modes (being *worth the hassle* is the signal), heavily weighted in floor modes.

## Running it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone (or press `i` / `a` for a simulator).

**No API key required.** Out of the box, searches rank places from your own
library within the selected mode — free, offline, fully on-device. Optionally,
paste an Anthropic API key in **Settings** to unlock discovery of new places in
any city via Claude + web search. Either way there is no backend: your library
lives only on the device (AsyncStorage), and the optional key is stored locally
with calls going directly from your device to the Claude API.

## What ships

- **Chris Edition seed**: 22 places (Miami + a few outposts) with GF/DF/soy-free
  constraints prefilled, bundled from `src/data/seed.json`. Everything is
  editable in-app; added places persist on the device.
- **Four screens**: Mood (home), Results, Library, Add a place — plus Settings
  for the API key, constraints, and the Destination-mode toggle.
- **Zero taste in code**: all taste lives in data. The engine prompt learns the
  pattern from your library at search time; nothing user-specific is hardcoded.

## The Palate skill (no API key, runs on your Claude subscription)

This repo doubles as a Claude skill: `.claude/skills/palate/SKILL.md` turns any
Claude session with this repo into the taste engine, with `library.json` at the
repo root as the single source of truth (versioned in git).

- **Recommendations**: "/palate scene in Austin on Saturday, party of 4" —
  Claude reads your library, learns the pattern, web-searches real places,
  ranks the top 8 within the mode's logic, and refines conversationally.
- **Adding places**: "add Nixta in Austin — craft, the masa carries it, get the
  duck carnitas" — Claude structures it into the schema, confirms, and commits.

Works end to end in Claude Code (desktop, or code sessions in the claude.ai
app). In a plain chat, upload the skill folder as a zip under Settings →
Capabilities → Skills; recommendations work the same, and adds fall back to a
paste-ready JSON block.

Note: the web app keeps its own on-device library (bundled from
`src/data/seed.json` + your local edits); `library.json` is the canonical copy
for the skill.

## Architecture notes

- `src/engine.ts` — the one Claude call (`claude-sonnet-5` + `web_search`),
  including `pause_turn` continuation handling and defensive JSON parsing.
- `src/storage.ts` — AsyncStorage persistence, falling back to the bundled seed.
- `metro.config.js` — stubs `node:*` builtins that the Anthropic SDK references
  in code paths that never execute in the app (CLI credential profiles).
- Data model, mode logic, and prompt template follow the PRD verbatim.

## Deferred (per the PRD scope fence)

Hotels/trips, maps and photos, reservation deep-links, Google Places,
auto-import from Maps history, and cold-start onboarding (v1.1).

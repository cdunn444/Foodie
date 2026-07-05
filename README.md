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

Then open **Settings** in the app and paste your Anthropic API key. The key is
stored only on the device (AsyncStorage) and calls go directly from your phone
to the Claude API — there is no backend.

## What ships

- **Chris Edition seed**: 22 places (Miami + a few outposts) with GF/DF/soy-free
  constraints prefilled, bundled from `src/data/seed.json`. Everything is
  editable in-app; added places persist on the device.
- **Four screens**: Mood (home), Results, Library, Add a place — plus Settings
  for the API key, constraints, and the Destination-mode toggle.
- **Zero taste in code**: all taste lives in data. The engine prompt learns the
  pattern from your library at search time; nothing user-specific is hardcoded.

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

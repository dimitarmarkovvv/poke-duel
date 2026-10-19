# Poke Duel

A single page React app that loads a random Pokémon from the
[PokéAPI](https://pokeapi.co), keeps the previous one beside it, and decides
which of the two wins the type matchup.

## What it does

**Loads a random Pokémon** on every press of the button and shows its name,
sprite, height, weight and types.

**Keeps the previous one.** The Pokémon that was on the right moves to the
left, the new one takes its place. Before the first load the left card shows a
placeholder.

**Decides the matchup** by comparing the primary types of the two Pokémon
against the damage relations the API publishes for each type:

| Situation | Message |
|---|---|
| Both primary types are the same | `TYPE MATCH!` |
| The new type is strong against the previous one | `NEW POKÉMON WINS!` |
| The previous type is strong against the new one | `PREVIOUS POKÉMON WINS!` |
| Neither has an advantage | `NO ADVANTAGE` |

**Counts the outcomes** of the session: type matches, wins for the new
Pokémon, wins for the previous one.

The winner's card lights up green and the loser's red; on a type match or when
neither type has an advantage, neither card lights up. Both cards shake for a
moment on every press.

Only the three decisive outcomes are counted — `NO ADVANTAGE` has no counter of
its own.

## Running it

Developed on Node.js 24; any version Vite 8 supports will do. No API key is
needed — PokéAPI is open.

```bash
git clone https://github.com/dimitarmarkovvv/poke-duel.git
cd poke-duel/poke-duel
npm install
npm run dev
```

The app starts on <http://localhost:5173>.

## Scripts

Run from the `poke-duel/` folder inside the repository:

| Command | What it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the production build |
| `npm run lint` | ESLint over the project |
| `npm test` | run the test suite once |
| `npm run test:watch` | re-run tests on every change |

## Project structure

```
src/
├── services/pokeApi.js     every request to PokéAPI
├── utils/battle/           the pure comparison function and its tests
├── components/
│   ├── PokemonCard/        one card, markup and styles
│   ├── Controls/           the load button
│   └── Counters/           the scoreboard
├── App.jsx                 state, the load flow, layout
└── index.css               the battle field background
```

Components never call the API themselves. Every request lives in
`services/pokeApi.js`, so there is one place to look when the data layer
changes. Each component keeps its own stylesheet beside it.

## Decisions worth explaining

**Picking a random Pokémon by offset, not by id.** The API reports more
resources than there are usable ids: the base Pokémon end around 1025 and the
alternate forms only start at 10001, so a random number up to `count` lands in
the gap about a quarter of the time and returns a 404. Asking the list endpoint
for one entry at a random offset always returns something that exists.

**Height and weight are divided by ten.** The API stores them as whole numbers
in decimetres and hectograms — Pikachu arrives as `4` and `60`, which is 0.4 m
and 6 kg.

**Type data is cached per session.** `getType` stores the *promise* rather than
the resolved value, so two lookups of the same type that start before the first
response arrives still produce a single request. PokéAPI asks consumers to
cache locally in its fair use policy.

**Every response is checked.** `fetch` resolves normally on 404 and 500, so each
request checks `response.ok` and throws with the status and enough context to
tell which of the four requests failed.

## Performance

The app uses `React.memo`, `useCallback` and `useMemo`, each added after the
React DevTools Profiler showed a render that was not needed.

**`React.memo` on the cards.** One click changes several pieces of state, so
`App` renders more than once per press. The Profiler reported the cards
re-rendering with the reason *"The parent component rendered"* on every
`loading` toggle, although their Pokémon had not changed. Wrapping them
removed those renders; what remains is reported as *"Props changed"*.

**`useCallback` on the load handler.** The button lives in its own memoized
component. Memoizing it alone changed nothing, because the handler was a new
function on every render and the comparison failed. `useCallback` keeps its
identity stable. Its dependency list is just the current Pokémon — the counters
dropped out of it once they were updated with the functional form of
`setState`, which reads the previous value from React instead of from the
closure.

**`useMemo` on the scoreboard data.** The three counters are passed to a
memoized component as one object. An object literal is a new object on every
render and would defeat the comparison the same way the function did, so its
identity is kept stable instead.

## Tests

```bash
npm test
```

Four tests cover the comparison function, one per outcome. The function is
pure — it takes two type names and a table of damage relations and returns a
string — so the tests build their own small table instead of calling the API.
That keeps them fast and independent of what Nintendo does to the type chart.

## Not implemented

The optional full type battle from the task description: using every type of
both Pokémon and multiplying the damage modifiers. The current comparison uses
the primary type of each.

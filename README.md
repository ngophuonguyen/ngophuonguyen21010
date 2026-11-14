# Deutsch · Your everyday German

A React + TypeScript learning studio for German B1–B2, published with GitHub Pages.

## Run and verify

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The GitHub Actions workflow tests, builds and deploys `dist/` after a push to `main`. Enable **Settings → Pages → GitHub Actions** once.

## Learning experience

- A complete six-word batch with gender, plural, collocations and four bilingual examples per word.
- Sequential introduction, active production, contextual word identification, and a visual paragraph task.
- Dictation where the browser supports speech recognition. Written feedback evaluates the transcript, not pronunciation or spoken fluency.
- An authenticated server-side AI evaluation function, plus explicitly unscored self-review when AI is unavailable.
- Native listening requires a sourced native-speaker recording containing the target noun. Supply your course recording in the session. Synthetic warm-up audio does not unlock this assessment.
- A 60–180-word visual task using all six nouns and an idiom.
- Two original reading/dialogue exercises with a curated dictionary for every token, sentence/passage translations, and grammar insights.
- A native-video and official-course listening library.
- The original 30-day topic map and shared five-question foundation quiz remain available. The topic map does not represent 30 distinct lesson sets.

## Architecture

- `src/content/course.ts`: typed vocabulary, original passages, examples, and idioms.
- `src/content/dictionary.ts`: curated contextual definitions and tokenization.
- `src/features/Vocabulary.tsx`: sequential learning interface.
- `src/features/batchState.ts`: persisted-state and feedback validation.
- `src/features/useBatch.ts`: account-scoped draft storage and optional cloud sync.
- `src/features/Reading.tsx`: reusable interactive reading renderer.
- `src/features/Speech.tsx`: optional browser speech tools with typed-input fallback.
- `src/features/evaluation.ts`: authenticated client adapter; no provider keys in the browser.
- `supabase/functions/evaluate-german/index.ts`: validated, authenticated AI feedback with a per-user daily quota.
- `src/styles.css`: responsive design tokens, rose/plum palette, accessible focus styles, and reduced-motion support.

## Connected services and current limitations

Google login, database sync, and AI scoring require configuration. They are not activated merely by publishing the frontend. See [SETUP_SUPABASE.md](SETUP_SUPABASE.md).

The app does not invent AI scores or label device speech as a native recording. Self-review completion is explicitly unscored. Audio files are local to the browser session. Native media must be supplied before the word-identification step can be completed.

Batch drafts are isolated by account and cached locally. Failed cloud writes remain pending. A cloud snapshot is loaded when the account is opened; there is no real-time collaboration. When two devices edit the same batch, the last successful cloud write wins. Guest batch drafts are not automatically copied into an account.

The reference images provided by the project owner inform the palette. Two supplied images are included as the hero asset and visual task; no additional rights to redistribute them are asserted. Original reading passages, grammar notes and examples were authored for this application.

## Verification

Tests cover legacy migration, malformed records, false-valued progress, quiz attempts, dictionary coverage, vocabulary completeness, target matching, sequential gates, and feedback bounds. Frontend builds are verified separately. Live OAuth, cloud RLS, and the AI provider require deployment credentials and end-to-end verification after setup.

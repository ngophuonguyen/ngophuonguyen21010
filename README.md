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

## Merged listening studio and practice ranks

The rose/plum interface, four-step vocabulary workflow, and curated word/sentence reading tools remain intact. The sidebar now also offers a three-pass listening studio, spaced review, and practice ranks. The cat mark and signature-style owner name form the updated brand; the lettering is typographic, not a reproduced autograph.

### Three listening passes

1. Listen and write notes without the app transcript.
2. Replay with German transcript and synchronized cue highlighting.
3. Replay with German/English text and supplied grammar insights.

Each pass requires playback before the next unlocks. YouTube and local audio track played ranges; seeking cannot substitute for listening. Completing all three passes awards 50 XP once per lesson. Replaying does not farm XP. Synthetic narration is explicitly labeled and remains separate from the native-recording requirement in the four-step vocabulary assessment.

Import a supported HTTPS YouTube URL or a local audio file with a matching WebVTT transcript and source attribution. The app does not scrape YouTube, download videos, or redistribute textbook recordings. Use recordings and transcripts you are permitted to use. YouTube embedding needs network access and may be restricted by the publisher. Platform captions or burned-in subtitles may still appear during pass 1. Missing English translations are shown as unavailable.

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
Guten Morgen! | Good morning!

00:00:05.000 --> 00:00:10.000
Wie geht es dir? | How are you?
```

Transcripts accept up to 200 ordered, non-overlapping cues, 64,000 characters, and a two-hour timeline. Audio imports accept up to 50 MB. Audio bytes stay in the browser session and must be selected again after reload; lesson metadata and notes are retained on this device. No recording is uploaded by this feature.

### Review, XP, and decay

The six existing vocabulary words use self-rated recall: remembered earns 10 XP with intervals of 1, 3, 7, 15 days, increasing to a 90-day cap; forgotten returns after ten minutes without XP. Due dates prevent repeated immediate XP awards. Early practice is available when no words are due, resets inactivity, and changes neither XP nor the spaced schedule.

Rank XP loses 50 points at 48 hours without vocabulary review and another 50 every 24 hours thereafter, with a zero floor. The same period is never charged twice. Listening alone does not reset that review window. Bronze, Silver, Gold, Platinum, and Constellation start at 0, 500, 1,500, 3,000, and 5,000 XP. Daily/weekly earned XP is distinct from all-time XP after decay. Activity days use Vietnam time.

These extra features use validated local storage isolated by guest/account. They are **not cloud-synchronized** and do not provide an anti-cheat or shared competitive leaderboard. Other leaderboard names are explicitly fictional samples. Ranks measure practice activity, not CEFR proficiency. The existing learning-progress cloud sync remains unchanged.

### Neural playback configuration

Shared vocabulary, review, reading, and narration playback can use a server-backed voice. Set public repository variables `VITE_TTS_ENDPOINT` and optionally `VITE_TTS_VOICE` (default `de-DE-KatjaNeural`), then rebuild. Without an endpoint, the app selects an installed German device voice and labels it synthetic. Voice quality depends on the service/device; no German voice produces a clear setup message.

The endpoint must use HTTPS (localhost is accepted for development), allow the app origin through CORS, and accept:

```json
{ "text": "Guten Morgen!", "language": "de-DE", "voice": "de-DE-KatjaNeural" }
```

Return a playable audio body with `Content-Type: audio/*`, at most 15 MB, within 30 seconds. The frontend sends the requested German text to that configured endpoint. Keep all provider keys, authentication enforcement, voice allowlists, request-size limits, quotas, and billing controls on the server. A Supabase endpoint on the configured Supabase project's origin receives the signed-in user's bearer token and public project key; arbitrary endpoint origins never receive that token. Other endpoints must implement their own authentication (same-origin cookies are supported). A provider server is not provisioned by this change, and GitHub Pages cannot run it.

Pull requests run unit tests and a production build. Only main-branch pushes or manual workflow runs publish Pages. Tests additionally cover decay boundaries, reward idempotency, pass ordering, played-range coverage, transcript/URL validation, early recall, and corrupt studio storage.

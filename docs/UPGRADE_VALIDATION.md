# Curriculum and material-library validation

## Root cause

The old learning plan changed a topic heading and day number but routed every card to the same `Grammar.tsx` quiz array. Passing that shared quiz also set the selected day's old completion flag. The plan now resolves thirty independent lesson records; the foundation quiz remains available separately and cannot complete a curriculum day.

## Data verified

All 30 lesson records passed `npm run audit:curriculum`, including 120 vocabulary entries, 30 original readings, 30 original listening scripts, 30 speaking tasks, 30 writing tasks and 90 questions with answer explanations. The machine-readable result is in `curriculum-audit.json`. Daily budgets total 30 minutes.

Pairwise checks compare four-word shingles in reading, listening, writing and speaking content; exact grammar examples and whole quizzes are also checked. A test deliberately clones a lesson under a different title and confirms rejection. Missing fields, missing records, invalid answer indices and stale completion revisions are tested.

## Tests and frontend checks

- 74 unit/integration tests passed, including the previous vocabulary/reading/listening regressions.
- TypeScript and production build passed.
- Browser: traversed days 1 through 30 with the actual Next day controls; observed 30 distinct titles, 30 distinct readings, seven sections in every day, and completion blocked for every untouched day. The final Next day control was disabled.
- Browser: completed a day using a test speaking outline, written response, three answered/explained questions and seven acknowledgements. Completion and the 1/30 count survived reload.
- Browser: word lookup in a new lesson opened the dictionary and returned German entries. Daily target words now have curated offline entries as well.
- Data-level storage tests: import persistence, duplicate no-overwrite, adding a second document, account isolation, cancellation without a partial record, and authored-lesson preservation.

## Real PDF extraction

The same PDF.js extraction API and library indexing code processed the supplied copies in Node, with an in-memory IndexedDB test implementation:

| Resource                   | Pages extracted | Pages without text | Extracted characters |
| -------------------------- | --------------: | -----------------: | -------------------: |
| Goethe B1 adult practice   |              49 |                  0 |               81,606 |
| Goethe B1 youth practice   |              49 |                  0 |               82,934 |
| Klett Hellas teacher guide |              76 |                  0 |              230,366 |

All three records were retained together. These copyrighted source PDFs and their extracted content are not included in the public repository.

## Verification limits

The cloud-browser file-chooser `setFiles` operation repeatedly timed out, including with a small original PDF fixture. This prevented end-to-end browser confirmation of file selection, canvas rendering and reopen after import. Opening the chooser itself worked; actual PDF extraction and storage logic were validated separately as described above. This is a recorded test limitation, not a claimed passing browser upload test.

The production build reports a non-fatal main-chunk size warning (approximately 574 kB minified / 177 kB gzip); PDF code and its worker are loaded separately. No backend/cloud PDF backup, OCR, automatic CEFR assessment, or AI semantic classification is claimed. Material classification and transfer prompts are rule-based; daily listening playback is labeled synthetic and depends on an installed/configured German voice. Optional publisher sources provide native-audio practice.

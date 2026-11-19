# Book-linked B1–B2 pathway validation

## Supplied sources

The catalog now retains the two 49-page Goethe B1 practice sets and the 76-page Klett Hellas teacher guide, and adds the supplied Aspekte neu B2 textbook scan: 202 PDF pages, 167,802,821 bytes, ISBN 978-3-12-605024-1, 2015 imprint. SHA-256 is recorded in the catalog. The supplied instructional section has a one-page viewer offset: printed page n is PDF page n + 1. The publisher's current listing may have a different page count, so guides target the supplied scan rather than silently assuming the current edition.

The contents pages and selected grammar/module spreads were inspected, including rendered page images. Metadata covers forty modules across ten chapters and thirteen targeted grammar references. Thirty authored transfer units connect course-day goals to these sources. B1 links provide exam-skill reinforcement, with the teacher guide used explicitly for transcript analysis rather than presented as a candidate task or an audio source.

## Material implementation

Every new unit contains a day-specific goal, an explanation of its relationship to the core day, precise PDF/printed-page references, an original instructional insight, a German example and English translation, two useful expressions, two original questions with explanations, and a German production task with a self-review checklist. There are 30 distinct goals, 60 questions and 60 expression entries. The order follows existing course goals; this is not a complete replacement or reproduction of all textbook exercises.

Core lesson records and their content revisions remain unchanged. Book-unit drafts and completion use a separate account-scoped key. Completion requires primary-source review, both answers checked and correct, at least thirty response words and checklist review. Stale unit revisions preserve production drafts while invalidating outdated answer/completion evidence. Core progress, book notes, prior imports and studio features are preserved.

Source links encode book, guide, page, originating course day and pathway. The library can return to the same book unit. Manual document/task changes update the URL and page target, including after reload, without overwriting prior notes.

The previous 25 MB reader cap rejected the supplied scan. The cap is now 200 MiB, with existing 600-page, 30,000-character/page and 8 MB extracted-text bounds retained. Exact-edition matches choose B1/B2 automatically. Unknown documents retain the user's level choice. Browser storage-quota failures remain visible.

## Verification

- 116 automated tests passed, including an individual check for every book day, all source/page mappings, duplication and missing data, completion gating, stale drafts, URL round-trips, note preservation and every original core revision.
- Production TypeScript/Vite build passed. The existing non-fatal bundle-size warning remains (the main bundle is approximately 631 kB minified; PDF rendering and its worker load separately).
- Both the original 30-day data audit and the new 30-unit audit passed. The new machine-readable mapping is in book-path-audit.json.
- Actual PDF.js extraction and the material-indexing/IndexedDB code processed all 202 pages of the supplied B2 scan. No page lacked text; all 34 distinct linked source pages contained text. A saved B2 material record was verified. See b2-source-audit.json for counts. This used the supplied large file, not a small fixture.
- Browser QA opened all thirty book units, verified thirty distinct unit headings and two questions per day (60 total).
- Browser QA verified day 1 -> correct Aspekte source/guide/page -> return to day 1; completion stayed disabled before source/checklist evidence; completed draft and checked answers survived reload.
- A manual switch to the youth Goethe set and Teil 4 updated the target to PDF page 21. Both document and task survived reload.
- The previously completed core day remained completed. Course review displayed book completion separately.

## Verification limits

The browser automation provider's previous file-chooser issue was not retried with the 160 MiB scan; no new end-to-end GUI upload pass is claimed. Extraction, classification and storage were verified directly with the actual file and the application's indexing functions using an IndexedDB implementation. Browser storage quota and memory vary by device. The scan has an OCR text layer and may contain recognition errors; automated keyword classification is not semantic AI analysis or CEFR testing.

PDFs and their extracted passages are not committed to the public repository. Learners can use the new original tasks immediately; opening the original pages requires a one-time local import or their own physical copy. Publisher recordings and timed captions are not embedded in these PDFs, and transcript reading is not counted as native listening. No new cloud synchronisation, neural-voice service or AI marking service is claimed by this release.

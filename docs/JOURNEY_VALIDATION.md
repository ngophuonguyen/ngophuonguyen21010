# Coherent learning framework

## Findings and changes

The previous overview promoted the legacy six-word vocabulary batch as today's main action, while the actual 30-day curriculum was a different navigation destination. Nine equal-level destinations mixed course content, standalone studios, book resources and gamification. Course review and studio flashcards were also easy to confuse. Page state was held only in React, so reloads returned to the overview and browser navigation could not restore the selected day.

The primary navigation now has five destinations. Today opens the last unfinished selected course day; the course contains all thirty lesson records; Review my lessons surfaces saved day responses, drafts and checked mistakes. Independent features remain in one optional Practice tools hub with explicit return controls and separate progress semantics. URL query state preserves the page/day and library-to-studio return context without conflicting with in-lesson section anchors.

The library now chooses one document and one task rather than showing three parallel resource cards and every task at once. Book identity, chosen task and study/review mode persist. A matching saved PDF reopens from device storage. Page jumps and self-recorded practice checks require the exact edition to be open. Switching documents cannot use a different source's page guide. Notes, bookmarks and existing imported files are preserved.

## Validation

- 79 automated tests passed, including destination round-trips, invalid URLs, resume selection, actual-work review filtering and independent book context restoration.
- Production TypeScript/Vite build passed. Existing non-fatal main chunk size warning remains.
- Curriculum data audit passed for all 30 distinct records.
- Browser navigation opened all 30 days and verified the heading against its course card; all 30 headings were distinct and day 30 disabled Next day.
- Browser reload preserved day 2. Today retained day 2 and browser Back returned to that day.
- Course review displayed the previously saved completed day with its responses, rather than studio flashcards.
- Selecting the youth document and Teil 4 persisted across reload. The page-21 shortcut was disabled while the matching PDF was absent.
- The library-to-listening action displayed Back to My library. All six legacy tools remained in the optional hub.

## Scope and limits

This release provides the navigation framework and document-study workflow. It does not claim to convert all supplied books into the 30 authored course lessons. The three documents have verified edition-specific page guides; visitor PDF imports are browser-local and rule-based, without semantic AI extraction or OCR. Chat attachments do not automatically populate a visitor's IndexedDB. No new PDF upload through the browser automation provider was claimed; the previous provider file-chooser limitation remains documented in UPGRADE_VALIDATION.md. Existing PDF extraction/storage tests continue to pass. Neural voice, authentication and cloud services still require their configured integrations.

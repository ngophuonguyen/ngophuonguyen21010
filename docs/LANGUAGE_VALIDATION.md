# Vietnamese learning mode

## Implemented behaviour

A persistent support-language selector defaults to Vietnamese and allows English at any time. Vietnamese resources cover all 30 core days and 30 book-linked days, including every core vocabulary meaning/example translation, grammar explanation/example translation, reading summary, listening instruction, production support and explained answer. Book support includes all learning insights, example translations, target-expression glosses, question prompts/explanations and production checklists. German production instructions have separate expandable Vietnamese hints rather than replacing the original German task.

Legacy support includes 24 vocabulary-example translations, both six-sentence readings/dialogues and their eight grammar insights, three idioms, 86 dictionary usage notes and the built-in Berlin listening translations/grammar notes. Navigation, primary controls, the library, the four-step vocabulary studio, three-pass listening and review/rank guidance have Vietnamese presentation copy. Technical identifiers and comments remain English.

The presentation layer preserves original learning data and does not machine-translate student responses. German regions and German-form answer options are explicitly protected. English reasoning choices in book checks receive translated labels while retaining answer indices. Input values, callbacks, IDs, URL targets, media text and React keys are preserved. Keeping keys stable avoids remounting the active exercise when language changes. Select options with implicit values retain their original semantic value even when their visible label changes.

## Checks

- 157 automated tests passed: thirty per-day translation-coverage checks plus legacy support coverage, native hints, German/English homographs, form/select semantics, key identity, unchanged German audio payloads, safe unknown/prototype-key fallback and all existing curriculum/progress/studio tests.
- Production TypeScript/Vite build passed. The main bundle still produces the known non-fatal size warning; Vietnamese resources add to the initial bundle. PDF rendering and its worker remain separate.
- Browser QA opened all thirty days in Vietnamese: 210 core sections, thirty distinct book goals and sixty book questions remained present.
- On day 2, switching Vietnamese -> English -> Vietnamese preserved a typed German draft and the selected German answer. Both the preference (`html lang="vi"`) and draft survived reload.
- A German grammar example remained unchanged while its explanation and example translation appeared in Vietnamese.
- Legacy sentence translation displayed Vietnamese while the original German sentence remained visible. Word lookup displayed a Vietnamese gloss and grammatical labels.
- Existing core/book completions were retained in the same account/device scope. No content revision or scoring rule was changed by localisation.

## Deliberate limits

Vietnamese translations are curated for the app's teaching content. Uploaded book pages, arbitrary imported captions, newly authored freeform content and live external dictionary definitions are not automatically translated. Uncovered external definitions retain their original English source with a Vietnamese explanation of the fallback. The German–Vietnamese dictionary opens only after the user clicks its source link. The selected term, rather than a student's paragraph, is used in that link. No new machine-translation, AI-evaluation, cloud-sync or neural-voice service is claimed by this release.

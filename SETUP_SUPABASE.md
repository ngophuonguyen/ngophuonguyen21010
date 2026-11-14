# Connect accounts, progress, and AI assessment

## 1. Create the backend

Create a project at https://supabase.com/dashboard. Select a suitable region and review the chosen plan before accepting service terms. Never put the database password in this application.

Run `supabase/schema.sql`, then `supabase/upgrade-v3.sql` in the project SQL Editor. The scripts create private learning records, vocabulary-batch snapshots, and an atomic AI quota. RLS restricts progress to its authenticated owner. The AI quota permits up to 20 assessment requests per account per UTC day, including requests whose provider call subsequently fails.

Before allowing learners, test with two accounts: account B must not read or change account A's rows in either progress table. The SQL has not been executed against a live project in this code-only configuration.

## 2. Enable Google sign-in

In Google Cloud, create a Web application OAuth client and configure the consent screen.

- Authorized JavaScript origin: `https://ngophuonguyen.github.io`.
- Authorized redirect URI: the exact callback URL shown by the Google provider in your Supabase dashboard, typically `https://PROJECT.supabase.co/auth/v1/callback`.
- In Google testing mode, add authorized test-user email addresses.

Enable Google in Supabase Authentication providers and save the Google client ID and client secret there. Keep the secret out of GitHub and frontend environment variables.

In Supabase Authentication URL Configuration, set the Site URL and allowed Redirect URL to:

```
https://ngophuonguyen.github.io/ngophuonguyen21010/
```

Optionally allow `http://localhost:5173/` for local testing. The frontend uses PKCE and returns to the current page; it does not require a `/callback` route on Pages.

## 3. Configure GitHub builds

Create these repository variables under **Settings → Secrets and variables → Actions → Variables**:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Use the Project URL and browser-safe publishable key. Never use service_role or a secret key in the browser. Rebuild after changing these variables. For local development, copy `.env.example` to `.env.local`.

## 4. Deploy AI assessment

Deploy the `evaluate-german` Supabase Edge Function with JWT verification enabled. Configure its server-side secrets:

```
OPENAI_API_KEY=<provider key>
OPENAI_MODEL=<an available Responses model supporting structured outputs>
ALLOWED_ORIGIN=https://ngophuonguyen.github.io
```

The Supabase runtime supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY`. No service-role key is needed. The function verifies the signed-in user, claims an atomic quota slot, enforces origin/input limits, and sends only the submitted text, task and target nouns to the OpenAI Responses API with `store: false`. It does not send microphone recordings or uploaded native clips. Origin checking complements authentication; it does not replace it.

After deploying and verifying the function, set the GitHub repository variable `VITE_AI_FEEDBACK_ENABLED=true`, then rebuild. Leave it false until the endpoint is ready. API usage is separate from any ChatGPT subscription and may incur provider charges.

Test a correct sentence, an incorrect sentence, an expired session, invalid input, and the daily quota. Verify English feedback and a corrected German sentence. Ratings describe grammar and textual naturalness only, never pronunciation, pace or spoken fluency.

## 5. Supply native word-context media

For each vocabulary item, add a short native-speaker course recording in the listening step and identify its book/unit/track or other source. Confirm it contains the target noun in a full sentence. Play it, then identify the noun. A synthetic clue is available as warm-up but does not fulfill native listening.

Files stay local and are session-only. The app does not automatically transcribe, verify speaker provenance, distribute textbook recordings, or silently download copyrighted source media. After a reload, unfinished native listening needs the file to be selected again.

## 6. Verify persistence

- Complete a foundation quiz, mark a library source, and begin a vocabulary batch.
- Wait for account-save confirmation, reload, and compare on another device.
- Switch accounts and confirm private data stays separate.
- Confirm pending writes survive an offline interruption and retry after connectivity returns.
- Do not clear browser storage before pending writes are saved.

## Primary documentation

- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/functions/auth-legacy-jwt
- https://developers.openai.com/api/docs/guides/structured-outputs

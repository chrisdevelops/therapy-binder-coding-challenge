## 1) Assumptions (Fast + Practical)

* There is **one** mock therapist record in the DB.
* The app uses a **fixed `THERAPIST_ID`** constant on the client (env var) and always writes/reads notes scoped to this therapist.
* **RLS is ON**, with policies permitting the **anonymous (“anon”) role** to CRUD rows **only** for this therapist’s ID.
  This simulates “logged in as the therapist” without wiring real auth.

> Trade-off: This is not secure for production, but it satisfies the challenge’s requirement to use RLS and allow CRUD for the mock therapist in a demo.

---

## 2) New/Updated Env & Constants

Add to `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_THERAPIST_ID=00000000-0000-0000-0000-000000000001
```

Add to `src/lib/types.ts` (or `src/lib/constants.ts` if you prefer):

```ts
export const THERAPIST_ID = import.meta.env.VITE_THERAPIST_ID as string;
```

---

## 3) Database Schema Changes (Supabase)

### 3.1 Table: `therapists`

```sql
create table if not exists public.therapists (
  id uuid primary key,
  full_name text not null,
  email text unique
);

-- Seed one mock therapist (matches VITE_THERAPIST_ID)
insert into public.therapists (id, full_name, email)
values ('00000000-0000-0000-0000-000000000001', 'Mock Therapist', 'therapist@example.com')
on conflict (id) do nothing;
```

### 3.2 Update `session_notes` to include `therapist_id`

(If you already created `session_notes`, just `alter` it. Otherwise use this full ddl.)

```sql
create table if not exists public.session_notes (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.therapists(id) on delete cascade,
  client_name text not null,
  session_date date not null,
  quick_notes text not null check (char_length(quick_notes) <= 500),
  duration_minutes integer not null,
  created_at timestamptz not null default now()
);
```

> App logic: When creating a note, always set `therapist_id = VITE_THERAPIST_ID`.

---

## 4) Enable RLS + Policies (Demo-Safe)

### 4.1 Enable RLS

```sql
alter table public.therapists enable row level security;
alter table public.session_notes enable row level security;
```

### 4.2 Therapists Policies

* Allow reading the single therapist row (optional, so the UI can show therapist name).
* Disallow inserts/updates/deletes from client.

```sql
-- SELECT only the seeded therapist for anon role
create policy therapists_select_mock
on public.therapists
for select
to anon
using (id = '00000000-0000-0000-0000-000000000001');

-- (No insert/update/delete policies for anon)
```

### 4.3 Session Notes Policies (CRUD but scoped to mock therapist)

```sql
-- READ: only notes for the mock therapist
create policy session_notes_select_own
on public.session_notes
for select
to anon
using (therapist_id = '00000000-0000-0000-0000-000000000001');

-- INSERT: only allow creating notes for the mock therapist
create policy session_notes_insert_own
on public.session_notes
for insert
to anon
with check (therapist_id = '00000000-0000-0000-0000-000000000001');

-- UPDATE: only allow updates on the mock therapist’s rows (not required by challenge, but included for CRUD completeness)
create policy session_notes_update_own
on public.session_notes
for update
to anon
using (therapist_id = '00000000-0000-0000-0000-000000000001')
with check (therapist_id = '00000000-0000-0000-0000-000000000001');

-- DELETE: only allow deleting the mock therapist’s rows
create policy session_notes_delete_own
on public.session_notes
for delete
to anon
using (therapist_id = '00000000-0000-0000-0000-000000000001');
```

> Result: **Anonymous client** can CRUD **only** rows whose `therapist_id` equals the seeded mock therapist. This simulates “logged in as this therapist”.

---

## 5) Frontend Changes

### 5.1 Data Model & Types

Update `SessionNote` types to include `therapist_id`.

```ts
export type SessionNote = {
  id: string;
  therapist_id: string;
  client_name: string;
  session_date: string; // YYYY-MM-DD
  quick_notes: string;
  duration_minutes: number;
  created_at: string;
};

export type NewSessionNoteInput = Omit<SessionNote, "id" | "created_at">;
```

### 5.2 Insert Flow (Always set therapist_id)

In `insertSessionNote` (in `src/lib/api.ts`) or in `NoteForm` submit handler, inject the therapist id:

```ts
import { THERAPIST_ID } from "./types"; // or constants.ts

const payload: NewSessionNoteInput = {
  therapist_id: THERAPIST_ID,
  client_name,
  session_date,
  quick_notes,
  duration_minutes,
};
```

> The rest of the client code (fetch, delete) is unchanged; RLS now ensures only this therapist’s rows are visible/mutable.

---

## 6) Edge Function (No change in contract)

* Keep `validate-session-note` as specified (duration ∈ 15–120).
* You **may** add a quick check that `therapist_id === VITE_THERAPIST_ID` if you choose to send the full note for validation, but it’s optional.

---

## 7) README Additions (Document the Mock Login & RLS)

Add a **“Mock Login & RLS”** section:

* We simulate a logged-in therapist by scoping all CRUD to a single seeded therapist row.
* **Environment:**

  * `VITE_THERAPIST_ID=00000000-0000-0000-0000-000000000001`
* **RLS:** Enabled. Policies allow the `anon` role to **CRUD only** rows where `therapist_id` equals this ID.
* **Security note:** This is for demo purposes only; do not use this approach in production.

---

## 8) Acceptance Criteria (Updated)

1. **Therapists table** exists with a single seeded therapist (`VITE_THERAPIST_ID`).
2. **session_notes** has `therapist_id` FK and all CRUD routes work from the client.
3. **RLS enabled** with policies that allow the anon role to CRUD **only** rows for the mock therapist.
4. App always **inserts** notes with `therapist_id = VITE_THERAPIST_ID`.
5. Reading and deleting notes continue to function under RLS constraints.

---

## 9) Implementation Order (Delta, ~10–15 min)

1. Create/alter tables + seed therapist.
2. Enable RLS + add policies.
3. Add `VITE_THERAPIST_ID` env + constant.
4. Update types to include `therapist_id`.
5. Ensure create path injects `therapist_id` (and optional validation step).
6. Quick regression: create → list → delete.

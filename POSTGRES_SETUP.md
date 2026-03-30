# PostgreSQL Setup For Render

This project now supports both SQLite and PostgreSQL.

## What Changed

- Locally, the app still works with SQLite by default.
- On Render, if you set `DATABASE_URL`, the app will use PostgreSQL instead.
- A migration script was added to copy student data from `backend/students.db` into PostgreSQL.

## Why PostgreSQL

SQLite stores everything in one file on disk.
PostgreSQL is a real database server.

That matters on Render because:

- SQLite files are not a good fit for cloud deployments.
- PostgreSQL is persistent and managed by Render.
- Multiple app instances can safely use PostgreSQL.

## Render Environment Variables

Set these in your Render service:

- `SECRET_KEY`
- `ALGORITHM=HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- `DATABASE_URL`

For Render PostgreSQL, you usually don't type `DATABASE_URL` manually.
Create a Render PostgreSQL database and connect its internal database URL to your web service.

## Local Behavior

If `DATABASE_URL` is not set, the app uses:

`backend/students.db`

If `DATABASE_URL` is set, the app uses PostgreSQL.

## One-Time Data Migration

After your Render PostgreSQL database is created, run this command from the project root:

```powershell
$env:DATABASE_URL="your-render-postgres-url"
backend\venv\Scripts\python.exe -m backend.scripts.migrate_sqlite_to_postgres
```

Optional:

If your SQLite file is somewhere else, also set:

```powershell
$env:SQLITE_PATH="c:\path\to\students.db"
```

## What The Migration Does

- Reads all students from SQLite
- Creates the `students` table in PostgreSQL if needed
- Copies the student rows
- Skips duplicate emails
- Updates the PostgreSQL ID sequence so new inserts continue correctly

## Important Note

Do not keep using SQLite on Render after switching to PostgreSQL.
Once PostgreSQL is connected, all new app data should go there.

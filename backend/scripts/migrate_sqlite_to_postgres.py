import os
import sqlite3
from datetime import datetime
from pathlib import Path

from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session

from backend.app.models import Base, Student


BASE_DIR = Path(__file__).resolve().parents[1]
DEFAULT_SQLITE_PATH = BASE_DIR / "students.db"


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql://", 1)
    return database_url


def get_source_rows(sqlite_path: Path) -> list[dict]:
    connection = sqlite3.connect(sqlite_path)
    connection.row_factory = sqlite3.Row
    try:
        rows = connection.execute(
            """
            SELECT id, name, email, age, course, enrollment_date
            FROM students
            ORDER BY id
            """
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        connection.close()


def main() -> None:
    source_sqlite_path = Path(
        os.getenv("SQLITE_PATH", DEFAULT_SQLITE_PATH)
    ).resolve()
    database_url = normalize_database_url(os.getenv("DATABASE_URL", ""))

    if not source_sqlite_path.exists():
        raise FileNotFoundError(f"SQLite database not found: {source_sqlite_path}")

    if not database_url:
        raise ValueError("DATABASE_URL is required for PostgreSQL migration")

    if database_url.startswith("sqlite"):
        raise ValueError("DATABASE_URL must point to PostgreSQL, not SQLite")

    rows = get_source_rows(source_sqlite_path)
    engine = create_engine(database_url, pool_pre_ping=True)
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        existing_emails = {
            email for email in session.scalars(select(Student.email)).all() if email
        }

        inserted = 0
        for row in rows:
            if row["email"] in existing_emails:
                continue

            student = Student(
                id=row["id"],
                name=row["name"],
                email=row["email"],
                age=row["age"],
                course=row["course"],
                enrollment_date=datetime.fromisoformat(row["enrollment_date"]),
            )
            session.add(student)
            existing_emails.add(row["email"])
            inserted += 1

        session.commit()

        if rows:
            max_id = max(row["id"] for row in rows)
            session.execute(
                text("SELECT setval(pg_get_serial_sequence('students', 'id'), :max_id)"),
                {"max_id": max_id},
            )
            session.commit()

    print(
        f"Migrated {inserted} students from {source_sqlite_path} to PostgreSQL."
    )


if __name__ == "__main__":
    main()

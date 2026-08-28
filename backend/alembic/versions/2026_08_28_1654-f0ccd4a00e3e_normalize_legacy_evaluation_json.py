"""normalize legacy evaluation json

Revision ID: f0ccd4a00e3e
Revises: bf228dfd0405
Create Date: 2026-08-28 16:54:27.747190

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = "f0ccd4a00e3e"
down_revision: Union[str, Sequence[str], None] = "bf228dfd0405"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Normalize legacy question evaluation JSON into the current format."""

    connection = op.get_bind()

    rows = connection.execute(
        sa.text(
            """
            SELECT id, question_evaluations
            FROM interview_evaluations
            WHERE question_evaluations IS NOT NULL
            """
        )
    ).fetchall()

    for row in rows:
        evaluation_id = row.id
        question_evaluations = row.question_evaluations

        # ---------------------------------------------------------
        # Empty evaluation
        # ---------------------------------------------------------

        if not question_evaluations:
            continue

        # ---------------------------------------------------------
        # Current format
        # ---------------------------------------------------------

        current_format = all(
            "discussion" in item
            and "score" in item
            and "strengths" in item
            and "weaknesses" in item
            and "feedback" in item
            for item in question_evaluations
        )

        if current_format:
            continue

        # ---------------------------------------------------------
        # Legacy format
        # ---------------------------------------------------------

        legacy_format = all(
            "question" in item
            and "answer" in item
            and "score" in item
            and "feedback" in item
            for item in question_evaluations
        )

        if not legacy_format:
            raise RuntimeError(
                f"Unknown question_evaluations format "
                f"for interview_evaluation id={evaluation_id}"
            )

        # ---------------------------------------------------------
        # Transform legacy → current format
        # ---------------------------------------------------------

        normalized_evaluations = []

        for item in question_evaluations:
            normalized_evaluations.append(
                {
                    "discussion": (
                        f"Question: {item['question']}\n\n"
                        f"Answer: {item['answer']}"
                    ),
                    "score": item["score"],
                    "strengths": [],
                    "weaknesses": [],
                    "feedback": item["feedback"],
                }
            )

        # ---------------------------------------------------------
        # Update database
        # ---------------------------------------------------------

        connection.execute(
            sa.update(
                sa.table(
                    "interview_evaluations",
                    sa.column("id", sa.Integer),
                    sa.column(
                        "question_evaluations",
                        JSONB,
                    ),
                )
            )
            .where(
                sa.column("id", sa.Integer) == evaluation_id
            )
            .values(
                question_evaluations=normalized_evaluations
            )
        )


def downgrade() -> None:
    """
    Convert normalized evaluations back to the legacy format.

    Note:
    The original legacy data did not contain strengths/weaknesses,
    so those fields cannot be recovered during downgrade.
    """

    connection = op.get_bind()

    rows = connection.execute(
        sa.text(
            """
            SELECT id, question_evaluations
            FROM interview_evaluations
            WHERE question_evaluations IS NOT NULL
            """
        )
    ).fetchall()

    for row in rows:
        evaluation_id = row.id
        question_evaluations = row.question_evaluations

        if not question_evaluations:
            continue

        # Only process the normalized/current format.
        current_format = all(
            "discussion" in item
            and "score" in item
            and "strengths" in item
            and "weaknesses" in item
            and "feedback" in item
            for item in question_evaluations
        )

        if not current_format:
            continue

        legacy_evaluations = []

        for item in question_evaluations:
            discussion = item["discussion"]

            question = discussion
            answer = ""

            if discussion.startswith("Question: "):
                discussion_without_prefix = discussion[
                    len("Question: "):
                ]

                if "\n\nAnswer: " in discussion_without_prefix:
                    question, answer = discussion_without_prefix.split(
                        "\n\nAnswer: ",
                        1,
                    )
                else:
                    question = discussion_without_prefix

            legacy_evaluations.append(
                {
                    "score": item["score"],
                    "answer": answer,
                    "feedback": item["feedback"],
                    "question": question,
                }
            )

        connection.execute(
            sa.update(
                sa.table(
                    "interview_evaluations",
                    sa.column("id", sa.Integer),
                    sa.column(
                        "question_evaluations",
                        JSONB,
                    ),
                )
            )
            .where(
                sa.column("id", sa.Integer) == evaluation_id
            )
            .values(
                question_evaluations=legacy_evaluations
            )
        )
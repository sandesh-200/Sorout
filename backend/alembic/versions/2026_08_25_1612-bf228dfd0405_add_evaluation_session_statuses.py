"""add evaluation session statuses

Revision ID: bf228dfd0405
Revises: 413b423984bf
Create Date: 2026-08-25 16:12:08.897107

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bf228dfd0405'
down_revision: Union[str, Sequence[str], None] = '413b423984bf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.execute(
        "ALTER TYPE interviewsessionstatus "
        "ADD VALUE IF NOT EXISTS 'evaluating'"
    )
    op.execute(
        "ALTER TYPE interviewsessionstatus "
        "ADD VALUE IF NOT EXISTS 'evaluation_failed'"
    )


def downgrade() -> None:
    pass
"""add is_ban field to PersonalInfo

Revision ID: ecf9b9be11c3
Revises: 52f03f2189da
Create Date: 2025-07-14 04:42:05.528226

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'ecf9b9be11c3'
down_revision: Union[str, None] = '52f03f2189da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

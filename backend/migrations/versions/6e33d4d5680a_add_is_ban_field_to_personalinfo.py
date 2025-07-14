"""add is_ban field to PersonalInfo

Revision ID: 6e33d4d5680a
Revises: ecf9b9be11c3
Create Date: 2025-07-14 04:43:53.070768
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6e33d4d5680a'
down_revision: Union[str, None] = 'ecf9b9be11c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the new enum type
    sem_enum = sa.Enum('sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8', name='sem')
    sem_enum.create(op.get_bind(), checkfirst=True)

    # Alter column using USING clause
    op.execute("ALTER TABLE mark ALTER COLUMN semester TYPE sem USING semester::sem")

    # Add is_ban column
    op.add_column('personalinfo', sa.Column('is_ban', sa.Boolean(), nullable=True))


def downgrade() -> None:
    # Remove is_ban column
    op.drop_column('personalinfo', 'is_ban')

    # Convert enum back to varchar
    op.execute("ALTER TABLE mark ALTER COLUMN semester TYPE VARCHAR USING semester::text")

    # Drop the enum type
    sem_enum = sa.Enum('sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8', name='sem')
    sem_enum.drop(op.get_bind(), checkfirst=True)

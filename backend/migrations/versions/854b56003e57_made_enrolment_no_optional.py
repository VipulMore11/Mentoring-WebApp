"""Made enrolment_no optional

Revision ID: 854b56003e57
Revises: 
Create Date: 2025-07-13 03:17:21.262036

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '854b56003e57'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('mentor',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('password', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('semester', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('mentor_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('student',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('mentor_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['mentor_id'], ['mentor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('achievement',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('first_year', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('second_year', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('third_year', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('final_year', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('student_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['student_id'], ['student.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('counseling',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('sr_no', sa.Integer(), nullable=False),
    sa.Column('topic', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('date', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('action_taken', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('remark', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('sign', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('student_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['student_id'], ['student.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mark',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('semester', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('marks', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('no_of_kt', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('kt_subject', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('student_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['student_id'], ['student.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('personalinfo',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('enrollment_no', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    sa.Column('date_of_birth', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('blood_group', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('aadhar_no', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('personal_email', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('atharva_email', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('mobile_no', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('father_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('father_occupation', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('father_mobile', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('mother_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('mother_occupation', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('mother_mobile', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('local_address', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('permanent_address', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('ssc', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('hsc', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('diploma', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('nss_member', sa.Boolean(), nullable=False),
    sa.Column('ember_member', sa.Boolean(), nullable=False),
    sa.Column('rhythm_member', sa.Boolean(), nullable=False),
    sa.Column('sport', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('other', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('photo', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('student_id', sa.Uuid(), nullable=True),
    sa.ForeignKeyConstraint(['student_id'], ['student.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('personalinfo')
    op.drop_table('mark')
    op.drop_table('counseling')
    op.drop_table('achievement')
    op.drop_table('student')
    op.drop_table('mentor')
    # ### end Alembic commands ###

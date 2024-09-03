"""modif customer table

Revision ID: 5cfbe26832ae
Revises: c5644dde6767
Create Date: 2024-09-03 15:33:17.461659

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5cfbe26832ae'
down_revision: Union[str, None] = 'c5644dde6767'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_user_roles_id', table_name='user_roles')
    op.drop_table('user_roles')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_roles',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('role_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], name='user_roles_role_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='user_roles_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='user_roles_pkey')
    )
    op.create_index('ix_user_roles_id', 'user_roles', ['id'], unique=False)
    # ### end Alembic commands ###

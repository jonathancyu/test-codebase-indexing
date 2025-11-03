"""add_wines_table

Revision ID: 9502b181849d
Revises:
Create Date: 2025-11-02 17:25:33.643448

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9502b181849d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'wines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('varietal', sa.String(length=100), nullable=False),
        sa.Column('vintage', sa.Integer(), nullable=True),
        sa.Column('region', sa.String(length=255), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('wines')
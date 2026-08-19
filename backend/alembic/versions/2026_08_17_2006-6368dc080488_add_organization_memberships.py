"""add organization memberships

Revision ID: 6368dc080488
Revises: e99aac8253bd
Create Date: 2026-08-17 20:06:43.368990

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "6368dc080488"
down_revision: Union[str, Sequence[str], None] = "e99aac8253bd"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ---------------------------------------------------------
    # 1. Create membership role enum
    # ---------------------------------------------------------

    membership_role = postgresql.ENUM(
        "admin",
        "candidate",
        name="membershiprole",
    )

    membership_role.create(op.get_bind(), checkfirst=True)

    # ---------------------------------------------------------
    # 2. Create organization_memberships table
    # ---------------------------------------------------------

    op.create_table(
        "organization_memberships",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("organization_id", sa.Integer(), nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM(
                "admin",
                "candidate",
                name="membershiprole",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column(
            "joined_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["organization_id"],
            ["organizations.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id",
            "organization_id",
            name="uq_user_org_membership",
        ),
    )

    op.create_index(
        "ix_organization_memberships_id",
        "organization_memberships",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_organization_memberships_user_id",
        "organization_memberships",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "ix_organization_memberships_organization_id",
        "organization_memberships",
        ["organization_id"],
        unique=False,
    )

    # ---------------------------------------------------------
    # 3. Migrate existing users into organization_memberships
    #
    # Only users who currently belong to an organization get
    # a membership.
    # ---------------------------------------------------------

    op.execute(
        """
        INSERT INTO organization_memberships (
            user_id,
            organization_id,
            role
        )
        SELECT
            id,
            organization_id,
            role::text::membershiprole
        FROM users
        WHERE organization_id IS NOT NULL
        """
    )

    # ---------------------------------------------------------
    # 4. Add invited_by to invitations
    #
    # Existing invitations have no known inviter, so NULL is
    # intentionally allowed.
    # ---------------------------------------------------------

    op.add_column(
        "invitations",
        sa.Column(
            "invited_by",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "fk_invitations_invited_by_users",
        "invitations",
        "users",
        ["invited_by"],
        ["id"],
    )

    # ---------------------------------------------------------
    # 5. Add invitation role
    #
    # Existing invitations were candidate invitations in the
    # old system, so populate them as candidate.
    # ---------------------------------------------------------

    op.add_column(
        "invitations",
        sa.Column(
            "role",
            postgresql.ENUM(
                "admin",
                "candidate",
                name="membershiprole",
                create_type=False,
            ),
            nullable=True,
        ),
    )

    op.execute(
        """
        UPDATE invitations
        SET role = 'candidate'
        WHERE role IS NULL
        """
    )

    op.alter_column(
        "invitations",
        "role",
        existing_type=postgresql.ENUM(
            "admin",
            "candidate",
            name="membershiprole",
            create_type=False,
        ),
        nullable=False,
    )

    # ---------------------------------------------------------
    # 6. Ensure existing invitation columns match the model
    # ---------------------------------------------------------

    op.alter_column(
        "invitations",
        "email",
        existing_type=sa.VARCHAR(),
        nullable=False,
    )

    op.alter_column(
        "invitations",
        "organization_id",
        existing_type=sa.INTEGER(),
        nullable=False,
    )

    op.alter_column(
        "invitations",
        "expires_at",
        existing_type=postgresql.TIMESTAMP(timezone=True),
        nullable=False,
    )

    # ---------------------------------------------------------
    # 7. User.name becomes nullable
    # ---------------------------------------------------------

    op.alter_column(
        "users",
        "name",
        existing_type=sa.VARCHAR(length=100),
        nullable=True,
    )

    # ---------------------------------------------------------
    # 8. Remove old organization relationship from users
    #
    # The data has already been migrated above.
    # ---------------------------------------------------------

    op.drop_index(
        op.f("ix_users_organization_id"),
        table_name="users",
    )

    op.drop_constraint(
        op.f("users_organization_id_fkey"),
        "users",
        type_="foreignkey",
    )

    op.drop_column(
        "users",
        "role",
    )

    op.drop_column(
        "users",
        "organization_id",
    )


def downgrade() -> None:
    """Downgrade schema."""

    # ---------------------------------------------------------
    # 1. Restore users.organization_id
    # ---------------------------------------------------------

    op.add_column(
        "users",
        sa.Column(
            "organization_id",
            sa.INTEGER(),
            nullable=True,
        ),
    )

    op.create_index(
        op.f("ix_users_organization_id"),
        "users",
        ["organization_id"],
        unique=False,
    )

    op.create_foreign_key(
        op.f("users_organization_id_fkey"),
        "users",
        "organizations",
        ["organization_id"],
        ["id"],
    )

    # ---------------------------------------------------------
    # 2. Restore users.role
    #
    # The old users.role was based on the userrole enum.
    # Create it if it doesn't exist.
    # ---------------------------------------------------------

    user_role = postgresql.ENUM(
        "admin",
        "candidate",
        name="userrole",
    )

    user_role.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "users",
        sa.Column(
            "role",
            postgresql.ENUM(
                "admin",
                "candidate",
                name="userrole",
                create_type=False,
            ),
            nullable=True,
        ),
    )

    # ---------------------------------------------------------
    # 3. Restore user organization + role from memberships
    #
    # The old schema supported only one organization per user.
    #
    # If a user somehow belongs to multiple organizations,
    # choose the earliest membership.
    # ---------------------------------------------------------

    op.execute(
        """
        UPDATE users u
        SET
            organization_id = m.organization_id,
            role = m.role::text::userrole
        FROM (
            SELECT DISTINCT ON (user_id)
                user_id,
                organization_id,
                role
            FROM organization_memberships
            ORDER BY user_id, joined_at ASC, id ASC
        ) m
        WHERE u.id = m.user_id
        """
    )

    # Users without memberships need the old default role.
    op.execute(
        """
        UPDATE users
        SET role = 'candidate'
        WHERE role IS NULL
        """
    )

    op.alter_column(
        "users",
        "role",
        existing_type=postgresql.ENUM(
            "admin",
            "candidate",
            name="userrole",
            create_type=False,
        ),
        nullable=False,
    )

    # ---------------------------------------------------------
    # 4. Restore users.name requirement
    # ---------------------------------------------------------

    op.alter_column(
        "users",
        "name",
        existing_type=sa.VARCHAR(length=100),
        nullable=False,
    )

    # ---------------------------------------------------------
    # 5. Remove invitation additions
    # ---------------------------------------------------------

    op.drop_constraint(
        "fk_invitations_invited_by_users",
        "invitations",
        type_="foreignkey",
    )

    op.drop_column(
        "invitations",
        "role",
    )

    op.drop_column(
        "invitations",
        "invited_by",
    )

    # ---------------------------------------------------------
    # 6. Restore original invitation nullability
    # ---------------------------------------------------------

    op.alter_column(
        "invitations",
        "expires_at",
        existing_type=postgresql.TIMESTAMP(timezone=True),
        nullable=True,
    )

    op.alter_column(
        "invitations",
        "organization_id",
        existing_type=sa.INTEGER(),
        nullable=True,
    )

    op.alter_column(
        "invitations",
        "email",
        existing_type=sa.VARCHAR(),
        nullable=True,
    )

    # ---------------------------------------------------------
    # 7. Remove membership indexes/table
    # ---------------------------------------------------------

    op.drop_index(
        "ix_organization_memberships_organization_id",
        table_name="organization_memberships",
    )

    op.drop_index(
        "ix_organization_memberships_user_id",
        table_name="organization_memberships",
    )

    op.drop_index(
        "ix_organization_memberships_id",
        table_name="organization_memberships",
    )

    op.drop_table(
        "organization_memberships",
    )

    # ---------------------------------------------------------
    # 8. Drop membership enum
    # ---------------------------------------------------------

    membership_role = postgresql.ENUM(
        "admin",
        "candidate",
        name="membershiprole",
    )

    membership_role.drop(op.get_bind(), checkfirst=True)
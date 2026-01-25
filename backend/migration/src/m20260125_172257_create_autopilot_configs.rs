use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AutopilotConfig::Table)
                    .if_not_exists()
                    .col(pk_auto(AutopilotConfig::Id))
                    .col(string(AutopilotConfig::UserId))
                    .col(boolean(AutopilotConfig::Enabled).default(false))
                    .col(json(AutopilotConfig::Criteria))
                    .col(timestamp_null(AutopilotConfig::LastRunAt))
                    .col(timestamp_null(AutopilotConfig::NextRunAt))
                    .col(timestamp(AutopilotConfig::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp(AutopilotConfig::UpdatedAt).default(Expr::current_timestamp()))
                    // Note: Skipping foreign key constraint as users table is managed by Prisma
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_autopilot_config_user_id")
                    .table(AutopilotConfig::Table)
                    .col(AutopilotConfig::UserId)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AutopilotConfig::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum AutopilotConfig {
    Table,
    Id,
    UserId,
    Enabled,
    Criteria,
    LastRunAt,
    NextRunAt,
    CreatedAt,
    UpdatedAt,
}

// User table managed by Prisma

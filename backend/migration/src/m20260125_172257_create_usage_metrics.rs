use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(UsageMetrics::Table)
                    .if_not_exists()
                    .col(pk_auto(UsageMetrics::Id))
                    .col(string(UsageMetrics::UserId))
                    .col(string(UsageMetrics::Month))
                    .col(integer(UsageMetrics::ApplicationsCount).default(0))
                    .col(integer(UsageMetrics::AgentMessagesCount).default(0))
                    .col(integer(UsageMetrics::ResumesCreated).default(0))
                    .col(timestamp(UsageMetrics::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp(UsageMetrics::UpdatedAt).default(Expr::current_timestamp()))
                    // Note: Skipping foreign key constraint as users table is managed by Prisma
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_usage_metrics_user_id")
                    .table(UsageMetrics::Table)
                    .col(UsageMetrics::UserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_usage_metrics_month")
                    .table(UsageMetrics::Table)
                    .col(UsageMetrics::Month)
                    .to_owned(),
            )
            .await?;

        // Unique constraint on user_id + month
        manager
            .create_index(
                Index::create()
                    .name("idx_usage_metrics_user_month")
                    .table(UsageMetrics::Table)
                    .col(UsageMetrics::UserId)
                    .col(UsageMetrics::Month)
                    .unique()
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(UsageMetrics::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum UsageMetrics {
    Table,
    Id,
    UserId,
    Month,
    ApplicationsCount,
    AgentMessagesCount,
    ResumesCreated,
    CreatedAt,
    UpdatedAt,
}

// User table managed by Prisma

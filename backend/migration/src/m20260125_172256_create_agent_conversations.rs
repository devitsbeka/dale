use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AgentConversation::Table)
                    .if_not_exists()
                    .col(pk_auto(AgentConversation::Id))
                    .col(string(AgentConversation::UserId))
                    .col(json(AgentConversation::Messages))
                    .col(json_null(AgentConversation::Metadata))
                    .col(timestamp(AgentConversation::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp(AgentConversation::UpdatedAt).default(Expr::current_timestamp()))
                    // Note: Skipping foreign key constraint as users table is managed by Prisma
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_agent_conversation_user_id")
                    .table(AgentConversation::Table)
                    .col(AgentConversation::UserId)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AgentConversation::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum AgentConversation {
    Table,
    Id,
    UserId,
    Messages,
    Metadata,
    CreatedAt,
    UpdatedAt,
}

// User table managed by Prisma

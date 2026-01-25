use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Subscription::Table)
                    .if_not_exists()
                    .col(pk_auto(Subscription::Id))
                    .col(string(Subscription::UserId))
                    .col(string_null(Subscription::StripeCustomerId))
                    .col(string_null(Subscription::StripeSubscriptionId))
                    .col(string_null(Subscription::StripePriceId))
                    .col(timestamp_null(Subscription::StripeCurrentPeriodEnd))
                    .col(string(Subscription::Tier).default("FREE"))
                    .col(string(Subscription::Status).default("ACTIVE"))
                    .col(timestamp(Subscription::CreatedAt).default(Expr::current_timestamp()))
                    .col(timestamp(Subscription::UpdatedAt).default(Expr::current_timestamp()))
                    // Note: Skipping foreign key constraint as users table is managed by Prisma
                    // .foreign_key(
                    //     ForeignKey::create()
                    //         .name("fk_subscription_user")
                    //         .from(Subscription::Table, Subscription::UserId)
                    //         .to(Alias::new("users"), Alias::new("id"))
                    //         .on_delete(ForeignKeyAction::Cascade),
                    // )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_subscription_user_id")
                    .table(Subscription::Table)
                    .col(Subscription::UserId)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Subscription::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Subscription {
    Table,
    Id,
    UserId,
    StripeCustomerId,
    StripeSubscriptionId,
    StripePriceId,
    StripeCurrentPeriodEnd,
    Tier,
    Status,
    CreatedAt,
    UpdatedAt,
}

// #[derive(DeriveIden)]
// enum User {
//     Table,
//     Id,
// }

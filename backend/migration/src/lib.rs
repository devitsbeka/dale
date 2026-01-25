pub use sea_orm_migration::prelude::*;

mod m20260125_172256_create_subscriptions;
mod m20260125_172256_create_agent_conversations;
mod m20260125_172257_create_autopilot_configs;
mod m20260125_172257_create_usage_metrics;
mod m20260125_174834_add_password_to_users;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260125_172256_create_subscriptions::Migration),
            Box::new(m20260125_172256_create_agent_conversations::Migration),
            Box::new(m20260125_172257_create_autopilot_configs::Migration),
            Box::new(m20260125_172257_create_usage_metrics::Migration),
            Box::new(m20260125_174834_add_password_to_users::Migration),
        ]
    }
}

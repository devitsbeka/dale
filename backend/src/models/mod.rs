// Entity modules
pub mod agent_conversation;
pub mod autopilot_config;
pub mod job;
pub mod resume;
pub mod subscription;
pub mod usage_metrics;
pub mod user;

// Prelude for easy imports
pub mod prelude {
    pub use super::agent_conversation::{Entity as AgentConversation, Model as AgentConversationModel};
    pub use super::autopilot_config::{Entity as AutopilotConfig, Model as AutopilotConfigModel};
    pub use super::job::{Entity as Job, Model as JobModel};
    pub use super::resume::{Entity as Resume, Model as ResumeModel};
    pub use super::subscription::{
        Entity as Subscription, Model as SubscriptionModel, SubscriptionStatus, SubscriptionTier,
    };
    pub use super::usage_metrics::{Entity as UsageMetrics, Model as UsageMetricsModel};
    pub use super::user::{Entity as User, Model as UserModel};
}

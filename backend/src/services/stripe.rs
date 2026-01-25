// Simplified Stripe service using REST API directly
// TODO: Replace with async-stripe SDK once build issues are resolved

use crate::utils::ApiError;
use crate::models::subscription::{SubscriptionTier, SubscriptionStatus};

#[derive(Clone, Debug)]
pub struct StripeService {
    secret_key: String,
    client: reqwest::Client,
}

impl StripeService {
    pub fn new(secret_key: String) -> Self {
        Self {
            secret_key,
            client: reqwest::Client::new(),
        }
    }

    /// Get subscription tier from price ID
    pub fn price_id_to_tier(price_id: &str) -> SubscriptionTier {
        // These will be environment variables in production
        match price_id {
            "price_pro" | "price_1ProMonthly" => SubscriptionTier::Pro,
            "price_elite" | "price_1EliteMonthly" => SubscriptionTier::Elite,
            _ => SubscriptionTier::Free,
        }
    }

    /// Convert Stripe subscription status string to our enum
    pub fn convert_status(status: &str) -> SubscriptionStatus {
        match status {
            "active" => SubscriptionStatus::Active,
            "canceled" => SubscriptionStatus::Canceled,
            "past_due" => SubscriptionStatus::PastDue,
            "trialing" => SubscriptionStatus::Trialing,
            _ => SubscriptionStatus::Canceled,
        }
    }
}

// Pricing configuration
pub struct PricingConfig {
    pub free_applications_limit: i32,
    pub pro_applications_limit: i32,
    pub elite_applications_limit: i32,
    pub free_messages_limit: i32,
    pub pro_messages_limit: i32,
    pub elite_messages_limit: i32,
}

impl PricingConfig {
    pub fn default() -> Self {
        Self {
            free_applications_limit: 5,
            pro_applications_limit: 50,
            elite_applications_limit: i32::MAX, // unlimited
            free_messages_limit: 10,
            pro_messages_limit: 200,
            elite_messages_limit: i32::MAX, // unlimited
        }
    }

    pub fn get_application_limit(&self, tier: &SubscriptionTier) -> i32 {
        match tier {
            SubscriptionTier::Free => self.free_applications_limit,
            SubscriptionTier::Pro => self.pro_applications_limit,
            SubscriptionTier::Elite => self.elite_applications_limit,
        }
    }

    pub fn get_message_limit(&self, tier: &SubscriptionTier) -> i32 {
        match tier {
            SubscriptionTier::Free => self.free_messages_limit,
            SubscriptionTier::Pro => self.pro_messages_limit,
            SubscriptionTier::Elite => self.elite_messages_limit,
        }
    }
}

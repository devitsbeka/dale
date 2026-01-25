// Simplified webhook handler
// TODO: Implement full Stripe webhook verification once async-stripe SDK is working

use axum::{
    extract::{Request, State},
    Json,
};
use sea_orm::DatabaseConnection;
use serde::{Deserialize, Serialize};

use crate::{
    services::stripe::StripeService,
    utils::ApiError,
};

#[derive(Debug, Clone)]
pub struct WebhookState {
    pub db: DatabaseConnection,
    pub stripe_service: StripeService,
    pub webhook_secret: String,
}

#[derive(Serialize)]
pub struct WebhookResponse {
    pub received: bool,
}

#[derive(Deserialize)]
pub struct WebhookEvent {
    #[serde(rename = "type")]
    pub event_type: String,
    pub data: serde_json::Value,
}

/// Handle Stripe webhook events
/// TODO: Add signature verification
pub async fn handle_stripe_webhook(
    State(state): State<WebhookState>,
    Json(event): Json<WebhookEvent>,
) -> Result<Json<WebhookResponse>, ApiError> {
    tracing::info!("Received Stripe webhook: {}", event.event_type);

    // TODO: Verify webhook signature using state.webhook_secret

    // Handle different event types
    match event.event_type.as_str() {
        "customer.subscription.created" | "customer.subscription.updated" => {
            tracing::info!("Subscription updated");
            // TODO: Update subscription in database
        }
        "customer.subscription.deleted" => {
            tracing::info!("Subscription canceled");
            // TODO: Mark subscription as canceled in database
        }
        "invoice.payment_succeeded" => {
            tracing::info!("Payment succeeded");
        }
        "invoice.payment_failed" => {
            tracing::warn!("Payment failed");
        }
        _ => {
            tracing::debug!("Unhandled webhook event type: {}", event.event_type);
        }
    }

    Ok(Json(WebhookResponse { received: true }))
}

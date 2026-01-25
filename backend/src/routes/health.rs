use axum::{extract::State, Json};
use sea_orm::DatabaseConnection;
use serde::Serialize;

use crate::utils::ApiError;

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    database: String,
}

pub async fn health_check(
    State(db): State<DatabaseConnection>,
) -> Result<Json<HealthResponse>, ApiError> {
    // Try to ping database
    let db_status = match db.ping().await {
        Ok(_) => "connected".to_string(),
        Err(e) => format!("error: {}", e),
    };

    Ok(Json(HealthResponse {
        status: "ok".to_string(),
        database: db_status,
    }))
}

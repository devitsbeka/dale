use axum::{
    extract::{Request, State},
    http::{header, StatusCode},
    middleware::Next,
    response::Response,
};

use crate::{services::auth::AuthService, utils::ApiError};

/// Extract JWT token from Authorization header
pub async fn auth_middleware(
    State(auth_service): State<AuthService>,
    mut request: Request,
    next: Next,
) -> Result<Response, ApiError> {
    // Extract token from Authorization header
    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .ok_or_else(|| ApiError::Unauthorized("Missing authorization header".to_string()))?;

    // Parse Bearer token
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| ApiError::Unauthorized("Invalid authorization format".to_string()))?;

    // Validate token and extract claims
    let claims = auth_service.validate_token(token)?;

    // Add user_id to request extensions for downstream handlers
    request.extensions_mut().insert(claims.sub.clone());

    Ok(next.run(request).await)
}

/// Extract user ID from request extensions (set by auth_middleware)
pub fn get_user_id_from_request(request: &Request) -> Result<String, ApiError> {
    request
        .extensions()
        .get::<String>()
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("User not authenticated".to_string()))
}

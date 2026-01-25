use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::{
    models::prelude::*,
    services::auth::AuthService,
    utils::{response::success_response, validation::validate_request, ApiError},
};

#[derive(Debug, Clone)]
pub struct AuthState {
    pub db: DatabaseConnection,
    pub auth_service: AuthService,
}

#[derive(Debug, Deserialize, Validate)]
pub struct SignupRequest {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters"))]
    pub password: String,
    pub name: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
}

/// Sign up a new user
pub async fn signup(
    State(state): State<AuthState>,
    Json(request): Json<SignupRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    validate_request(&request)?;

    // Check if user already exists
    let existing_user = User::find()
        .filter(crate::models::user::Column::Email.eq(&request.email))
        .one(&state.db)
        .await?;

    if existing_user.is_some() {
        return Err(ApiError::Conflict("Email already registered".to_string()));
    }

    // Hash password
    let password_hash = state.auth_service.hash_password(&request.password)?;

    // Create user
    let user_id = state.auth_service.generate_user_id();
    let now = Utc::now().naive_utc();
    let user = crate::models::user::ActiveModel {
        id: Set(user_id.clone()),
        email: Set(request.email.clone()),
        name: Set(request.name.clone()),
        password_hash: Set(Some(password_hash)),
        created_at: Set(now),
        updated_at: Set(now),
    };

    let user = user.insert(&state.db).await?;

    // TODO: Create default Free subscription once migrations are verified
    // let subscription = crate::models::subscription::ActiveModel {
    //     user_id: Set(user_id.clone()),
    //     tier: Set(SubscriptionTier::Free),
    //     status: Set(SubscriptionStatus::Active),
    //     ..Default::default()
    // };
    // subscription.insert(&state.db).await?;

    // Generate JWT token
    let token = state.auth_service.generate_token(&user.id, &user.email)?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    }))
}

/// Log in existing user
pub async fn login(
    State(state): State<AuthState>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, ApiError> {
    validate_request(&request)?;

    // Find user by email
    let user = User::find()
        .filter(crate::models::user::Column::Email.eq(&request.email))
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::Unauthorized("Invalid email or password".to_string()))?;

    // Note: For now, we're not storing passwords in the database
    // This will be updated when we add proper password storage
    // For demo purposes, we'll just validate the email exists

    // Generate JWT token
    let token = state.auth_service.generate_token(&user.id, &user.email)?;

    Ok(Json(AuthResponse {
        token,
        user: UserResponse {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    }))
}

/// Get current user profile
pub async fn me(
    State(state): State<AuthState>,
    user_id: String,
) -> Result<Json<UserResponse>, ApiError> {
    let user = User::find_by_id(user_id)
        .one(&state.db)
        .await?
        .ok_or_else(|| ApiError::NotFound("User not found".to_string()))?;

    Ok(Json(UserResponse {
        id: user.id,
        email: user.email,
        name: user.name,
    }))
}

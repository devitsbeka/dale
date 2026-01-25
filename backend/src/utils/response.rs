use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

#[derive(Serialize)]
pub struct SuccessResponse<T: Serialize> {
    pub success: bool,
    pub data: T,
}

#[derive(Serialize)]
pub struct MessageResponse {
    pub success: bool,
    pub message: String,
}

pub fn success_response<T: Serialize>(data: T) -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(SuccessResponse {
            success: true,
            data,
        }),
    )
}

pub fn created_response<T: Serialize>(data: T) -> impl IntoResponse {
    (
        StatusCode::CREATED,
        Json(SuccessResponse {
            success: true,
            data,
        }),
    )
}

pub fn message_response(message: String) -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(MessageResponse {
            success: true,
            message,
        }),
    )
}

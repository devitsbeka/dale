use validator::Validate;
use crate::utils::error::ApiError;

pub fn validate_request<T: Validate>(data: &T) -> Result<(), ApiError> {
    data.validate()
        .map_err(|e| ApiError::ValidationError(e.to_string()))
}

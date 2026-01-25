use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::utils::ApiError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub exp: i64, // expiration timestamp
    pub iat: i64, // issued at timestamp
}

#[derive(Clone, Debug)]
pub struct AuthService {
    jwt_secret: String,
}

impl AuthService {
    pub fn new(jwt_secret: String) -> Self {
        Self { jwt_secret }
    }

    /// Generate JWT token for user
    pub fn generate_token(&self, user_id: &str, email: &str) -> Result<String, ApiError> {
        let now = Utc::now();
        let exp = now + Duration::days(30); // 30 day expiration

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            exp: exp.timestamp(),
            iat: now.timestamp(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|e| ApiError::InternalServerError(format!("Failed to generate token: {}", e)))
    }

    /// Validate JWT token and extract claims
    pub fn validate_token(&self, token: &str) -> Result<Claims, ApiError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| ApiError::Unauthorized(format!("Invalid token: {}", e)))
    }

    /// Hash password
    pub fn hash_password(&self, password: &str) -> Result<String, ApiError> {
        hash(password, DEFAULT_COST)
            .map_err(|e| ApiError::InternalServerError(format!("Failed to hash password: {}", e)))
    }

    /// Verify password against hash
    pub fn verify_password(&self, password: &str, hash: &str) -> Result<bool, ApiError> {
        verify(password, hash)
            .map_err(|e| ApiError::InternalServerError(format!("Failed to verify password: {}", e)))
    }

    /// Generate new user ID
    pub fn generate_user_id(&self) -> String {
        format!("user_{}", Uuid::new_v4())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_password_hashing() {
        let service = AuthService::new("test_secret".to_string());
        let password = "my_secure_password";

        let hash = service.hash_password(password).unwrap();
        assert!(service.verify_password(password, &hash).unwrap());
        assert!(!service.verify_password("wrong_password", &hash).unwrap());
    }

    #[test]
    fn test_jwt_token() {
        let service = AuthService::new("test_secret".to_string());
        let user_id = "user_123";
        let email = "test@example.com";

        let token = service.generate_token(user_id, email).unwrap();
        let claims = service.validate_token(&token).unwrap();

        assert_eq!(claims.sub, user_id);
        assert_eq!(claims.email, email);
    }
}

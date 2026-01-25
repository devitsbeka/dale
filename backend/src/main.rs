use axum::{
    http::{header, Method},
    routing::{get, post},
    Router,
};
use sea_orm::Database;
use std::net::SocketAddr;
use tower_http::{
    cors::CorsLayer,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod middleware;
mod models;
mod routes;
mod services;
mod utils;

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "careeros_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = config::Config::from_env()
        .expect("Failed to load configuration from environment");

    tracing::info!("Connecting to database...");

    // Connect to database
    let db = Database::connect(&config.database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("Database connected successfully");

    // Initialize services
    let auth_service = services::auth::AuthService::new(config.jwt_secret.clone());
    let stripe_service = services::stripe::StripeService::new(config.stripe_secret_key.clone());

    // Configure CORS - allow specific origins with credentials
    let cors = CorsLayer::new()
        .allow_origin([
            "http://localhost:3000".parse::<axum::http::HeaderValue>().unwrap(),
            "http://localhost:3001".parse::<axum::http::HeaderValue>().unwrap(),
            "https://dale-eta.vercel.app".parse::<axum::http::HeaderValue>().unwrap(),
        ])
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION, header::ACCEPT])
        .allow_credentials(true);

    // Create auth routes with their own state
    let auth_routes = Router::new()
        .route("/signup", post(routes::auth::signup))
        .route("/login", post(routes::auth::login))
        .with_state(routes::auth::AuthState {
            db: db.clone(),
            auth_service: auth_service.clone(),
        });

    // Create webhook routes with their own state
    let webhook_routes = Router::new()
        .route("/stripe", post(routes::webhooks::handle_stripe_webhook))
        .with_state(routes::webhooks::WebhookState {
            db: db.clone(),
            stripe_service: stripe_service.clone(),
            webhook_secret: config.stripe_webhook_secret.clone(),
        });

    // Build our application with routes
    let app = Router::new()
        // Public routes
        .route("/health", get(routes::health::health_check))
        .nest("/auth", auth_routes)
        .nest("/webhooks", webhook_routes)
        // Protected routes
        // .route("/auth/me", get(routes::auth::me))
        //     .layer(axum::middleware::from_fn_with_state(
        //         auth_service.clone(),
        //         middleware::auth::auth_middleware,
        //     ))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(db);

    // Run the server
    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}

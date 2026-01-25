# Build stage
FROM rust:1.75 as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./
COPY migration/Cargo.toml ./migration/

# Copy source code
COPY src ./src
COPY migration/src ./migration/src

# Build for release
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/careeros-backend /app/careeros-backend

# Expose port
EXPOSE 8080

# Run the binary
CMD ["/app/careeros-backend"]

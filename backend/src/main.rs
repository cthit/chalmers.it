use axum::{extract::State, routing::get};
use dotenv::dotenv;
use http::StatusCode;
use std::sync::Arc;
use tower_request_id::RequestIdLayer;
use tracing::info;

mod api;
mod logging;

struct AppState {
    name: String,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let _logging_guard = logging::setup_logging();

    let trace_layer = logging::http::trace_layer();

    let app = axum::Router::new()
        .merge(api::swagger_router())
        .nest("/api", api::router())
        .nest("/", test_router())
        .layer(trace_layer)
        .layer(RequestIdLayer);

    info!("Starting server on localhost:3000");
    axum::Server::bind(
        &"0.0.0.0:3000"
            .parse()
            .expect("IP address and port are not valid."),
    )
    .serve(app.into_make_service())
    .await
    .expect("Axum crashed.")
}

fn test_router() -> axum::Router {
    axum::Router::new()
        .route("/", get(hello_world))
        .route("/fail", get(fail))
        .with_state(Arc::new(AppState {
            name: "Hello, world!".into(),
        }))
}

#[utoipa::path(get, path = "/", responses((status = 200, description = "Todo item created successfully", body = String),))]
async fn hello_world(State(app_state): State<Arc<AppState>>) -> String {
    app_state.name.clone()
}

async fn fail() -> Result<String, (StatusCode, String)> {
    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        "Stuff's not working!".into(),
    ))
}

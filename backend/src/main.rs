use std::sync::Arc;

use axum::{extract::State, routing::get};
use dotenv::dotenv;
use http::StatusCode;
use tower_request_id::RequestIdLayer;
use tracing::info;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod logging;

struct AppState {
    name: String,
}

#[derive(OpenApi)]
#[openapi(paths(hello_world))]
struct ApiDoc;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let _logging_guard = logging::setup_logging();

    let trace_layer = logging::http::trace_layer();

    let app = axum::Router::new()
        .merge(SwaggerUi::new("/api/swagger").url("/api/v1/openapi.json", ApiDoc::openapi()))
        .route("/", get(hello_world))
        .route("/fail", get(fail))
        .layer(trace_layer)
        .layer(RequestIdLayer)
        .with_state(Arc::new(AppState {
            name: "Hello, world!".into(),
        }));

    info!("Starting server on 0.0.0.0:3000");
    axum::Server::bind(
        &"0.0.0.0:3000"
            .parse()
            .expect("I can see that it is correct"),
    )
    .serve(app.into_make_service())
    .await
    .expect("Axum crashed.")
}

#[utoipa::path(get, path = "/", responses((status = 200, description = "Todo item created successfully", body = String),))]
async fn hello_world(State(state): State<Arc<AppState>>) -> String {
    state.name.clone()
}

async fn fail() -> Result<String, (StatusCode, String)> {
    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        "Stuff's not working!".into(),
    ))
}

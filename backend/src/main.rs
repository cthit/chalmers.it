use axum::routing::get;
use dotenv::dotenv;
use http::StatusCode;
use tower_request_id::RequestIdLayer;
use tracing::info;

mod logging;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let _logging_guard = logging::setup_logging();

    let trace_layer = logging::http::trace_layer();

    let app = axum::Router::new()
        .route("/", get(hello_world))
        .route("/fail", get(fail))
        .layer(trace_layer)
        .layer(RequestIdLayer);

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

async fn hello_world() -> &'static str {
    "Hello, world!"
}

async fn fail() -> Result<String, (StatusCode, String)> {
    Err((
        StatusCode::INTERNAL_SERVER_ERROR,
        "Stuff's not working!".into(),
    ))
}

use axum::{Router, routing::get};

pub fn router() -> Router {
    axum::Router::new()
        .route("/list", get(news_list))
}

#[utoipa::path(get, path = "/api/v1/news/list", responses((status = 200, description = "Todo item created successfully", body = String),))]
pub async fn news_list() -> String {
    "[\"Imagine that this is a list of news items\"]".into()
}

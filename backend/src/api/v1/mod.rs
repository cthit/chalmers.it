use axum::Router;
use utoipa::OpenApi;

mod news;

#[derive(OpenApi)]
#[openapi(paths(news::news_list))]
pub struct ApiDoc;

pub fn router() -> Router {
    axum::Router::new()
        .nest("/news", news::router())
}

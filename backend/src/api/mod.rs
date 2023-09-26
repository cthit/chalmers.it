use axum::Router;
use utoipa::OpenApi;
use utoipa_swagger_ui::{Url, SwaggerUi, Config};

pub mod v1;

pub fn router() -> Router {
    axum::Router::new()
        .nest("/v1", v1::router())
}

pub fn swagger_router() -> Router {
    const V1_OPENAPI_URL: &str = "/api/v1/openapi.json";
    
    let config = Config::new([
        Url::new("v1", V1_OPENAPI_URL),
    ]);

    SwaggerUi::new("/swagger").url(V1_OPENAPI_URL, v1::ApiDoc::openapi()).config(config).into()
}

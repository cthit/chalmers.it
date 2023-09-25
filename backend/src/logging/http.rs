use http::Request;
use hyper::Body;
use tower_http::{classify::*, trace::*};
use tower_request_id::RequestId;
use tracing::*;

pub fn trace_layer() -> TraceLayer<
    SharedClassifier<ServerErrorsAsFailures>,
    impl Fn(&Request<Body>) -> Span + Clone,
    DefaultOnRequest,
    HttpLogger,
    DefaultOnBodyChunk,
    DefaultOnEos,
    HttpLogger,
> {
    TraceLayer::new_for_http()
        .make_span_with(|request: &Request<Body>| {
            // We get the request id from the extensions
            let request_id = request
                .extensions()
                .get::<RequestId>()
                .map(ToString::to_string)
                .unwrap_or_else(|| "unknown".into());
            // And then we put it along with other information into the `request` span
            tracing::error_span!(
                "request",
                //"",
                id = %request_id,
                method = %request.method(),
                uri = %request.uri(),
            )
        })
        .on_response(HttpLogger {})
        .on_failure(HttpLogger {})
}

#[derive(Clone)]
pub struct HttpLogger;

impl<B> OnResponse<B> for HttpLogger {
    fn on_response(
        self,
        _response: &http::Response<B>,
        _latency: std::time::Duration,
        span: &Span,
    ) {
        info!(parent: span, "WOW! You Got Served!");
    }
}

impl<B> OnFailure<B> for HttpLogger
where
    B: std::fmt::Debug,
{
    fn on_failure(&mut self, error: B, _latency: std::time::Duration, span: &Span) {
        error!(parent: span, "Oh no! You got an error! {:?}", error);
    }
}

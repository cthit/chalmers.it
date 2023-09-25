mod formatter;
pub mod http;

use tracing::*;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::{
    fmt::{self, writer::MakeWriterExt},
    prelude::__tracing_subscriber_SubscriberExt,
};

const LOG_LEVEL: Level = Level::INFO;

pub fn setup_logging() -> WorkerGuard {
    let appender = tracing_appender::rolling::hourly("logs/", "application.log");
    let (non_blocking, guard) = tracing_appender::non_blocking(appender);

    let subscriber = tracing_subscriber::registry()
        .with(
            fmt::Layer::new()
                .with_writer(std::io::stdout.with_max_level(LOG_LEVEL))
                .event_format(formatter::CustomFormatter),
        )
        .with(
            fmt::Layer::new()
                .with_writer(non_blocking.with_max_level(LOG_LEVEL))
                .json(),
        );

    tracing::subscriber::set_global_default(subscriber).expect("Setting default subscriber failed");

    guard
}

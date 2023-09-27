package logging

import (
	"net/http"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
	"github.com/go-chi/chi/v5/middleware"
)

func SetupColors() {
	log.SetTimeFormat("2006-01-02 15:04:05")
	log.TimestampStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FAFAFA"))

	log.KeyStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#535353"))
}

func RequestLogger() func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			t1 := time.Now()
			defer func() {
				statusToLevelLogger(ww.Status())("Request processed", "address", r.RemoteAddr, "method", r.Method, "path", r.URL.Path, "status", ww.Status(), "bytes", ww.BytesWritten(), "duration", time.Since(t1).String())
				//entry.Write(ww.Status(), ww.BytesWritten(), ww.Header(), time.Since(t1), nil)
			}()

			next.ServeHTTP(ww, r)
		}
		return http.HandlerFunc(fn)
	}
}

func statusToLevelLogger(status int) func(msg interface{}, keyvals ...interface{}) {
	if status >= 500 {
		return log.Error
	}
	return log.Info
}

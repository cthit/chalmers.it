package logging

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
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
				duration := time.Since(t1)

				req := lipgloss.NewStyle().Background(statusToTextBackground(ww.Status())).Foreground(lipgloss.Color("#666666")).Render(strconv.Itoa(ww.Status()))
				method := lipgloss.NewStyle().Foreground(lipgloss.Color("#4dd2ff")).Render(r.Method)
				path := lipgloss.NewStyle().Foreground(lipgloss.Color("#09cdda")).Render(r.URL.Path)
				remote := lipgloss.NewStyle().Foreground(lipgloss.Color("#a8feff")).Align(lipgloss.Left).Width(16).Render(strings.Split(r.RemoteAddr, ":")[0])
				dur := lipgloss.NewStyle().Foreground(lipgloss.Color("#aaff80")).Render(duration.String())
				size := lipgloss.NewStyle().Foreground(lipgloss.Color("#ccffb3")).Render(strconv.Itoa(ww.BytesWritten()) + "B")

				msg := fmt.Sprintf("%s %s%s %s %s %s", req, remote, method, path, dur, size)
				statusToLevelLogger(ww.Status())(msg)
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

func statusToTextBackground(status int) lipgloss.Color {
	if status >= 500 {
		return lipgloss.Color("#FF0000")
	}
	if status >= 400 {
		return lipgloss.Color("#FFA500")
	}
	if status >= 300 {
		return lipgloss.Color("#FFFF00")
	}
	if status >= 200 {
		return lipgloss.Color("#00FF00")
	}
	return lipgloss.Color("#FFFFFF")
}

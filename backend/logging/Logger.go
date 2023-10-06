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

var reqStyle lipgloss.Style
var methodStyle lipgloss.Style
var pathStyle lipgloss.Style
var remoteStyle lipgloss.Style
var timeStyle lipgloss.Style
var sizeStyle lipgloss.Style

func init() {
	reqStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#666666"))
	methodStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#4dd2ff"))
	pathStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#09cdda"))
	remoteStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#a8feff")).Align(lipgloss.Left).Width(16)
	timeStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#aaff80"))
	sizeStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#ccffb3"))
}

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
				// We might want to log this if the request is external
				if r.URL.Path == "/ping" {
					return
				}

				duration := time.Since(t1)

				req := reqStyle.Background(httpStatusToTextBackground(ww.Status())).Render(strconv.Itoa(ww.Status()))
				method := methodStyle.Render(r.Method)
				path := pathStyle.Render(r.URL.Path)
				remote := remoteStyle.Render(strings.Split(r.RemoteAddr, ":")[0])
				dur := timeStyle.Render(duration.String())
				size := sizeStyle.Render(strconv.Itoa(ww.BytesWritten()) + "B")

				msg := fmt.Sprintf("%s %s%s %s %s %s", req, remote, method, path, dur, size)
				httpStatusToLevelLogger(ww.Status())(msg)
			}()

			next.ServeHTTP(ww, r)
		}
		return http.HandlerFunc(fn)
	}
}

func httpStatusToLevelLogger(status int) func(msg interface{}, keyvals ...interface{}) {
	if status >= 500 {
		return log.Error
	}
	return log.Info
}

func httpStatusToTextBackground(status int) lipgloss.Color {
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

package apiv1

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func News() chi.Router {
	r := chi.NewRouter()
	r.Get("/list", getNews)
	return r
}

func getNews(w http.ResponseWriter, r *http.Request) {
	slog.Warn("This is a warning")
	slog.Debug("This is a debug message")
	slog.Info("This is an info message")
	slog.Error("This is an error message")
	//panic("This was definitely not meant to happen")
	w.Write([]byte("['Imagine that this is a list of news posts']"))
}

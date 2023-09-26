package main

import (
	"log/slog"
	"net/http"
	"os"

	apiv1 "github.com/cthit/chalmers.it/backend/api/v1"
	loghandler "github.com/cthit/chalmers.it/backend/logging"
	"github.com/go-chi/chi/v5"
	chi_middleware "github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()

	handler := loghandler.New(os.Stdout, nil)
	//handler := slog.Default().Handler()
	logger := slog.New(handler)
	slog.SetDefault(logger)

	// Human readable logger
	chi_middleware.DefaultLogger = chi_middleware.RequestLogger(&chi_middleware.DefaultLogFormatter{Logger: loghandler.SLogger{Logger: *logger}})

	// Structured logger
	//chi_middleware.DefaultLogger = middleware.NewStructuredLogger(handler)

	r.Use(chi_middleware.RequestID)
	r.Use(chi_middleware.RealIP)
	r.Use(chi_middleware.Logger)
	r.Use(chi_middleware.Recoverer)
	r.Use(chi_middleware.Heartbeat("/ping"))

	r.Mount("/api/v1", apiv1.Router())

	slog.Info("Starting server")
	http.ListenAndServe(":3000", r)
}

package main

import (
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	chi_middleware "github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/cthit/chalmers.it/backend/middleware"
)

func main() {
	r := chi.NewRouter()

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339})

	r.Use(chi_middleware.RequestID)
	r.Use(chi_middleware.RealIP)
	r.Use(middleware.LoggerMiddleware(&log.Logger))
	r.Use(chi_middleware.Recoverer)
	r.Use(chi_middleware.Heartbeat("/ping"))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		log.Panic().Msg("panic test")
		w.Write([]byte("welcome"))
	})

	log.Info().Msg("Starting server")
	http.ListenAndServe(":3000", r)
}

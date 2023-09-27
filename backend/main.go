package main

import (
	"net/http"

	"github.com/charmbracelet/log"
	apiv1 "github.com/cthit/chalmers.it/backend/api/v1"
	"github.com/cthit/chalmers.it/backend/logging"

	"github.com/go-chi/chi/v5"
	chi_middleware "github.com/go-chi/chi/v5/middleware"

	_ "github.com/cthit/chalmers.it/backend/docs"
	httpSwagger "github.com/swaggo/http-swagger"
)

//	@title			Chalmers.it
//	@version		1.0
//	@description	The API for the main site of the Software Engineering (IT) section at Chalmers University of Technology.

//	@contact.name	digIT
//	@contact.url	https://digit.chalmers.it
//	@contact.email	digit@chalmers.it

//	@BasePath	/api/v1
func main() {
	r := chi.NewRouter()

	logging.SetupColors()

	r.Use(chi_middleware.RequestID)
	r.Use(chi_middleware.RealIP)
	r.Use(logging.RequestLogger())
	r.Use(chi_middleware.Recoverer)
	r.Use(chi_middleware.Heartbeat("/ping"))

	r.Mount("/api/v1", apiv1.Router())

	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"), //The url pointing to API definition
	))

	log.Info("Starting server")
	http.ListenAndServe(":3000", r)
}

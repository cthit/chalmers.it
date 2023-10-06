package apiv1

import "github.com/go-chi/chi/v5"

func Router() chi.Router {
	r := chi.NewRouter()
	r.Mount("/news", newsRouter())
	return r
}

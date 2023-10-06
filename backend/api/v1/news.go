package apiv1

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func newsRouter() chi.Router {
	r := chi.NewRouter()
	r.Get("/", getNews)
	return r
}

// ShowAccount godoc
//	@Summary		News posts
//	@Description	Gets a list of the latest news posts
//	@Tags			news
//	@Produce		json
//	@Success		200	{object}	string
//	@Router			/news [get]
func getNews(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("[]"))
}

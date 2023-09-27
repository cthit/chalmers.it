package apiv1

import (
	"net/http"

	"github.com/charmbracelet/log"

	"github.com/go-chi/chi/v5"
)

func News() chi.Router {
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
	log.Warn("This is a warning")
	log.Debug("This is a debug message")
	log.Info("This is an info message")
	log.Error("This is an error message")
	w.Write([]byte("['Imagine that this is a list of news posts']"))
}

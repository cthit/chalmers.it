package loghandler

import (
	"log/slog"
)

type SLogger struct {
	Logger slog.Logger
}

func (l SLogger) Print(v ...interface{}) {
	for _, value := range v {
		l.Logger.Info(value.(string))
	}
}

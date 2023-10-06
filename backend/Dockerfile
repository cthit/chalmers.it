FROM golang:1.21-alpine AS builder
LABEL maintainer="digIT <digit@chalmers.it>"

WORKDIR /app

COPY . .
RUN go mod download

# Build binary
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -a -installsuffix cgo -o /app/bin/chalmersit-backend .

##########################
#    PRODUCTION STAGE    #
##########################
FROM scratch

# Copy binary
COPY --from=builder /app/bin/chalmersit-backend /app/bin/chalmersit-backend

EXPOSE 3000

HEALTHCHECK CMD [ "/app/bin/chalmersit-backend", "healthcheck" ]
ENTRYPOINT ["/app/bin/chalmersit-backend"]

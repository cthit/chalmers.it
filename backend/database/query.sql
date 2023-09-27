-- name: GetAllNews :many
SELECT * FROM news ORDER BY created_at DESC;
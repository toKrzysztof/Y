package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/valyala/fasthttp"
)

const uploadDir = "./uploaded_images" // Directory to store uploaded images

// Generate a random hash for the image filename
func generateRandomHash() (string, error) {
	bytes := make([]byte, 16) // Generate 16 random bytes
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// Handle POST /image to upload an image
func postImage(ctx *fasthttp.RequestCtx) {
	// Check if the content type is valid
	contentType := string(ctx.Request.Header.Peek("Content-Type"))
	var fileExt string
	if contentType == "image/jpeg" {
		fileExt = ".jpg"
	} else if contentType == "image/png" {
		fileExt = ".png"
	} else {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Invalid content type. Only JPEG and PNG are allowed.")
		return
	}

	// Generate a unique filename
	filename, err := generateRandomHash()
	if err != nil {
		log.Printf("Failed to generate filename: %v", err)
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to process request.")
		return
	}
	filename += fileExt
	filePath := filepath.Join(uploadDir, filename)

	// Save the uploaded image to the filesystem
	err = os.WriteFile(filePath, ctx.Request.Body(), 0644)
	if err != nil {
		log.Printf("Failed to save image: %v", err)
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to save image.")
		return
	}

	// Return the generated filename to the client
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBodyString(fmt.Sprintf("Image uploaded successfully. Filename: %s", filename))
}

// Handle GET /image/{filename} to retrieve the image
func getImage(ctx *fasthttp.RequestCtx) {
	// Extract the filename from the URL path
	filename := filepath.Base(string(ctx.Path())[7:]) // Remove "/image/" from the path
	if filename == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Filename is required.")
		return
	}

	filePath := filepath.Join(uploadDir, filename)

	// Check if the file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		ctx.SetStatusCode(fasthttp.StatusNotFound)
		ctx.SetBodyString("Image not found.")
		return
	}

	// Read the image file
	imageData, err := os.ReadFile(filePath)
	if err != nil {
		log.Printf("Failed to read image: %v", err)
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to read image.")
		return
	}

	// Set the appropriate content type
	contentType := "image/jpeg"
	if filepath.Ext(filePath) == ".png" {
		contentType = "image/png"
	}
	ctx.Response.Header.Set("Content-Type", contentType)
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBody(imageData)
}

func getHealthCheck(ctx *fasthttp.RequestCtx) {
	ctx.Response.Header.Set("Content-Type", "application/json")
	ctx.SetStatusCode(fasthttp.StatusOK)
	ctx.SetBodyString(`{"message": "Service healthy!"}`)
}


// Main request handler
func requestHandler(ctx *fasthttp.RequestCtx) {
	switch {
	case string(ctx.Path()) == "/image" && string(ctx.Method()) == "POST":
		postImage(ctx)
	case len(ctx.Path()) > 7 && string(ctx.Path()[:7]) == "/image/" && string(ctx.Method()) == "GET":
		getImage(ctx)
	case string(ctx.Path()) == "/healthcheck" && string(ctx.Method()) == "GET":
		getHealthCheck(ctx)
	default:
		ctx.Error("Unsupported path or method", fasthttp.StatusNotFound)
	}
}

func main() {
	fmt.Println("Starting server on :8080...")

	// Ensure the upload directory exists
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}

	if err := fasthttp.ListenAndServe(":8080", requestHandler); err != nil {
		log.Fatalf("Error starting server: %s", err)
	}
}

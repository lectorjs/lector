package main

import (
	"embed"
	"log"

	"github.com/lectorjs/lector/pkg/reader/rsvp"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:gui/dist
var assets embed.FS

func main() {

	app := NewApp()
	rsvp := rsvp.New()

	err := wails.Run(&options.App{
		Title:  "lector",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			rsvp,
		},
	})

	if err != nil {
		log.Fatalf("Error starting application: %v\n", err)
	}
}

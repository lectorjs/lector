package main

import (
	"context"
	"embed"
	"log"
	"os"

	lectorCLI "github.com/lectorjs/lector/cli"
	"github.com/lectorjs/lector/pkg/services/rsvp"
	"github.com/urfave/cli/v2"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed gui/dist
var assets embed.FS

func main() {
	rsvpService := rsvp.NewService()

	app := &cli.App{
		Name:                   "lector",
		Usage:                  "Opens the specified file in a new graphical user interface (GUI) window",
		UsageText:              "lector [OPTIONS] [FILE_PATH]",
		Version:                "0.0.0",
		Args:                   true,
		EnableBashCompletion:   true,
		UseShortOptionHandling: true,
		Action: func(c *cli.Context) error {
			err := wails.Run(&options.App{
				Title:            "Demo",
				Width:            1024,
				Height:           768,
				Assets:           assets,
				BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
				OnStartup: func(ctx context.Context) {
					rsvpService.OnStartup(ctx)
				},
				OnDomReady: func(ctx context.Context) {
					rsvpService.OnDomReady(ctx)
				},
				OnShutdown: func(ctx context.Context) {
					rsvpService.OnShutdown(ctx)
				},
				Bind: []interface{}{
					rsvpService,
				},
			})

			return err
		},
		Commands: []*cli.Command{
			lectorCLI.NewAnalyzeCommand(),
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatalf("Failed to start application: %v\n", err)
		os.Exit(1)
	}
}

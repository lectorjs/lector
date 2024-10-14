package main

import (
	"embed"
	"log"
	"os"

	lectorCLI "github.com/lectorjs/lector/cli"
	"github.com/lectorjs/lector/pkg/services/rsvp"
	"github.com/urfave/cli/v2"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed gui/dist
var assets embed.FS

func main() {
	rsvpService := rsvp.NewService()

	app := application.New(application.Options{
		Name:        "Lector",
		Description: "A highly modular and accessible reading tool",
		Assets: application.AssetOptions{
			Handler: application.BundledAssetFileServer(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		Services: []application.Service{
			application.NewService(rsvpService),
		},
	})

	cliApp := &cli.App{
		Name:                   "lector",
		DefaultCommand:         "open",
		Version:                "0.0.0",
		Args:                   true,
		EnableBashCompletion:   true,
		UseShortOptionHandling: true,
		Commands: []*cli.Command{
			lectorCLI.NewOpenCommand(lectorCLI.OpenCommandOptions{App: app}),
			lectorCLI.NewAnalyzeCommand(),
		},
	}

	if err := cliApp.Run(os.Args); err != nil {
		log.Fatalf("Failed to start application: %v\n", err)
		os.Exit(1)
	}
}

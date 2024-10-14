package main

import (
	"embed"
	"log"
	"os"

	"github.com/lector-org/lector/cmd"
	"github.com/lector-org/lector/services"
	"github.com/urfave/cli/v2"
	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed gui/dist
var assets embed.FS

func main() {
	readerService := services.NewReaderService()

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
			application.NewService(readerService),
		},
	})

	cliApp := &cli.App{
		Name:                   "lector",
		Usage:                  "A highly modular and accessible reading tool",
		Version:                "0.0.0",
		Args:                   true,
		EnableBashCompletion:   true,
		UseShortOptionHandling: true,
		Commands: []*cli.Command{
			cmd.NewOpenCommand(cmd.OpenCommandOptions{App: app}),
			cmd.NewAnalyzeCommand(),
			cmd.NewSummaryCommand(),
		},
	}

	if err := cliApp.Run(os.Args); err != nil {
		log.Fatalf("Failed to start application: %v\n", err)
		os.Exit(1)
	}
}

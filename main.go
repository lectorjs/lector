package main

import (
	"embed"
	"log"
	"os"

	"github.com/lectorjs/lector/cmd"
	"github.com/urfave/cli/v2"
)

//go:embed gui/dist
var assets embed.FS

func main() {
	app := &cli.App{
		Name:                 "Lector",
		Usage:                "Your friendly reader",
		Version:              "0.0.0",
		EnableBashCompletion: true,
		Commands: []*cli.Command{
			cmd.NewGuiCommand(cmd.NewGuiOptions{
				Assets: assets,
			}),
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatalf("Failed to start Lector: %v\n", err)
		os.Exit(1)
	}
}

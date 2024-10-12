package cmd

import (
	"embed"

	"github.com/lectorjs/lector/pkg/services/rsvp"
	"github.com/urfave/cli/v2"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type NewGuiOptions struct {
	Assets embed.FS
}

func NewGuiCommand(opts NewGuiOptions) *cli.Command {
	return &cli.Command{
		Name:  "gui",
		Usage: "Starts Lector using the graphical user interface (GUI)",
		Action: func(ctx *cli.Context) error {
			app := application.New(application.Options{
				Name: "Lector",
				Services: []application.Service{
					application.NewService(rsvp.New()),
				},
				Assets: application.AssetOptions{
					Handler: application.BundledAssetFileServer(opts.Assets),
				},
				Mac: application.MacOptions{
					ApplicationShouldTerminateAfterLastWindowClosed: true,
				},
			})

			app.NewWebviewWindowWithOptions(application.WebviewWindowOptions{
				Width:  1024,
				Height: 768,
			})

			return app.Run()
		},
	}
}

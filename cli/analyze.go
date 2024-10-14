package cli

import (
	"fmt"
	"log"
	"slices"

	lectorerror "github.com/lectorjs/lector/pkg/runtime/lector_error"
	"github.com/lectorjs/lector/pkg/tools/inspector"
	"github.com/urfave/cli/v2"
)

var supportedOutputFormats = []string{"plain", "json", "yaml", "table"}

// NewAnalyzeCommand is a CLI command that generates an output in various formats with relevant information about a file or website content.
func NewAnalyzeCommand() *cli.Command {
	var flagOutput string

	return &cli.Command{
		Name:      "analyze",
		Usage:     "Generates an output in various formats with relevant information about a file or website content",
		UsageText: "lector analyze [OPTIONS] [INPUT_SOURCE]",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "output",
				Aliases:     []string{"o"},
				Usage:       fmt.Sprintf("specify output format %s", supportedOutputFormats),
				DefaultText: "plain",
				Value:       "plain",
				Destination: &flagOutput,
				Action: func(ctx *cli.Context, v string) error {
					if !slices.Contains(supportedOutputFormats, v) {
						return lectorerror.NewCliError(ctx).GetCustomError(fmt.Sprintf("'--output' must be one of the following: %s", supportedOutputFormats))
					}
					return nil
				},
			},
		},
		Action: func(cCtx *cli.Context) error {
			filePath := cCtx.Args().Get(0)
			if filePath == "" {
				return lectorerror.NewCliError(cCtx).GetNoArgError()
			}

			fileInspector := inspector.NewFileInspector(filePath)
			if !fileInspector.IsValid() {
				return lectorerror.NewCliError(cCtx).GetCustomError(
					fmt.Sprintf("requires a valid file path. %q was not found", filePath),
				)
			}

			log.Printf("Analyzing %s\n", filePath)
			log.Printf("Output format: %s\n", flagOutput)

			return nil
		},
	}
}

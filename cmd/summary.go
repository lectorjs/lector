package cmd

import (
	"fmt"
	"log"

	"github.com/lectorjs/lector/internal/errx"
	"github.com/lectorjs/lector/pkg/inspector"
	"github.com/urfave/cli/v2"
)

// NewSummaryCommand is a CLI command that generates an an AI-powered summary of a file or website content.
func NewSummaryCommand() *cli.Command {
	var flagGUI bool
	var flagLength uint
	var flagLanguage string

	return &cli.Command{
		Name:      "summary",
		Usage:     "Generates an an AI-powered summary of a file or website content",
		UsageText: "lector summary [OPTIONS] [INPUT_SOURCE]",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:        "gui",
				Aliases:     []string{"g"},
				Usage:       "open output in a new graphical user interface (GUI) window",
				Value:       false,
				Destination: &flagGUI,
			},
			&cli.UintFlag{
				Name:        "length",
				Aliases:     []string{"l"},
				Usage:       "specify the length of the summary",
				DefaultText: "100 words",
				Value:       100,
				Destination: &flagLength,
				Action: func(ctx *cli.Context, v uint) error {
					if v < 10 || v > 1000 {
						return errx.NewCliError(ctx).GetCustomError("'--length' requires a value between 10 and 1000")
					}
					return nil
				},
			},
			&cli.StringFlag{
				Name:        "language",
				Aliases:     []string{"L"},
				Usage:       "specify the language of the summary",
				DefaultText: "inferred from the file's content",
				Value:       "auto",
				Destination: &flagLanguage,
			},
		},
		Action: func(cCtx *cli.Context) error {
			filePath := cCtx.Args().Get(0)
			if filePath == "" {
				return errx.NewCliError(cCtx).GetNoArgError()
			}

			fileInspector := inspector.NewFileInspector(filePath)
			if !fileInspector.IsValid() {
				return errx.NewCliError(cCtx).GetCustomError(
					fmt.Sprintf("requires a valid file path. %q was not found", filePath),
				)
			}

			log.Printf("Analyzing %s\n", filePath)
			log.Printf("GUI: %t\n", flagGUI)
			log.Printf("length: %d\n", flagLength)
			log.Printf("language: %s\n", flagLanguage)

			return nil
		},
	}
}

package cli

import (
	"fmt"
	"log"
	"slices"

	lectorerror "github.com/lectorjs/lector/pkg/runtime/lector_error"
	"github.com/lectorjs/lector/pkg/tools"
	"github.com/urfave/cli/v2"
)

var supportedOutputFormats = []string{"plain", "json", "yaml", "table"}

func NewAnalyzeCommand() *cli.Command {
	var flagOutput string
	var flagGUI bool
	var flagSummary bool
	var flagSummaryLength uint
	var flagSummaryLanguage string

	return &cli.Command{
		Name:      "analyze",
		Usage:     "Analyzes a file and generates an output in various formats with relevant information, optionally producing an AI-powered summary",
		UsageText: "lector analyze [OPTIONS] [FILE_PATH]",
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
			&cli.BoolFlag{
				Name:        "gui",
				Aliases:     []string{"g"},
				Usage:       "open output in a new graphical user interface (GUI) window",
				Value:       false,
				Destination: &flagGUI,
			},
			&cli.BoolFlag{
				Name:        "summary",
				Aliases:     []string{"s"},
				Usage:       "generate an AI-powered summary of the analyzed file",
				Value:       false,
				Destination: &flagSummary,
			},
			&cli.UintFlag{
				Name:        "summary-length",
				Aliases:     []string{"l"},
				Usage:       "specify the length of the summary",
				DefaultText: "100 words",
				Value:       100,
				Destination: &flagSummaryLength,
				Action: func(ctx *cli.Context, v uint) error {
					if v < 10 || v > 1000 {
						return lectorerror.NewCliError(ctx).GetCustomError("'--summary-length' requires a value between 10 and 1000")
					}
					return nil
				},
			},
			&cli.StringFlag{
				Name:        "summary-language",
				Aliases:     []string{"L"},
				Usage:       "specify the language of the summary",
				DefaultText: "inferred from the file's content",
				Value:       "auto",
				Destination: &flagSummaryLanguage,
			},
		},
		Action: func(ctx *cli.Context) error {

			filePath := ctx.Args().Get(0)
			if filePath == "" {
				return lectorerror.NewCliError(ctx).GetNoArgError()
			}

			inspector := tools.NewFileInspector(filePath)
			if !inspector.IsExist() {
				return lectorerror.NewCliError(ctx).GetCustomError(
					fmt.Sprintf("requires a valid file path. %q was not found", filePath),
				)
			}

			log.Printf("Analyzing %s\n", filePath)
			log.Printf("Output format: %s\n", flagOutput)
			log.Printf("GUI: %t\n", flagGUI)
			log.Printf("Summary: %t\n", flagSummary)
			log.Printf("Summary length: %d\n", flagSummaryLength)
			log.Printf("Summary language: %s\n", flagSummaryLanguage)

			return nil
		},
	}
}

package lectorerror

import (
	"fmt"

	"github.com/urfave/cli/v2"
)

type CliError struct {
	ctx *cli.Context
}

func NewCliError(ctx *cli.Context) *CliError {
	return &CliError{ctx: ctx}
}

func (e *CliError) GetNoArgError() error {
	return cli.Exit(e.formatMessage("requires an argument"), 1)
}

func (e *CliError) GetArgsError() error {
	return cli.Exit(e.formatMessage("requires at least one argument"), 1)
}

func (e *CliError) GetRequiredFlagError(flag string) error {
	return cli.Exit(e.formatMessage(fmt.Sprintf("requires the flag --%s", flag)), 1)
}

func (e *CliError) GetCustomError(message string) error {
	return cli.Exit(e.formatMessage(message), 1)
}

func (e *CliError) GetDeprecatedWarning() string {
	return e.formatMessage("has been deprecated")
}

func (e *CliError) formatMessage(message string) string {
	return fmt.Sprintf(
		"\"lector %[1]s\" %[3]s.\nSee 'lector %[1]s --help'.\n\nUsage: %[2]s\n",
		e.ctx.Command.Name,
		e.ctx.Command.UsageText,
		message,
	)
}

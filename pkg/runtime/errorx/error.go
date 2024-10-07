package errorx

import "fmt"

// FormattedError represents errors with a consistent structure.
type FormattedError struct {
	Type    string
	Message string
	Err     error
}

func (e *FormattedError) Error() string {
	return fmt.Sprintf("[%s] %s: %v", e.Type, e.Message, e.Err)
}

// NewFormattedErrorOptions defines options for creating FormattedError instances.
type NewFormattedErrorOptions struct {
	Type    string
	Message string
	Err     error
}

// NewFormattedError creates a new FormattedError instance.
func NewFormattedError(opts NewFormattedErrorOptions) *FormattedError {
	return &FormattedError{
		Message: opts.Message,
		Err:     opts.Err,
		Type:    opts.Type,
	}
}

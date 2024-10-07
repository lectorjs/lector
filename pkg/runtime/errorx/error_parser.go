package errorx

const (
	ErrParserUnsupportedType = "unsupported input type"
	ErrParserScanner         = "scanner error"
)

// NewParserError creates a new FormattedError instance.
func NewParserError(opts NewFormattedErrorOptions) *FormattedError {
	return NewFormattedError(opts)
}

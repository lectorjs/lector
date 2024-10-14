package inspector

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"slices"

	"github.com/gabriel-vasile/mimetype"
)

// LectorSupportedFileTypes defines the files MIME types and extensions supported by Lector.
var LectorSupportedFileTypes = map[string][]string{
	"text/plain":         {".txt", ".md", ".markdown"},
	"text/markdown":      {".md", ".markdown"},
	"text/html":          {".html"},
	"application/pdf":    {".pdf"},
	"application/rtf":    {".rtf"},
	"application/msword": {".doc"},
	"application/vnd.oasis.opendocument.text":                                 {".odt"},
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {".docx"},
}

// FileInspector provides methods to validate and retrieve information about a file.
type FileInspector struct {
	path string
}

// NewFileInspector creates a new FileInspector instance for the given file path.
func NewFileInspector(path string) *FileInspector {
	return &FileInspector{path: path}
}

// GetPath returns the current file path that is being inspected.
func (f *FileInspector) GetPath() string {
	return f.path
}

// GetMimeType returns the MIME type of the file.
func (f *FileInspector) GetMimeType() (string, error) {
	mtype, err := mimetype.DetectFile(f.path)
	if err != nil {
		return "", fmt.Errorf("failed to detect MIME type: %w", err)
	}

	return mtype.String(), nil
}

// GetExtension returns the file extension of the file.
func (f *FileInspector) GetExtension() string {
	return filepath.Ext(f.path)
}

// IsValid checks if the file/directory path exists.
func (f *FileInspector) IsValid() bool {
	if _, err := os.Stat(f.path); errors.Is(err, os.ErrNotExist) {
		return false
	}

	return true
}

// IsFile checks if the path points to a regular file.
func (f *FileInspector) IsFile() bool {
	info, err := os.Stat(f.path)
	if err != nil {
		return false
	}

	return !info.IsDir()
}

// IsDirectory checks if the path points to a directory.
func (f *FileInspector) IsDirectory() bool {
	info, err := os.Stat(f.path)
	if err != nil {
		return false
	}

	return info.IsDir()
}

// IsEmpty checks if the file content is empty.
func (f *FileInspector) IsEmpty() (bool, error) {
	info, err := os.Stat(f.path)
	if err != nil {
		return true, fmt.Errorf("failed to get file info: %w", err)
	}

	return info.Size() == 0, nil
}

// IsSupportedByLector checks if the file is supported by Lector based on both MIME type and extension.
func (f *FileInspector) IsSupportedByLector() (bool, error) {
	mimeType, err := f.GetMimeType()
	if err != nil {
		return false, err
	}

	extensions, isValidMimeType := LectorSupportedFileTypes[mimeType]

	isValidExtension := slices.Contains(extensions, f.GetExtension())

	return isValidMimeType && isValidExtension, nil
}

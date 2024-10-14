package tools_test

import (
	"os"
	"testing"

	"github.com/lectorjs/lector/pkg/tools"
	"github.com/stretchr/testify/assert"
)

func TestNewFileInspector(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)
	assert.Equal(t, filePath, inspector.GetPath())
}

func TestGetMimeType(t *testing.T) {
	tests := []struct {
		name              string
		path              string
		content           string
		expected          string
		shouldCreate      bool
		shouldExpectError bool
	}{
		{
			name:         "text/plain",
			path:         "test.txt",
			content:      "Hello, World!",
			expected:     "text/plain; charset=utf-8",
			shouldCreate: true,
		},
		{
			name:         "text/markdown",
			path:         "test.md",
			content:      "# Hello, World!",
			expected:     "text/plain; charset=utf-8",
			shouldCreate: true,
		},
		{
			name:         "text/html",
			path:         "test.html",
			content:      "<html><body>Hello, World!</body></html>",
			expected:     "text/html; charset=utf-8",
			shouldCreate: true,
		},
		{
			name:              "File not found",
			path:              "",
			expected:          "",
			shouldCreate:      false,
			shouldExpectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			inspector := tools.NewFileInspector(tt.path)

			if tt.shouldCreate {
				_, err := os.Create(tt.path)
				assert.NoError(t, err)
				defer os.Remove(tt.path)

				if tt.content != "" {
					f, err := os.OpenFile(tt.path, os.O_APPEND|os.O_WRONLY, 0644)
					assert.NoError(t, err)
					defer f.Close()

					_, err = f.WriteString(tt.content)
					assert.NoError(t, err)
				}
			}

			mtype, err := inspector.GetMimeType()

			if tt.shouldExpectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			assert.Equal(t, tt.expected, mtype)
		})
	}
}

func TestGetExtension(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)
	assert.Equal(t, ".txt", inspector.GetExtension())
}

func TestIsExistWithFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	assert.True(t, inspector.IsExist())
}

func TestIsExistWithNonExistentFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	assert.False(t, inspector.IsExist())
}

func TestIsExistWithDirectory(t *testing.T) {
	dirPath := "dir"
	inspector := tools.NewFileInspector(dirPath)

	os.Mkdir(dirPath, 0755)
	defer os.Remove(dirPath)

	assert.True(t, inspector.IsExist())
}

func TestIsExistWithNonExistentDirectory(t *testing.T) {
	dirPath := "dir"
	inspector := tools.NewFileInspector(dirPath)

	assert.False(t, inspector.IsExist())
}

func TestIsFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	assert.True(t, inspector.IsFile())
}

func TestIsFileWithNonExistentFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	assert.False(t, inspector.IsFile())
}

func TestIsDirectory(t *testing.T) {
	dirPath := "dir"
	inspector := tools.NewFileInspector(dirPath)

	os.Mkdir(dirPath, 0755)
	defer os.Remove(dirPath)

	assert.True(t, inspector.IsDirectory())
}

func TestIsDirectoryWithNonExistentDirectory(t *testing.T) {
	dirPath := "dir"
	inspector := tools.NewFileInspector(dirPath)

	assert.False(t, inspector.IsDirectory())
}

func TestIsEmpty(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	isEmpty, err := inspector.IsEmpty()
	assert.NoError(t, err)
	assert.True(t, isEmpty)
}

func TestIsEmptyWithNonEmptyFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	f, err := os.OpenFile(filePath, os.O_APPEND|os.O_WRONLY, 0644)
	assert.NoError(t, err)
	defer f.Close()

	_, err = f.WriteString("some content")
	assert.NoError(t, err)

	isEmpty, err := inspector.IsEmpty()
	assert.NoError(t, err)
	assert.False(t, isEmpty)
}

func TestIsEmptyWithNonExistentFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	isEmpty, err := inspector.IsEmpty()
	assert.Error(t, err)
	assert.True(t, isEmpty)
}

func TestIsSupportedByLector(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	isSupported, err := inspector.IsSupportedByLector()
	assert.NoError(t, err)
	assert.True(t, isSupported)
}

func TestIsSupportedByLectorWithUnsupportedFile(t *testing.T) {
	filePath := "file.ps1"
	inspector := tools.NewFileInspector(filePath)

	_, err := os.Create(filePath)
	assert.NoError(t, err)
	defer os.Remove(filePath)

	isSupported, err := inspector.IsSupportedByLector()
	assert.NoError(t, err)
	assert.False(t, isSupported)
}

func TestIsSupportedByLectorWithNonExistentFile(t *testing.T) {
	filePath := "file.txt"
	inspector := tools.NewFileInspector(filePath)

	isSupported, err := inspector.IsSupportedByLector()
	assert.Error(t, err)
	assert.False(t, isSupported)
}

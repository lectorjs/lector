package sysinfo_test

import (
	"os/exec"
	"testing"

	"github.com/lectorjs/lector/internal/sysinfo"
	"github.com/lectorjs/lector/internal/types"
	"github.com/stretchr/testify/assert"
)

func TestHasNvidiaGPU(t *testing.T) {
	tests := []struct {
		name     string
		command  types.Command
		expected bool
	}{
		{
			name: "GPU present",
			command: func(cmd string, args ...string) *exec.Cmd {
				return exec.Command("echo", "NVIDIA GeForce RTX 3070")
			},
			expected: true,
		},
		{
			name: "GPU not present",
			command: func(cmd string, args ...string) *exec.Cmd {
				return exec.Command("echo", "")
			},
			expected: false,
		},
		{
			name: "Command error",
			command: func(cmd string, args ...string) *exec.Cmd {
				return exec.Command("<unknown>")
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := sysinfo.HasNvidiaGPU(tt.command)
			assert.Equal(t, tt.expected, result)
		})
	}
}

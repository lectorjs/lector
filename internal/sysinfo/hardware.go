package sysinfo

import (
	"strings"

	"github.com/lectorjs/lector/internal/types"
)

// HasNvidiaGPU checks if an NVIDIA GPU is present on the system.
func HasNvidiaGPU(command types.Command) bool {
	out, err := command("nvidia-smi", "--query-gpu=name", "--format=csv,noheader").Output()
	if err != nil {
		return false
	}

	return strings.TrimSpace(string(out)) != ""
}

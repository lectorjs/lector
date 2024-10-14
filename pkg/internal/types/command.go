package types

import "os/exec"

type Command func(cmd string, args ...string) *exec.Cmd

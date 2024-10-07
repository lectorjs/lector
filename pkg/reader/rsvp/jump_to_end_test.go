package rsvp_test

import (
	"testing"

	"github.com/lectorjs/lector/pkg/primitive/node"
	"github.com/lectorjs/lector/pkg/reader/rsvp"
	"github.com/stretchr/testify/assert"
)

func TestJumpToEnd(t *testing.T) {
	testCases := []struct {
		name               string
		initialNodes       int
		initialCheckpoint  uint32
		expectedCheckpoint uint32
	}{
		{
			name:               "jump to end from the beginning",
			initialNodes:       10,
			initialCheckpoint:  0,
			expectedCheckpoint: 10,
		},
		{
			name:               "jump to end from the middle",
			initialNodes:       10,
			initialCheckpoint:  5,
			expectedCheckpoint: 10,
		},
		{
			name:               "jump to end from the end",
			initialNodes:       10,
			initialCheckpoint:  10,
			expectedCheckpoint: 10,
		},
		{
			name:               "jump to end with 0 nodes",
			initialNodes:       0,
			initialCheckpoint:  0,
			expectedCheckpoint: 0,
		},
		{
			name:               "jump to end with 1 node",
			initialNodes:       1,
			initialCheckpoint:  0,
			expectedCheckpoint: 1,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			reader := rsvp.New()
			reader.Nodes = make([]node.Node, c.initialNodes)
			reader.Checkpoint = c.initialCheckpoint

			reader.JumpToEnd()

			assert.Equal(t, c.expectedCheckpoint, reader.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.Checkpoint)
		})
	}
}

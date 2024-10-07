package rsvp_test

import (
	"testing"

	"github.com/lectorjs/lector/pkg/primitive/node"
	"github.com/lectorjs/lector/pkg/reader/rsvp"
	"github.com/stretchr/testify/assert"
)

func TestSkipBackward(t *testing.T) {
	testCases := []struct {
		name               string
		initialNodes       int
		initialCheckpoint  uint32
		nodesPerCycle      uint8
		expectedCheckpoint uint32
	}{
		// Basic skipping
		{
			name:               "skip backward 1 node",
			initialNodes:       10,
			initialCheckpoint:  10,
			nodesPerCycle:      1,
			expectedCheckpoint: 9,
		},
		{
			name:               "skip backward 3 nodes",
			initialNodes:       10,
			initialCheckpoint:  10,
			nodesPerCycle:      3,
			expectedCheckpoint: 7,
		},
		{
			name:               "skip backward 5 nodes",
			initialNodes:       10,
			initialCheckpoint:  10,
			nodesPerCycle:      5,
			expectedCheckpoint: 5,
		},
		{
			name:               "skip backward 10 nodes (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  10,
			nodesPerCycle:      10,
			expectedCheckpoint: 0,
		},

		// Skipping beyond or to the limit of the start of the node list
		{
			name:               "skip backward 5 nodes from node 3 (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  3,
			nodesPerCycle:      5,
			expectedCheckpoint: 0,
		},
		{
			name:               "skip backward 5 nodes from node 5 (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  5,
			nodesPerCycle:      5,
			expectedCheckpoint: 0,
		},

		// Edge cases
		{
			name:               "skip backward from empty nodes",
			initialNodes:       0,
			initialCheckpoint:  0,
			nodesPerCycle:      5,
			expectedCheckpoint: 0,
		},
		{
			name:               "skip backward with 1 node total",
			initialNodes:       1,
			initialCheckpoint:  1,
			nodesPerCycle:      1,
			expectedCheckpoint: 0,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			reader := rsvp.New()
			reader.Nodes = make([]node.Node, c.initialNodes)
			reader.Checkpoint = c.initialCheckpoint
			reader.Settings.NodesPerCycle = c.nodesPerCycle

			reader.SkipBackward()

			assert.Equal(t, c.expectedCheckpoint, reader.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.Checkpoint)
		})
	}
}

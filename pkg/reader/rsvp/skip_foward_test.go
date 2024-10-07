package rsvp_test

import (
	"testing"

	"github.com/lectorjs/lector/pkg/primitive/node"
	"github.com/lectorjs/lector/pkg/reader/rsvp"
	"github.com/stretchr/testify/assert"
)

func TestSkipForward(t *testing.T) {
	testCases := []struct {
		name               string
		initialNodes       int
		initialCheckpoint  uint32
		nodesPerCycle      uint8
		expectedCheckpoint uint32
	}{
		// Basic skipping
		{
			name:               "skip forward 1 node",
			initialNodes:       10,
			initialCheckpoint:  0,
			nodesPerCycle:      1,
			expectedCheckpoint: 1,
		},
		{
			name:               "skip forward 3 nodes",
			initialNodes:       10,
			initialCheckpoint:  0,
			nodesPerCycle:      3,
			expectedCheckpoint: 3,
		},
		{
			name:               "skip forward 5 nodes",
			initialNodes:       10,
			initialCheckpoint:  0,
			nodesPerCycle:      5,
			expectedCheckpoint: 5,
		},
		{
			name:               "skip forward 10 nodes (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  0,
			nodesPerCycle:      10,
			expectedCheckpoint: 10,
		},

		// Skipping beyond or to the limit of the end of the node list
		{
			name:               "skip forward 5 nodes from node 7 (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  7,
			nodesPerCycle:      5,
			expectedCheckpoint: 10,
		},
		{
			name:               "skip forward 5 nodes from node 5 (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  5,
			nodesPerCycle:      5,
			expectedCheckpoint: 10,
		},

		// Skipping from non-zero checkpoint
		{
			name:               "skip forward 3 nodes from checkpoint 5",
			initialNodes:       10,
			initialCheckpoint:  5,
			nodesPerCycle:      3,
			expectedCheckpoint: 8,
		},
		{
			name:               "skip forward 5 nodes from checkpoint 8 (reaches limit)",
			initialNodes:       10,
			initialCheckpoint:  8,
			nodesPerCycle:      5,
			expectedCheckpoint: 10,
		},

		// Edge cases
		{
			name:               "skip forward 0 nodes",
			initialNodes:       10,
			initialCheckpoint:  0,
			nodesPerCycle:      0,
			expectedCheckpoint: 0,
		},
		{
			name:               "skip forward from empty nodes",
			initialNodes:       0,
			initialCheckpoint:  0,
			nodesPerCycle:      5,
			expectedCheckpoint: 0,
		},
		{
			name:               "skip forward with 1 node total",
			initialNodes:       1,
			initialCheckpoint:  0,
			nodesPerCycle:      1,
			expectedCheckpoint: 1,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			reader := rsvp.New()
			reader.Nodes = make([]node.Node, c.initialNodes)
			reader.Checkpoint = c.initialCheckpoint
			reader.Settings.NodesPerCycle = c.nodesPerCycle

			reader.SkipFoward()

			assert.Equal(t, c.expectedCheckpoint, reader.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.Checkpoint)
		})
	}
}

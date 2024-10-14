package rsvp_test

// import (
// 	"context"
// 	"testing"

// 	"github.com/lector-org/lector/primitive/node"
// 	"github.com/lector-org/lector/reader/rsvp"
// 	"github.com/stretchr/testify/assert"
// )

// func TestJumpToStart(t *testing.T) {
// 	testCases := []struct {
// 		name               string
// 		initialNodes       int
// 		initialCheckpoint  uint32
// 		expectedCheckpoint uint32
// 	}{
// 		{
// 			name:               "jump to start from the end",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "jump to start from the middle",
// 			initialNodes:       10,
// 			initialCheckpoint:  5,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "jump to start from the start",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "jump to start with 0 nodes",
// 			initialNodes:       0,
// 			initialCheckpoint:  0,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "jump to start with 1 node",
// 			initialNodes:       1,
// 			initialCheckpoint:  1,
// 			expectedCheckpoint: 0,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.Nodes = make([]node.Node, c.initialNodes)
// 			reader.State.Checkpoint = c.initialCheckpoint

// 			reader.JumpToStart(context.Background())

// 			assert.Equal(t, c.expectedCheckpoint, reader.State.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.State.Checkpoint)
// 		})
// 	}
// }

// func TestJumpToEnd(t *testing.T) {
// 	testCases := []struct {
// 		name               string
// 		initialNodes       int
// 		initialCheckpoint  uint32
// 		expectedCheckpoint uint32
// 	}{
// 		{
// 			name:               "jump to end from the beginning",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			expectedCheckpoint: 10,
// 		},
// 		{
// 			name:               "jump to end from the middle",
// 			initialNodes:       10,
// 			initialCheckpoint:  5,
// 			expectedCheckpoint: 10,
// 		},
// 		{
// 			name:               "jump to end from the end",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			expectedCheckpoint: 10,
// 		},
// 		{
// 			name:               "jump to end with 0 nodes",
// 			initialNodes:       0,
// 			initialCheckpoint:  0,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "jump to end with 1 node",
// 			initialNodes:       1,
// 			initialCheckpoint:  0,
// 			expectedCheckpoint: 1,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.Nodes = make([]node.Node, c.initialNodes)
// 			reader.State.Checkpoint = c.initialCheckpoint

// 			reader.JumpToEnd(context.Background())

// 			assert.Equal(t, c.expectedCheckpoint, reader.State.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.State.Checkpoint)
// 		})
// 	}
// }

// func TestSkipBackward(t *testing.T) {
// 	testCases := []struct {
// 		name               string
// 		initialNodes       int
// 		initialCheckpoint  uint32
// 		nodesPerCycle      uint8
// 		expectedCheckpoint uint32
// 	}{
// 		// Basic skipping
// 		{
// 			name:               "skip backward 1 node",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			nodesPerCycle:      1,
// 			expectedCheckpoint: 9,
// 		},
// 		{
// 			name:               "skip backward 3 nodes",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			nodesPerCycle:      3,
// 			expectedCheckpoint: 7,
// 		},
// 		{
// 			name:               "skip backward 5 nodes",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 5,
// 		},
// 		{
// 			name:               "skip backward 10 nodes (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  10,
// 			nodesPerCycle:      10,
// 			expectedCheckpoint: 0,
// 		},

// 		// Skipping beyond or to the limit of the start of the node list
// 		{
// 			name:               "skip backward 5 nodes from node 3 (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  3,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "skip backward 5 nodes from node 5 (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  5,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 0,
// 		},

// 		// Edge cases
// 		{
// 			name:               "skip backward from empty nodes",
// 			initialNodes:       0,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "skip backward with 1 node total",
// 			initialNodes:       1,
// 			initialCheckpoint:  1,
// 			nodesPerCycle:      1,
// 			expectedCheckpoint: 0,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.Nodes = make([]node.Node, c.initialNodes)
// 			reader.State.Checkpoint = c.initialCheckpoint
// 			reader.State.Settings.NodesPerCycle = c.nodesPerCycle

// 			reader.SkipBackward(context.Background())

// 			assert.Equal(t, c.expectedCheckpoint, reader.State.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.State.Checkpoint)
// 		})
// 	}
// }

// func TestSkipForward(t *testing.T) {
// 	testCases := []struct {
// 		name               string
// 		initialNodes       int
// 		initialCheckpoint  uint32
// 		nodesPerCycle      uint8
// 		expectedCheckpoint uint32
// 	}{
// 		// Basic skipping
// 		{
// 			name:               "skip forward 1 node",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      1,
// 			expectedCheckpoint: 1,
// 		},
// 		{
// 			name:               "skip forward 3 nodes",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      3,
// 			expectedCheckpoint: 3,
// 		},
// 		{
// 			name:               "skip forward 5 nodes",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 5,
// 		},
// 		{
// 			name:               "skip forward 10 nodes (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      10,
// 			expectedCheckpoint: 10,
// 		},

// 		// Skipping beyond or to the limit of the end of the node list
// 		{
// 			name:               "skip forward 5 nodes from node 7 (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  7,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 10,
// 		},
// 		{
// 			name:               "skip forward 5 nodes from node 5 (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  5,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 10,
// 		},

// 		// Skipping from non-zero checkpoint
// 		{
// 			name:               "skip forward 3 nodes from checkpoint 5",
// 			initialNodes:       10,
// 			initialCheckpoint:  5,
// 			nodesPerCycle:      3,
// 			expectedCheckpoint: 8,
// 		},
// 		{
// 			name:               "skip forward 5 nodes from checkpoint 8 (reaches limit)",
// 			initialNodes:       10,
// 			initialCheckpoint:  8,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 10,
// 		},

// 		// Edge cases
// 		{
// 			name:               "skip forward 0 nodes",
// 			initialNodes:       10,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      0,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "skip forward from empty nodes",
// 			initialNodes:       0,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      5,
// 			expectedCheckpoint: 0,
// 		},
// 		{
// 			name:               "skip forward with 1 node total",
// 			initialNodes:       1,
// 			initialCheckpoint:  0,
// 			nodesPerCycle:      1,
// 			expectedCheckpoint: 1,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.Nodes = make([]node.Node, c.initialNodes)
// 			reader.State.Checkpoint = c.initialCheckpoint
// 			reader.State.Settings.NodesPerCycle = c.nodesPerCycle

// 			reader.SkipFoward(context.Background())

// 			assert.Equal(t, c.expectedCheckpoint, reader.State.Checkpoint, "Exepected: %d, got: %d", c.expectedCheckpoint, reader.State.Checkpoint)
// 		})
// 	}
// }

// func TestPause(t *testing.T) {
// 	testCases := []struct {
// 		name              string
// 		initialIsRunning  bool
// 		expectedIsRunning bool
// 	}{
// 		{
// 			name:              "pause from running",
// 			initialIsRunning:  true,
// 			expectedIsRunning: false,
// 		},
// 		{
// 			name:              "pause from paused",
// 			initialIsRunning:  false,
// 			expectedIsRunning: false,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.IsRunning = c.initialIsRunning

// 			reader.Pause(context.Background())

// 			assert.Equal(t, c.expectedIsRunning, reader.State.IsRunning, "Exepected: %d, got: %d", c.expectedIsRunning, reader.State.IsRunning)
// 		})
// 	}
// }

// func TestResume(t *testing.T) {
// 	testCases := []struct {
// 		name              string
// 		initialIsRunning  bool
// 		expectedIsRunning bool
// 	}{
// 		{
// 			name:              "resume from paused",
// 			initialIsRunning:  false,
// 			expectedIsRunning: true,
// 		},
// 		{
// 			name:              "resume from running",
// 			initialIsRunning:  true,
// 			expectedIsRunning: true,
// 		},
// 	}

// 	for _, c := range testCases {
// 		t.Run(c.name, func(t *testing.T) {
// 			reader := rsvp.New()
// 			reader.State.IsRunning = c.initialIsRunning

// 			reader.Resume(context.Background())

// 			assert.Equal(t, c.expectedIsRunning, reader.State.IsRunning, "Exepected: %d, got: %d", c.expectedIsRunning, reader.State.IsRunning)
// 		})
// 	}
// }

package rsvp_test

import (
	"testing"

	"github.com/lectorjs/lector/pkg/reader/rsvp"
	"github.com/stretchr/testify/assert"
)

func TestPause(t *testing.T) {
	testCases := []struct {
		name              string
		initialIsRunning  bool
		expectedIsRunning bool
	}{
		{
			name:              "pause from running",
			initialIsRunning:  true,
			expectedIsRunning: false,
		},
		{
			name:              "pause from paused",
			initialIsRunning:  false,
			expectedIsRunning: false,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			reader := rsvp.New()
			reader.IsRunning = c.initialIsRunning

			reader.Pause()

			assert.Equal(t, c.expectedIsRunning, reader.IsRunning, "Exepected: %d, got: %d", c.expectedIsRunning, reader.IsRunning)
		})
	}
}

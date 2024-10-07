package rsvp_test

import (
	"testing"

	"github.com/lectorjs/lector/pkg/reader/rsvp"
	"github.com/stretchr/testify/assert"
)

func TestResume(t *testing.T) {
	testCases := []struct {
		name              string
		initialIsRunning  bool
		expectedIsRunning bool
	}{
		{
			name:              "resume from paused",
			initialIsRunning:  false,
			expectedIsRunning: true,
		},
		{
			name:              "resume from running",
			initialIsRunning:  true,
			expectedIsRunning: true,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			reader := rsvp.New()
			reader.IsRunning = c.initialIsRunning

			reader.Resume()

			assert.Equal(t, c.expectedIsRunning, reader.IsRunning, "Exepected: %d, got: %d", c.expectedIsRunning, reader.IsRunning)
		})
	}
}

package internal_test

// import (
// 	"testing"
// 	"time"

// 	"github.com/lectorjs/lector/pkg/internal"
// 	"github.com/stretchr/testify/assert"
// )

// type deepState struct {
// 	foo string
// 	bar int
// 	baz struct {
// 		qux string
// 	}
// }

// func TestNewState(t *testing.T) {
// 	oldValue := 1
// 	newValue := 2
// 	state := internal.NewState(oldValue, newValue)

// 	assert.Equal(t, oldValue, state.Old, "Exepected: %d, got: %d", oldValue, state.Old)
// 	assert.Equal(t, newValue, state.New, "Exepected: %d, got: %d", newValue, state.New)
// 	assert.WithinDuration(t, time.Now(), state.Timestamp, time.Second, "Timestamp should be within 1 second")
// 	assert.Nil(t, state.Metadata, "State metadata should be nil when initialized")
// }

// func TestNewStateDidChange(t *testing.T) {
// 	oldValue := 1
// 	newValue := 2
// 	state1 := internal.NewState(oldValue, newValue)
// 	assert.True(t, state1.DidChange, "Exepected: true, got: false")

// 	oldSameValue := 1
// 	newSameValue := 1
// 	state2 := internal.NewState(oldSameValue, newSameValue)
// 	assert.False(t, state2.DidChange, "Exepected: false, got: true")

// 	oldDeepValue := deepState{
// 		foo: "abc",
// 		bar: 123,
// 		baz: struct {
// 			qux string
// 		}{
// 			qux: "def",
// 		},
// 	}
// 	newDeepValue := deepState{
// 		foo: "xyz",
// 		bar: 321,
// 		baz: struct {
// 			qux string
// 		}{
// 			qux: "ghi",
// 		},
// 	}
// 	state3 := internal.NewState(oldDeepValue, newDeepValue)
// 	assert.True(t, state3.DidChange, "Exepected: true, got: false")

// 	oldDeepSameValue := deepState{
// 		foo: "abc",
// 		bar: 123,
// 		baz: struct {
// 			qux string
// 		}{
// 			qux: "def",
// 		},
// 	}
// 	newDeepSameValue := deepState{
// 		foo: "abc",
// 		bar: 123,
// 		baz: struct {
// 			qux string
// 		}{
// 			qux: "def",
// 		},
// 	}
// 	state4 := internal.NewState(oldDeepSameValue, newDeepSameValue)
// 	assert.False(t, state4.DidChange, "Exepected: false, got: true")
// }

// func TestGet(t *testing.T) {
// 	oldValue := 1
// 	newValue := 2
// 	state := internal.NewState(oldValue, newValue)

// 	assert.Equal(t, newValue, state.Get(), "Exepected: %d, got: %d")
// }

// func TestWithMetadata(t *testing.T) {
// 	oldValue := 1
// 	newValue := 2

// 	state := internal.NewState(oldValue, newValue)

// 	state.WithMetadata("key1", "value1")
// 	assert.NotNil(t, state.Metadata, "State metadata should not be nil after setting metadata")
// 	assert.Equal(t, "value1", state.Metadata["key1"], "Exepected: %s, got: %s")

// 	state.WithMetadata("key2", 123)
// 	assert.Equal(t, 123, state.Metadata["key2"], "Exepected: %s, got: %s")
// }

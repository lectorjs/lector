package reactive

import (
	"reflect"
	"sync"
	"time"
)

type State[T any] struct {
	value       T
	subscribers []StateSubscriber[T]
	timestamp   time.Time

	mu sync.RWMutex
}

type StateSubscriber[T any] func(old, state *T)

func NewState[T any](initialValue T) *State[T] {
	return &State[T]{
		value:       initialValue,
		subscribers: make([]StateSubscriber[T], 0),
		timestamp:   time.Now(),

		mu: sync.RWMutex{},
	}
}

func (rs *State[T]) Get() T {
	rs.mu.RLock()
	defer rs.mu.RUnlock()

	return rs.value
}

func (rs *State[T]) Update(value T) {
	rs.mu.Lock()
	oldValue := rs.value
	rs.value = value
	rs.timestamp = time.Now()
	rs.mu.Unlock()

	if !reflect.DeepEqual(oldValue, value) {
		for _, subscriber := range rs.subscribers {
			subscriber(&oldValue, &value)
		}
	}
}

func (rs *State[T]) Subscribe(subscriber StateSubscriber[T]) {
	rs.mu.Lock()
	defer rs.mu.Unlock()

	rs.subscribers = append(rs.subscribers, subscriber)
}

func (rs *State[T]) GetTimestamp() time.Time {
	return rs.timestamp
}

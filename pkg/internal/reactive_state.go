package internal

import (
	"reflect"
	"sync"
	"time"
)

type ReactiveState[T any] struct {
	value       T
	subscribers []ReactiveStateSubscriber[T]
	timestamp   time.Time

	mu sync.RWMutex
}

type ReactiveStateSubscriber[T any] func(old, state *T)

func NewReactiveState[T any](initialValue T) *ReactiveState[T] {
	return &ReactiveState[T]{
		value:       initialValue,
		subscribers: make([]ReactiveStateSubscriber[T], 0),
		timestamp:   time.Now(),

		mu: sync.RWMutex{},
	}
}

func (rs *ReactiveState[T]) Get() T {
	rs.mu.RLock()
	defer rs.mu.RUnlock()

	return rs.value
}

func (rs *ReactiveState[T]) Update(value T) {
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

func (rs *ReactiveState[T]) Subscribe(subscriber ReactiveStateSubscriber[T]) {
	rs.mu.Lock()
	defer rs.mu.Unlock()

	rs.subscribers = append(rs.subscribers, subscriber)
}

func (rs *ReactiveState[T]) GetTimestamp() time.Time {
	return rs.timestamp
}

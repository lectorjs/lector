package rsvp

import (
	"log"
	"sync"
	"time"

	"github.com/lectorjs/lector/pkg/primitive/node"
	"github.com/lectorjs/lector/pkg/primitive/parser"
)

const (
	DefaultNodesPerMinute = uint16(300)
	DefaultNodesPerCycle  = uint8(1)
)

type Rsvp struct {
	Settings   RsvpSettings
	Nodes      []node.Node
	Checkpoint uint32
	IsRunning  bool
	IsFinished bool

	mu   sync.Mutex
	stop chan struct{}
}

type RsvpSettings struct {
	NodesPerMinute uint16
	NodesPerCycle  uint8
}

func New() *Rsvp {
	return &Rsvp{
		Settings: RsvpSettings{
			NodesPerMinute: DefaultNodesPerMinute,
			NodesPerCycle:  DefaultNodesPerCycle,
		},
		Nodes:      []node.Node{},
		Checkpoint: 0,
		IsRunning:  false,
		IsFinished: false,

		mu:   sync.Mutex{},
		stop: make(chan struct{}),
	}
}

func (r *Rsvp) StreamNodes(parser parser.Parser) {
	nodeChan, errChan := parser.StreamNodes()

	for {
		select {
		case node, ok := <-nodeChan:
			if ok {
				r.Nodes = append(r.Nodes, node)
			} else {
				return
			}
		case err, ok := <-errChan:
			if ok {
				log.Fatalf("Error parsing plaintext: %v\n", err)
			} else {
				return
			}
		}
	}
}

func (r *Rsvp) Run() {
	ticker := time.NewTicker(r.traverseInterval())
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			r.mu.Lock()
			if r.IsRunning {
				r.traverseCycle()
			}
			r.mu.Unlock()

		case <-r.stop:
			return // Exit the goroutine when the stop channel is signaled
		}
	}
}

func (r *Rsvp) traverseInterval() time.Duration {
	return time.Minute / time.Duration(r.Settings.NodesPerMinute)
}

func (r *Rsvp) traverseCycle() {
	checkpoint := r.SkipFoward()

	if checkpoint == uint32(len(r.Nodes)) {
		r.IsFinished = true
		r.Pause()
	}
}

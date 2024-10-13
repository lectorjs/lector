package rsvp

import (
	"context"
	"fmt"
	"log"
	"math"

	"github.com/lectorjs/lector/pkg/internal"
	"github.com/lectorjs/lector/pkg/parser"
	"github.com/lectorjs/lector/pkg/primitive/node"
)

const (
	DefaultNodesPerMinute = uint16(300)
	DefaultNodesPerCycle  = uint8(1)
)

type RsvpEvent string

const (
	EventStateChanged RsvpEvent = "rsvp::stateChanged"
)

type RsvpService struct {
	ctx      context.Context
	Settings RsvpStateSettings
	State    *internal.ReactiveState[RsvpState]
}

type RsvpState struct {
	Nodes      []node.Node
	Checkpoint uint32
	IsRunning  bool
	IsFinished bool
}

type RsvpStateSettings struct {
	NodesPerMinute uint16
	NodesPerCycle  uint8
}

func NewService() *RsvpService {
	initialState := RsvpState{
		Nodes:      []node.Node{},
		Checkpoint: 0,
		IsRunning:  false,
		IsFinished: false,
	}

	reactiveState := internal.NewReactiveState(initialState)

	return &RsvpService{
		Settings: RsvpStateSettings{
			NodesPerMinute: DefaultNodesPerMinute,
			NodesPerCycle:  DefaultNodesPerCycle,
		},
		State: reactiveState,
	}
}

func (r *RsvpService) OnStartup(ctx context.Context) {
	r.ctx = ctx

	r.State.Subscribe(func(old, new *RsvpState) {
		fmt.Printf("State changed from %v to %v\n", old, new)
	})
}

func (r *RsvpService) OnDomReady(ctx context.Context) {
	// Nothing to do here yet
}

func (r *RsvpService) OnShutdown(ctx context.Context) {
	// Nothing to do here yet
}

func (r *RsvpService) StreamNodes(input string) (<-chan node.Node, <-chan error) {
	parser, err := parser.NewPlainParser(input)
	if err != nil {
		log.Fatalf("Error creating plaintext parser: %v\n", err)
	}

	nodeChan, errChan := parser.StreamNodes()

	for {
		select {
		case node, ok := <-nodeChan:
			if ok {
				r.State.Update(RsvpState{
					Nodes: append(r.State.Get().Nodes, node),
				})
			}
		case err, ok := <-errChan:
			if ok {
				log.Fatalf("Error streaming nodes: %v\n", err)
			}
		}
	}

}

func (r *RsvpService) JumpToStart() {
	r.State.Update(RsvpState{
		Checkpoint: 0,
	})
}

func (r *RsvpService) JumpToEnd() {
	r.State.Update(RsvpState{
		Checkpoint: uint32(len(r.State.Get().Nodes)),
	})
}

func (r *RsvpService) JumpToCheckpoint(checkpoint uint32) {
	r.State.Update(RsvpState{
		Checkpoint: checkpoint,
	})
}

func (r *RsvpService) SkipBackward() {
	checkpoint := float64(r.State.Get().Checkpoint)
	npc := float64(r.Settings.NodesPerCycle)

	r.State.Update(RsvpState{
		Checkpoint: uint32(math.Max(0, math.Floor(checkpoint-npc))),
	})
}

func (r *RsvpService) SkipFoward() {
	checkpoint := float64(r.State.Get().Checkpoint)
	npc := float64(r.Settings.NodesPerCycle)

	r.State.Update(RsvpState{
		Checkpoint: uint32(math.Min(float64(len(r.State.Get().Nodes)), math.Ceil(checkpoint+npc))),
	})
}

// func (r *RsvpService) Pause(ctx context.Context) {
// 	r.mu.Lock()
// 	defer r.mu.Unlock()

// 	if r.State.IsRunning {
// 		r.State.IsRunning = false
// 		r.stop <- struct{}{}
// 	}
// }

// func (r *RsvpService) Resume(ctx context.Context) {
// 	r.mu.Lock()
// 	defer r.mu.Unlock()

// 	if !r.State.IsRunning && !r.State.IsFinished {
// 		r.State.IsRunning = true
// 		go r.Run(ctx)
// 	}
// }

// func (r *RsvpService) traverseInterval() time.Duration {
// 	return time.Minute / time.Duration(r.State.Settings.NodesPerMinute)
// }

// func (r *RsvpService) traverseCycle(ctx context.Context) {
// 	checkpoint := r.SkipFoward(ctx)

// 	if checkpoint == uint32(len(r.State.Nodes)) {
// 		r.State.IsFinished = true
// 		r.Pause(ctx)
// 	}
// }

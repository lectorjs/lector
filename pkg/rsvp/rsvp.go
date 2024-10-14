package rsvp

import (
	"log"
	"math"

	"github.com/lector-org/lector/pkg/node"
	"github.com/lector-org/lector/pkg/parser"
	reactive "github.com/lector-org/lector/runtime/state"
)

const (
	DefaultNodesPerMinute = uint16(300)
	DefaultNodesPerCycle  = uint8(1)
)

type RsvpEvent string

const (
	EventStateChanged RsvpEvent = "rsvp::stateChanged"
)

type Rsvp struct {
	Settings RsvpStateSettings
	State    *reactive.State[RsvpState]
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

func New() *Rsvp {
	initialState := RsvpState{
		Nodes:      []node.Node{},
		Checkpoint: 0,
		IsRunning:  false,
		IsFinished: false,
	}

	state := reactive.NewState(initialState)

	return &Rsvp{
		Settings: RsvpStateSettings{
			NodesPerMinute: DefaultNodesPerMinute,
			NodesPerCycle:  DefaultNodesPerCycle,
		},
		State: state,
	}
}

func (r *Rsvp) StreamNodes(input string) (<-chan node.Node, <-chan error) {
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

func (r *Rsvp) JumpToStart() {
	r.State.Update(RsvpState{
		Checkpoint: 0,
	})
}

func (r *Rsvp) JumpToEnd() {
	r.State.Update(RsvpState{
		Checkpoint: uint32(len(r.State.Get().Nodes)),
	})
}

func (r *Rsvp) JumpToCheckpoint(checkpoint uint32) {
	r.State.Update(RsvpState{
		Checkpoint: checkpoint,
	})
}

func (r *Rsvp) SkipBackward() {
	checkpoint := float64(r.State.Get().Checkpoint)
	npc := float64(r.Settings.NodesPerCycle)

	r.State.Update(RsvpState{
		Checkpoint: uint32(math.Max(0, math.Floor(checkpoint-npc))),
	})
}

func (r *Rsvp) SkipFoward() {
	checkpoint := float64(r.State.Get().Checkpoint)
	npc := float64(r.Settings.NodesPerCycle)

	r.State.Update(RsvpState{
		Checkpoint: uint32(math.Min(float64(len(r.State.Get().Nodes)), math.Ceil(checkpoint+npc))),
	})
}

// func (r *Rsvp) Pause(ctx context.Context) {
// 	r.mu.Lock()
// 	defer r.mu.Unlock()

// 	if r.State.IsRunning {
// 		r.State.IsRunning = false
// 		r.stop <- struct{}{}
// 	}
// }

// func (r *Rsvp) Resume(ctx context.Context) {
// 	r.mu.Lock()
// 	defer r.mu.Unlock()

// 	if !r.State.IsRunning && !r.State.IsFinished {
// 		r.State.IsRunning = true
// 		go r.Run(ctx)
// 	}
// }

// func (r *Rsvp) traverseInterval() time.Duration {
// 	return time.Minute / time.Duration(r.State.Settings.NodesPerMinute)
// }

// func (r *Rsvp) traverseCycle(ctx context.Context) {
// 	checkpoint := r.SkipFoward(ctx)

// 	if checkpoint == uint32(len(r.State.Nodes)) {
// 		r.State.IsFinished = true
// 		r.Pause(ctx)
// 	}
// }

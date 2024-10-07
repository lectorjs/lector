package rsvp

// SkipFoward increments the reading checkpoint to the minimum of the next cycle or the end of the node list
func (r *Rsvp) SkipFoward() uint32 {
	nextCheckpoint := r.Checkpoint + uint32(r.Settings.NodesPerCycle)

	if nextCheckpoint > uint32(len(r.Nodes)) {
		r.Checkpoint = uint32(len(r.Nodes))
	} else {
		r.Checkpoint = nextCheckpoint
	}

	return r.Checkpoint
}

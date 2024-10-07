package rsvp

// SkipBackward decrements the reading checkpoint to the maximum of the previous cycle or the beginning of the node list
func (r *Rsvp) SkipBackward() uint32 {
	if r.Checkpoint > uint32(r.Settings.NodesPerCycle) {
		r.Checkpoint -= uint32(r.Settings.NodesPerCycle)
	} else {
		r.Checkpoint = 0
	}

	return r.Checkpoint
}

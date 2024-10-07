package rsvp

func (r *Rsvp) JumpToEnd() {
	r.Checkpoint = uint32(len(r.Nodes))
}

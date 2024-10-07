package rsvp

func (r *Rsvp) Resume() {
	r.mu.Lock()
	defer r.mu.Unlock()

	if !r.IsRunning && !r.IsFinished {
		r.IsRunning = true
		go r.Run()
	}
}

package rsvp

func (r *Rsvp) Pause() {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.IsRunning {
		r.IsRunning = false
		r.stop <- struct{}{}
	}
}

package services

import "github.com/lectorjs/lector/pkg/rsvp"

type ReaderService struct {
	Modes *ReaderServiceModes
}

type ReaderServiceModes struct {
	Rsvp *rsvp.Rsvp
}

func NewReaderService() *ReaderService {
	return &ReaderService{
		Modes: &ReaderServiceModes{
			Rsvp: rsvp.New(),
		},
	}
}

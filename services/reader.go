package services

import "github.com/lector-org/lector/pkg/rsvp"

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

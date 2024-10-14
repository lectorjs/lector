package parser

import "github.com/lector-org/lector/pkg/node"

type Parser interface {
	StreamNodes() (<-chan node.Node, <-chan error)
}

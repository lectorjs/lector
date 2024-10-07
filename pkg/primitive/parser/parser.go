package parser

import "github.com/lectorjs/lector/pkg/primitive/node"

type Parser interface {
	StreamNodes() (<-chan node.Node, <-chan error)
}

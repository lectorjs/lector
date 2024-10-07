package context

import "github.com/lectorjs/lector/pkg/primitive/node"

type LectorContext struct {
	Parser LectorContextParser
}

type LectorContextParser struct {
	Nodes             []node.Node
	IsParsing         bool
	IsParsingComplete bool
}

func NewLectorContext() *LectorContext {
	return &LectorContext{
		Parser: LectorContextParser{
			Nodes:             []node.Node{},
			IsParsing:         false,
			IsParsingComplete: false,
		},
	}
}

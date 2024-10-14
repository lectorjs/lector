package parser

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/lector-org/lector/pkg/node"
)

type PlainParser struct {
	input io.Reader
}

func NewPlainParser(input interface{}) (*PlainParser, error) {
	var reader io.Reader

	switch v := input.(type) {
	case string:
		reader = strings.NewReader(v)
	case *os.File:
		reader = v
	default:
		return nil, fmt.Errorf("unsupported type %T", v)
	}

	return &PlainParser{input: reader}, nil
}

func (p *PlainParser) StreamNodes() (<-chan node.Node, <-chan error) {
	nodeChan := make(chan node.Node)
	errorChan := make(chan error)

	go func() {
		defer close(nodeChan)
		defer close(errorChan)

		scanner := bufio.NewScanner(p.input)
		scanner.Split(bufio.ScanWords)

		position := 0
		for scanner.Scan() {
			word := scanner.Text()

			if strings.HasPrefix(word, "http://") || strings.HasPrefix(word, "https://") {
				nodeChan <- node.NewLinkNode(node.LinkNodeOptions{
					Text:     word,
					Url:      word,
					Position: position,
				})
			} else {
				nodeChan <- node.NewWordNode(node.WordNodeOptions{
					Text:     word,
					Position: position,
				})
			}

			position++
		}

		if err := scanner.Err(); err != nil {
			errorChan <- fmt.Errorf("failed to scan: %w", err)
		}
	}()

	return nodeChan, errorChan
}

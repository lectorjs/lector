package plaintext

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/lectorjs/lector/pkg/primitive/node"
	"github.com/lectorjs/lector/pkg/runtime/errorx"
)

type PlaintextParser struct {
	input io.Reader
}

func NewPlaintextParser(input interface{}) (*PlaintextParser, error) {
	var reader io.Reader

	switch v := input.(type) {
	case string:
		reader = strings.NewReader(v)
	case *os.File:
		reader = v
	default:
		return nil, errorx.NewParserError(errorx.NewFormattedErrorOptions{
			Type:    errorx.ErrParserUnsupportedType,
			Message: fmt.Sprintf("type %T is not supported", v),
			Err:     nil,
		})
	}

	return &PlaintextParser{input: reader}, nil
}

func (p *PlaintextParser) StreamNodes() (<-chan node.Node, <-chan error) {
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
				nodeChan <- node.NewNodeLink(node.NodeLinkOptions{
					Text:     word,
					Url:      word,
					Position: position,
				})
			} else {
				nodeChan <- node.NewNodeWord(node.NodeWordOptions{
					Text:     word,
					Position: position,
				})
			}

			position++
		}

		if err := scanner.Err(); err != nil {
			errorChan <- errorx.NewParserError(errorx.NewFormattedErrorOptions{
				Type:    errorx.ErrParserScanner,
				Message: fmt.Sprintf("scanner error at position %d", position),
				Err:     err,
			})
		}
	}()

	return nodeChan, errorChan
}

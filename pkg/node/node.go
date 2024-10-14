package node

type NodeType string

const (
	WordType  NodeType = "word"
	LinkType  NodeType = "link"
	ImageType NodeType = "image"
	VideoType NodeType = "video"
)

type Node interface {
	GetType() NodeType
	GetPosition() int
}

type baseNode struct {
	nodeType NodeType
	position int
}

func (b *baseNode) GetType() NodeType {
	return b.nodeType
}

func (b *baseNode) GetPosition() int {
	return b.position
}

type WordNode struct {
	baseNode
	Text string
}

type WordNodeOptions struct {
	Position int
	Text     string
}

type LinkNode struct {
	baseNode
	Text string
	Url  string
}

type LinkNodeOptions struct {
	Position int
	Text     string
	Url      string
}

type ImageNode struct {
	baseNode
	Alt string
	Url string
}

type ImageNodeOptions struct {
	Position int
	Alt      string
	Url      string
}

type VideoNode struct {
	baseNode
	Url string
}

type VideoNodeOptions struct {
	Position int
	Url      string
}

func NewWordNode(options WordNodeOptions) *WordNode {
	return &WordNode{
		baseNode: baseNode{
			nodeType: WordType,
			position: options.Position,
		},
		Text: options.Text,
	}
}

func NewLinkNode(options LinkNodeOptions) *LinkNode {
	return &LinkNode{
		baseNode: baseNode{
			nodeType: LinkType,
			position: options.Position,
		},
		Text: options.Text,
		Url:  options.Url,
	}
}

func NewImageNode(options ImageNodeOptions) *ImageNode {
	return &ImageNode{
		baseNode: baseNode{
			nodeType: ImageType,
			position: options.Position,
		},
		Alt: options.Alt,
		Url: options.Url,
	}
}

func NewVideoNode(options VideoNodeOptions) *VideoNode {
	return &VideoNode{
		baseNode: baseNode{
			nodeType: VideoType,
			position: options.Position,
		},
		Url: options.Url,
	}
}

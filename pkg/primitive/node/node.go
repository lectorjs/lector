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

type BaseNode struct {
	Type     NodeType
	Position int
}

func (b BaseNode) GetType() NodeType {
	return b.Type
}

func (b BaseNode) GetPosition() int {
	return b.Position
}

type NodeWord struct {
	BaseNode
	Text   string
	Length int
}

type NodeWordOptions struct {
	Text     string
	Position int
}

func NewNodeWord(opts NodeWordOptions) *NodeWord {
	return &NodeWord{
		BaseNode: BaseNode{
			Type:     WordType,
			Position: opts.Position,
		},
		Text:   opts.Text,
		Length: len(opts.Text),
	}
}

type NodeLink struct {
	BaseNode
	Text string
	Url  string
}

type NodeLinkOptions struct {
	Text     string
	Url      string
	Position int
}

func NewNodeLink(opts NodeLinkOptions) *NodeLink {
	return &NodeLink{
		BaseNode: BaseNode{
			Type:     LinkType,
			Position: opts.Position,
		},
		Text: opts.Text,
		Url:  opts.Url,
	}
}

type NodeImage struct {
	BaseNode
	Alt string
	Url string
}

type NodeImageOptions struct {
	Alt      string
	Url      string
	Position int
}

func NewNodeImage(opts NodeImageOptions) *NodeImage {
	return &NodeImage{
		BaseNode: BaseNode{
			Type:     ImageType,
			Position: opts.Position,
		},
		Alt: opts.Alt,
		Url: opts.Url,
	}
}

type NodeVideo struct {
	BaseNode
	Url string
}

type NodeVideoOptions struct {
	Url      string
	Position int
}

func NewNodeVideo(opts NodeVideoOptions) *NodeVideo {
	return &NodeVideo{
		BaseNode: BaseNode{
			Type:     VideoType,
			Position: opts.Position,
		},
		Url: opts.Url,
	}
}

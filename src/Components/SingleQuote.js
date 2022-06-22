import { Card } from 'react-bootstrap'

export default function SingleQuote({ quote }){
    return (
        <Card style={{ width: '100%' }} className="shadow-sm p-3 mb-5 bg-white rounded">
        <Card.Body>
            <Card.Subtitle className="mb-2">
                <blockquote className="blockquote" style={{ lineHeight: '1.4' }}>
                    "{quote.node.quote}"
                </blockquote>
            </Card.Subtitle>
            <Card.Text className='text-muted'>
            - {quote.node.author ? quote.node.author : "unknown"}
            </Card.Text>
            <div style={{ textAlign: 'right' }}>
                Posted by <Card.Link href={`/user/${quote.node.postedBy.username}`} className="text-decoration-none"><strong>{quote.node.postedBy.name}</strong></Card.Link>
            </div>
        </Card.Body>
        </Card>
    )
}
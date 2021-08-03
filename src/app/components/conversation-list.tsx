import React from 'react'
import { Link } from 'react-router-dom'
import { fetchRoomList } from '../api/api'

interface ConversationInfo {
    uuid: string
    self: string
    peers: string[]
    name: string
    nicks: Map<string, string>
}

interface ConversationListState {
    conversations: JSX.Element[]
}

export class ConversationList extends React.Component<unknown, ConversationListState> {
    constructor(props: unknown) {
        super(props)
        this.state = {
            conversations: []
        }
    }

    componentDidMount(): void {
        fetchRoomList()
            .then(res => res.json())
            .then(result => {
                const foo: JSX.Element[] = []
                if (result != null) {
                    result.forEach((element: ConversationInfo) => {
                        foo.push(<ConversationListElement info={element} key={element.uuid} />)
                    })
                }

                this.setState({
                    conversations: foo
                })
            }
            )
    }

    render(): JSX.Element {
        return (
            <ul>
                {this.state.conversations}
            </ul>
        )
    }
}

interface ConversationListElementProps {
    info: ConversationInfo
}

class ConversationListElement extends React.Component<ConversationListElementProps> {
    render(): JSX.Element {
        return (
            <li>
                <Link to={'/c/' + this.props.info.uuid}>
                    <div>
                        {(this.props.info.name ?? this.props.info.uuid)}
                    </div>
                </Link>
            </li>
        )
    }
}
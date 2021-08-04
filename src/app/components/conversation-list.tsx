import React from 'react'
import { Link } from 'react-router-dom'
import { fetchRoomList } from '../api/api'
import styles from './conversation-list.css'

interface ConversationInfo {
    uuid: string
    self: string
    peers: string[]
    name: string
    nicks: Map<string, string>
}

interface ConversationListState {
    listElements: JSX.Element[]
    listElementRefs: React.RefObject<ConversationListElement>[]
}

export class ConversationList extends React.Component<unknown, ConversationListState> {
    constructor(props: unknown) {
        super(props)
        this.state = {
            listElements: [],
            listElementRefs: []
        }
    }

    componentDidMount(): void {
        console.log(styles)
        fetchRoomList()
            .then(res => res.json())
            .then(result => {
                const foo: JSX.Element[] = []
                const bar: React.RefObject<ConversationListElement>[] = []
                if (result != null) {
                    result.forEach((element: ConversationInfo) => {
                        bar.push(React.createRef())
                        foo.push(<ConversationListElement 
                            info={element} 
                            parent={this} 
                            key={element.uuid} 
                            ref={bar[bar.length - 1]} />)
                    })
                }

                this.setState({
                    listElements: foo,
                    listElementRefs: bar
                })
            }
            )
    }

    render(): JSX.Element {
        return (
            <ul style={{
                listStyle: 'none',
                padding: '0px'
            }}>
                {this.state.listElements}
            </ul>
        )
    }

    setSelectedElement(select: ConversationListElement): void {
        this.state.listElementRefs.forEach((element: React.RefObject<ConversationListElement>) => {
            element.current.setState({
                selected: select == element.current
            })
        })
    }
}

interface ConversationListElementProps {
    info: ConversationInfo
    parent: ConversationList
}

interface ConversationListElementState {
    selected: boolean
}

class ConversationListElement extends React.Component<ConversationListElementProps, ConversationListElementState> {
    constructor(props: ConversationListElementProps) {
        super(props)
        this.state = {
            selected: false
        }
    }

    render(): JSX.Element {
        return (
            <li>
                <Link style={{
                    textDecoration: 'none',
                    color: 'black'
                }} to={'/c/' + this.props.info.uuid}>
                    <div className={`
                        ${styles.listEntry} 
                        ${this.state.selected ? styles.selectedEntry : ''}
                        `} onClick={() => { this.props.parent.setSelectedElement(this) }}>
                        {(this.props.info.name ?? this.props.info.uuid.split('-')[0])}
                    </div>
                </Link>
            </li>
        )
    }
}
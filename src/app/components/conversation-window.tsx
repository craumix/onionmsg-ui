import EmojiPicker from "emoji-picker-react";
import { generateFromString } from "generate-avatar";
import React from "react";
import { fetchRoomMessages, postMessageToRoom } from "../api/api";
import { decode as decode64 } from 'js-base64';

interface MessageMeta {
    sender: string
    time: string
    type: string
}

interface Message {
    meta: MessageMeta
    content: string
}

export var ConvWin: ConversationWindow

export class ConversationWindow extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            messageInput: '',
            messagesContainers: [],
            lastMessageSenderUUID: '',
            emojiSelectorVisible: false
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '32px'
                }}>
                    <h1 style={{
                        margin: '0px',
                        marginLeft: '8px',
                        marginTop: '8px',
                        fontSize: '20px'
                    }}>{this.props.match.params.uuid}</h1>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '32px',
                    height: 'calc(100% - 96px)',
                    width: '100%',
                    overflowY: 'auto',
                }}>
                    {this.state.messagesContainers}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '0px',
                    width: '100%',
                    height: '64px'
                }}>
                    <textarea placeholder="Send a message here..." style={{
                        border: '0px',
                        outline: 'none',
                        margin: '16px',
                        fontSize: '16px',
                        width: '80%',
                        resize: 'none',
                        float: 'left'
                    }} onKeyDown={event => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()

                            if (this.state.messageInput.length == 0) {
                                //Force-Reload
                                this.hardReloadMessages()
                                return
                            }

                            postMessageToRoom(this.props.match.params.uuid, this.state.messageInput)
                                .then(res => {
                                    if (res.ok) {
                                        console.log('Message sent!')
                                        this.setState({
                                            messageInput: ''
                                        })
                                        this.loadNextMessage()
                                    } else {
                                        console.log('Error sending message!\n' + res.text)
                                    }
                                })
                        }
                    }} value={this.state.messageInput} onChange={e => this.setState({
                        messageInput: e.target.value
                    })} />
                    <button style={{
                        border: '0px',
                        background: 'white',
                        fontSize: '20px'
                    }} onClick={() => this.setState({ emojiSelectorVisible: !this.state.emojiSelectorVisible })}>😃</button>
                    <div hidden={!this.state.emojiSelectorVisible} style={{
                        position: 'absolute',
                        bottom: '64px',
                        right: '0px'
                    }}>
                        <EmojiPicker native={true}
                            onEmojiClick={(event, emojiObject) => this.setState({ messageInput: this.state.messageInput + emojiObject.emoji })} />
                    </div>

                </div>
            </div>
        )
    }

    componentDidMount(): void {
        this.hardReloadMessages()
        ConvWin = this
    }

    componentDidUpdate(prevProps: any): void {
        if (this.props.match.params.uuid != prevProps.match.params.uuid) {
            this.hardReloadMessages()
        }
    }

    hardReloadMessages(): void {
        this.loadNewMessages(false)
    }

    loadNextMessage(): void {
        this.loadNewMessages(true, 1)
    }

    loadNewMessages(append: boolean, count?: number): void {
        fetchRoomMessages(this.props.match.params.uuid, count)
            .then(res => res.json())
            .then(result => {
                const foo: JSX.Element[] = append ? this.state.messagesContainers : []
                let lastSender = append ? this.state.lastMessageSenderUUID : ''
                if (result != null) {
                    result.forEach((element: Message, index: number) => {
                        //TODO remove usage of Math.random for keys
                        if (lastSender != element.meta.sender) {
                            foo.push(<AuthorDivider author={element.meta.sender} key={Math.random()} />)
                            lastSender = element.meta.sender
                        }
                        if (element.meta.type === 'mtype.text') {
                            foo.push(<MessageContainer message={element} key={Math.random()} />)
                        }
                    });
                }

                this.setState({
                    messagesContainers: foo,
                    lastMessageSenderUUID: lastSender,
                })
            })
    }
}

class AuthorDivider extends React.Component<any> {
    render(): JSX.Element {
        return (
            <div style={{
                width: 'calc(100% - 16px)',
                height: 'fit-content',
                marginTop: '16px',
                marginLeft: '8px',
                marginRight: '8px',
            }}>
                <Avatar style={{
                    width: '32px',
                    marginLeft: '16px',
                    borderRadius: '16px',
                    float: 'left'
                }} seed={this.props.author} />
                <p style={{
                    margin: '0px',
                    marginTop: '8px',
                    marginLeft: '64px',
                    fontSize: '14px',
                    color: 'purple',
                    fontWeight: 'bold',
                }}>{this.props.author}</p>
            </div>
        )
    }
}

interface MessageContainerProps {
    message: Message
}

class MessageContainer extends React.Component<MessageContainerProps> {
    render(): JSX.Element {
        return (
            <div style={{
                width: 'calc(100% - 16px)',
                height: 'fit-content',
                marginLeft: '8px',
                marginRight: '8px',
            }}>
                <p style={{
                    margin: '8px',
                    marginLeft: '64px',
                    fontSize: '14px'
                }} >{decode64(this.props.message.content)}</p>
            </div>
        )
    }
}

interface AvatarProps {
    seed: string
    style?: React.CSSProperties
}

class Avatar extends React.Component<AvatarProps> {
    render(): JSX.Element {
        return <img style={this.props.style} src={`data:image/svg+xml;utf8,${generateFromString(this.props.seed)}`} />
    }
}
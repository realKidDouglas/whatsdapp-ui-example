import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ContactList from './ContactList'

const {ipcRenderer} = window.require('electron');

class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            handlesWithNewMessage: [],
            activatedSession: {handle: null},
            messages: [] //only the message history with activated contact
        }
    }

    componentDidMount() {
        this.loadContacts();
        ipcRenderer.on('new-message', (evt, args) => this.handleNewMessage(args))
    }

    componentWillUnmount() {
    }

    async loadContacts() {
        const sessions = await ipcRenderer.invoke('get-sessions');
        this.setState({sessions: sessions})
    }

    async handleNewMessage(args) {
        const [msg, session] = args
        if (!this.state.sessions.map(s => s.handle).includes(session.handle)) {
            console.log('session new!', session);
            this.setState({sessions: this.state.sessions.concat([session])});
        }

        const tmpSes = this.state.handlesWithNewMessage.concat([session.handle]);
        this.setState({handlesWithNewMessage: tmpSes});

        // if the active contact is the one that sent the msg
        if (tmpSes.indexOf(this.state.activatedSession.handle) > -1) {
            this.setState({messages: this.state.messages.concat(msg)});
        }

    }

    onSend = async (text) => {
        let msgSent = await ipcRenderer.invoke('sendMessage', this.state.activatedSession, text);
        if (msgSent) {
            this.setState({
                messages: this.state.messages.concat([{
                    senderHandle: this.props.loggedInUser.handle,
                    timestamp: new Date().toLocaleString(),
                    content: text
                }])
            })
        } else console.error("Could not send message")
    }

    setActivatedSession = contact => {
        this.setState({activatedSession: contact})
        this.getChatHistory(contact)
    }

    async getChatHistory(contact) {
        let history = await ipcRenderer.invoke('getChatHistoryOf', contact);
        this.setState({messages: history});
    }

    render() {
        return (
            <div className="pane-group">
                <div className="pane pane-sm sidebar">
                    <ContactList
                        sessions={this.state.sessions}
                        openedContact={this.state.activatedSession}
                        setOpenedContact={this.setActivatedSession}
                        handlesWithNewMessage={this.state.handlesWithNewMessage}
                    />
                </div>
                <div className="pane in-column">
                    <MessageList
                        messages={this.state.messages}
                        loggedInUser={this.props.loggedInUser}/>
                    <SendMessageForm onSend={this.onSend}/>
                </div>
            </div>
        )
    }
}

export default Chat
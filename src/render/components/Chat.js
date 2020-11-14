import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ContactList from './ContactList'

const {ipcRenderer} = window.require('electron');

class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            contacts: [],
            handlesWithNewMessage: [],
            activatedContact: {handle: null},
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
        const contacts = await ipcRenderer.invoke('getContacts');
        this.setState({contacts: contacts})
    }

    async handleNewMessage(args) {
        const [msg, session] = args
        if (!this.state.contacts.map(c => c.handle).includes(session.handle)) {
            console.log('session new!', session);
            this.setState({contacts: this.state.contacts.concat([session])});
        }

        let contactsTmp = this.state.handlesWithNewMessage.concat([session.handle]);
        this.setState({handlesWithNewMessage: contactsTmp});

        // if the active contact is the one that sent the msg
        if (contactsTmp.indexOf(this.state.activatedContact.handle) > -1) {
            this.setState({messages: this.state.messages.concat(msg)});
        }

    }

    onSend = async (text) => {
        let msgSent = await ipcRenderer.invoke('sendMessage', this.state.activatedContact, text);
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

    setActivatedContact = contact => {
        this.setState({activatedContact: contact})
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
                        contacts={this.state.contacts}
                        openedContact={this.state.activatedContact}
                        setOpenedContact={this.setActivatedContact}
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
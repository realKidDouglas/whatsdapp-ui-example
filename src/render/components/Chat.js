import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ContactList from './ContactList'
import { withStyles } from '@material-ui/core/styles';

const {ipcRenderer} = window.require('electron');
const sortByTime = (a, b) => a.timestamp - b.timestamp;

class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            handlesWithNewMessage: [],
            activatedSession: {profile_name: null},
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
        if (!this.state.sessions.map(s => s.profile_name).includes(session.profile_name)) {
            console.log('session new!', session);
            this.setState({sessions: this.state.sessions.concat([session])});
        }

        const tmpSes = this.state.handlesWithNewMessage.concat([session.profile_name]);
        this.setState({handlesWithNewMessage: tmpSes});

        // if the active contact is the one that sent the msg
        if (tmpSes.indexOf(this.state.activatedSession.profile_name) > -1) {
            const newMessagesArray = this.state.messages
                .concat(msg)
                .sort(sortByTime)
            this.setState({messages: newMessagesArray});
        }

    }

    onSend = async (text) => {
        try {
            console.log(this.state)
            await ipcRenderer.invoke('sendMessage', this.state.activatedSession.profile_name, text);
        } catch (e) {
            console.log("Could not send message", e)
        }
        // we will get a new-message event from the messenger as soon as the msg is sent.
    }

    setActivatedSession = contact => {
        if (this.state.activatedSession.profile_name === contact.profile_name) return;
        this.setState({activatedSession: contact})
        this.getChatHistory(contact)
    }

    async getChatHistory(contact) {
        let history = await ipcRenderer.invoke('get-chat-history', contact);
        this.setState({messages: history.sort(sortByTime)});
    }

    render() {
        let { classes } = this.props;
        return (
            <div className={classes.chat}>
                <ContactList
                    sessions={this.state.sessions}
                    openedContact={this.state.activatedSession}
                    setOpenedContact={this.setActivatedSession}
                    handlesWithNewMessage={this.state.handlesWithNewMessage}/>
                <div className={classes.inColumn}>
                    <MessageList
                        messages={this.state.messages}
                        loggedInUser={this.props.loggedInUser}/>
                    <SendMessageForm onSend={this.onSend}/>
                </div>
            </div>
        )
    }
}

const styles = theme => ({
    chat: {
        display: 'flex',
        height: '100vh',
    },
    inColumn: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    }
});

export default withStyles(styles)(Chat)
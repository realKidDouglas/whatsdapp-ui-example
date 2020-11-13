import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ContactList from './ContactList'
const { ipcRenderer } = window.require('electron');

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

      this.pollTimer = setInterval(
        () => this.pollNewMessages(), 10000
      )
    }

    componentWillUnmount() {
      clearInterval(this.pollTimer);
    }

    async loadContacts() {
      let contacts = [];
      contacts = await ipcRenderer.invoke('getContacts');
      this.setState({contacts: contacts})
    }

    async pollNewMessages() {
      let contactsWithNewMsg = await ipcRenderer.invoke('newMessagesAvailable');
      if(contactsWithNewMsg.length > 0) {
        let contactsTmp = [];
        contactsTmp = contactsWithNewMsg.map(contactNew => {
            return contactNew.handle
        });
        this.setState({handlesWithNewMessage: contactsTmp})

        if(contactsTmp.indexOf(this.state.activatedContact.handle) > -1) {
          let newMessages = await ipcRenderer.invoke('getNewMessagesFrom', this.state.activatedContact);
          this.setState({messages: this.state.messages.concat(newMessages)})
        }
      }
    } 

    onSend = async (text) => {
      let msgSent = await ipcRenderer.invoke('sendMessage', this.state.activatedContact, text);
      if (msgSent) {
        this.setState({messages: this.state.messages.concat([{
          senderHandle: this.props.loggedInUser.handle,
          timestamp: new Date().toLocaleString(),
          content: text
        }])})
      }
      else console.error("Could not send message")
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
            <SendMessageForm onSend={this.onSend} />
          </div>
        </div>
      )
    }
  }
  
  export default Chat
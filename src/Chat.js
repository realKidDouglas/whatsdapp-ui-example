import React from 'react'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import ContactList from './ContactList'

class Chat extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        currentUser: null,
        contacts: [],
        messages: []
      }
    }
  
    componentDidMount() {
        this.setState({ //TODO: Geeignete Datenstruktur
            currentUser: "testUser",
            contacts: ["contact1", "contact2", "contact3"],
            messages: ["message1", "message2", "message3", "message4", "message5", "dth fstjhsrjrtsj fxz jfszd  dtyil zgrl gho rugöouöhg lihug rgodhrg drhi godrhg osdhg oshg osdjgoi sej goisjg"],
            openedContact: null
        })
    }
  
    onSend = text => {
      //TODO: This is only clickdummy prototyping
        this.setState({messages: this.state.messages.concat(text)})
    }

    setOpenedContact = user => {
      //TODO: This is only clickdummy prototyping
      this.setState({openedContact: user})
    }
  
    render() {
      return (
        <div className="window-content">
          <div className="pane-group">
            <div className="pane pane-sm sidebar">
              <ContactList
                users={this.state.contacts}
                openedContact={this.state.openedContact}
                setOpenedContact={this.setOpenedContact}
              />
            </div>
            <div className="pane in-column">
              <MessageList
                messages={this.state.messages}
                currentUser={this.state.currentUser}
                openedContact={this.state.openedContact}/>
              <SendMessageForm onSend={this.onSend} />
            </div>
          </div>
        </div>
      )
    }
  }
  
  export default Chat
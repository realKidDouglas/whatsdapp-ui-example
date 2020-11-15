import React, { Component } from 'react'

class MessageList extends Component {

  componentDidMount () {
    this.scrollToBottom()
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom = () => {
    if(this.messageListRef) {
      let scrollHeight = this.messageListRef.scrollHeight;
      let height = this.messageListRef.clientHeight;
      let maxScrollTop = scrollHeight - height;
      this.messageListRef.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }
  
  render() {
    if(this.props.messages.length > 0) {
      return (
        <ul className="list-group space-filling-msglist" ref={el => {this.messageListRef = el}}>
          {this.props.messages.map((message, index) =>
              this.renderItem(message)
            )}
        </ul>
      )
    }
    else {
      return (
        <ul className="list-group space-filling-msglist">
          <p className="text-center grey">No contact selected or no messages available for the contact...</p>
        </ul>
      )
    }
  }

  renderItem(message) {
    return (
      <li key={message.timestamp} className="list-group-item">
          <strong>{message.senderHandle + (message.senderHandle === this.props.loggedInUser.handle ? " (You)" : "")}</strong>
          <span className="pull-right grey">{message.timestamp}</span>
          <p className="selectable-text show-full-text">{message.content}</p>
      </li>
    )
  }
}

export default MessageList
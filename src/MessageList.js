import React, { Component } from 'react'

class MessageList extends Component {

  componentDidMount () {
    this.scrollToBottom()
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom = () => {
    this.scrollHeight = this.messageListRef.scrollHeight;
    this.height = this.messageListRef.clientHeight;
    this.maxScrollTop = this.scrollHeight - this.height;
    this.messageListRef.scrollTop = this.maxScrollTop > 0 ? this.maxScrollTop : 0;
  }

  render() {
    return (
      <ul className="list-group space-filling-msglist" ref={el => {this.messageListRef = el}}>
        {this.props.messages.map((message, index) =>
            this.renderItem(message)
          )}
      </ul>
    )
  }

  renderItem(message) {
    return (
      <li className="list-group-item">
          <strong>Username</strong><span className="pull-right grey">00:00</span>
          <p className="selectable-text">{message}</p>
      </li>
    )
  }
}

export default MessageList
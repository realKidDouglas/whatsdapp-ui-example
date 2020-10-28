import React, { Component } from 'react'

class SendMessageForm extends Component {
  state = {
    text: ''
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSend(this.state.text)
    this.setState({ text: '' })
  }

  onChange = e => {
    this.setState({ text: e.target.value })
    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  render() { 
    return (
      <form onSubmit={this.onSubmit} className="in-row flex-nogrow-noshrink">
          <input type="text" className="form-control small-margin" placeholder="Message..." onChange={this.onChange} value={this.state.text}/>
          <button type="submit" className="btn btn-form btn-primary pull-right small-margin">Send</button>
      </form>
    )
  }
}

export default SendMessageForm

import React, { Component } from 'react'

class ContactList extends Component {

  onContactOpened(user) {
    this.props.setOpenedContact(user)
  }

  render() {
    return (
      <ul className="list-group">
        <li className="list-group-header">
          <input className="form-control" type="text" placeholder="Search for someone"/>
        </li>
        {this.props.users.map((user, index) => {
              return this.renderItem(user)
            })}
      </ul>
    )
  }

  renderItem(user) {
    return (
      <li className={user === this.props.openedContact ? "list-group-item active" : "list-group-item"} onClick={((e) => this.onContactOpened(user))}>
        <span className="icon icon-user pull-left media-object"/>
        <div>
          <strong>{user}</strong>
          <p>Preview letzte message</p>
        </div>
      </li>
    )
  }
}

export default ContactList
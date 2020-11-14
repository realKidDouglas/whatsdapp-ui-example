import React, {Component} from 'react'

class ContactList extends Component {

    onContactOpened(contact) {
        this.props.setOpenedContact(contact)
    }

    render() {
        return (
            <ul className="list-group">
                <li className="list-group-header">
                    <input className="form-control" type="text" placeholder="Search for someone"/>
                </li>
                {this.props.contacts.map((contact, index) => {
                    return this.renderItem(contact, index)
                })}
            </ul>
        );
    }

    renderItem(contact, index) {
        // TODO: don't use index as key, might break if order changes.
        return (
            <li key={index}
                className={contact.handle === this.props.openedContact.handle ? "list-group-item active" : "list-group-item"}
                onClick={((e) => this.onContactOpened(contact))}>
                <span className="icon icon-user pull-left media-object"/>
                <div>
                    <strong>{contact.handle}</strong>
                    <p>{this.props.handlesWithNewMessage.indexOf(contact.handle) > -1 ? "New message(s)..." : "No new message"}</p>
                </div>
            </li>
        )
    }
}

export default ContactList
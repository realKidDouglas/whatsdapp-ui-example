import React, {Component} from 'react'

class ContactList extends Component {

    onContactOpened(session) {
        this.props.setOpenedContact(session)
    }

    render() {
        return (
            <ul className="list-group">
                <li className="list-group-header">
                    <input className="form-control" type="text" placeholder="Search for someone"/>
                </li>
                {this.props.sessions.map((contact, index) => {
                    return this.renderItem(contact, index)
                })}
            </ul>
        );
    }

    renderItem(session, index) {
        // TODO: don't use index as key, might break if order changes.
        return (
            <li key={index}
                className={session.handle === this.props.openedContact.handle ? "list-group-item active" : "list-group-item"}
                onClick={((e) => this.onContactOpened(session))}>
                <span className="icon icon-user pull-left media-object"/>
                <div>
                    <strong>{session.handle}</strong>
                    <p>{this.props.handlesWithNewMessage.indexOf(session.handle) > -1 ? "New message(s)..." : "No new message"}</p>
                </div>
            </li>
        )
    }
}

export default ContactList
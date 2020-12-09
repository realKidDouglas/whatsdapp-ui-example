import React, {Component} from 'react'
const {ipcRenderer} = window.require('electron');

class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        findContactViaDPNS: "",
        name: [],
        }
      }
    onContactOpened(session) {
        this.props.setOpenedContact(session)
    }
    handleDisplayNameChange = event => {
        this.setState({
            findContactViaDPNS: event.target.value
        })
      }
     

    async findContact(){
        let newSession = await ipcRenderer.invoke('findcontact', this.state.findContactViaDPNS)
        //console.log("get-name", contact)
        this.props.newContact(newSession);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onContactDisplay}  className=""></form>
            <ul className="list-group">
                <li className="list-group-header">
                    <input className="form-control" type="text" placeholder="Search for someone" value={this.state.findContactViaDPNS} onChange={this.handleDisplayNameChange}/>
                </li>
                {this.props.sessions.map((contact, index) => {
                    return this.renderItem(contact, index)
                })}
            </ul>
            <button type="submit" className="btn btn-form btn-primary pull-right small-margin"onClick={() => this.findContact()}>Search contact</button>
            <div>{this.state.name.displayName}</div>
            </div>
        );
    }

    renderItem(session, index) {
        // TODO: don't use index as key, might break if order changes.
        return (
            <div>
            <li key={index}
                className={session.profile_name === this.props.openedContact.profile_name ? "list-group-item active" : "list-group-item"}
                onClick={((e) => this.onContactOpened(session))}>
                <span className="icon icon-user pull-left media-object"/>
                <div>
                    <strong>{session.profile_name}</strong>
                    <p>{this.props.handlesWithNewMessage.indexOf(session.profile_name) > -1 ? "New message(s)..." : "No new message"}</p>
                </div>
            </li>
            </div>
        )
    }
}

export default ContactList
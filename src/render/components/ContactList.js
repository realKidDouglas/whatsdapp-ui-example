import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';

const {ipcRenderer} = window.require('electron');

class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
          displayname: "",
          name: [],
        }
      }
    onContactOpened(session) {
        this.props.setOpenedContact(session)
    }
    handleDisplayNameChange = event => {
        this.setState({
          displayname: event.target.value
        })
      }
     

    async findContact(){

        let displayname = this.state.displayname

        let contact = await ipcRenderer.invoke('findcontact', displayname)
        this.setState({name: contact})
        const f = this.state.name.displayName
        console.log("get-name", f)
    }

    render() {
        let { classes } = this.props;

        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                  }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider />
                <List>
                {['Contact a', 'Contact b', 'Contact c', 'Contact d'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon><PersonIcon/></ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                </List>
            </Drawer>
            /*<div>
                <form onSubmit={this.onContactDisplay}  className=""></form>
            <ul className="list-group">
                <li className="list-group-header">
                    <input className="form-control" type="text" placeholder="Search for someone" value={this.state.displayname} onChange={this.handleDisplayNameChange}/>
                </li>
                {this.props.sessions.map((contact, index) => {
                    return this.renderItem(contact, index)
                })}
            </ul>
            <button type="submit" className="btn btn-form btn-primary pull-right small-margin"onClick={() => this.findContact()}>Search contact</button>
            <div>{this.state.name.displayName}</div>
            </div>*/
        );
    }

    /*renderItem(session, index) {
        // TODO: don't use index as key, might break if order changes.
        return (
            <div>
            <li key={index}
                className={session.handle === this.props.openedContact.handle ? "list-group-item active" : "list-group-item"}
                onClick={((e) => this.onContactOpened(session))}>
                <span className="icon icon-user pull-left media-object"/>
                <div>
                    <strong>{session.handle}</strong>
                    <p>{this.props.handlesWithNewMessage.indexOf(session.handle) > -1 ? "New message(s)..." : "No new message"}</p>
                </div>
            </li>
            </div>
        )
    }*/
}

const drawerWidth = 250;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
});

export default withStyles(styles)(ContactList)
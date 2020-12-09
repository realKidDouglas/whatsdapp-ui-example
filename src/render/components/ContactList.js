import React, {Component} from 'react'
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Badge from '@material-ui/core/Badge';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const {ipcRenderer} = window.require('electron');

class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addContactInput: ""
        }
    }

    onContactOpened(session) {
        this.props.setOpenedContact(session)
    }

    onAddContactInputChange = event => {
        this.setState({
            addContactInput: event.target.value
        })
    }

    addContact = async (event) => {
        //TODO: Feedback if profile does not exist
        if(this.state.addContactInput !== ""){
            const newSession = await ipcRenderer.invoke('findcontact', this.state.addContactInput)
            this.props.newContact(newSession);
            this.setState({addContactInput: ""});
        }
    }

    render() {
        let { classes } = this.props;

        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{paper: classes.drawerPaper,}}
                anchor="left"
            >
                {/*<div className={classes.toolbar} /> {/*necessary for content to be below app bar. TODO: mache ich überhaupt noch ne appbar?/*}
                <Divider />*/}
                <List>
                    <ListItem key={"addContactForm"}>
                        <TextField label="DPNS Name" value={this.state.addContactInput} variant="outlined" size="small" onChange={this.onAddContactInputChange}/>
                        <ListItemSecondaryAction>
                            <Tooltip title="Add new contact">
                                <IconButton onClick={this.addContact} edge="end" aria-label="Add contact via DPNS Name">
                                    <PersonAddIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {this.props.sessions.map((session, index) => {
                        return (
                            <ListItem
                                    button
                                    selected={session.profile_name === this.props.openedContact.profile_name}
                                    key={index}
                                    onClick={((e) => this.onContactOpened(session))}>
                                <ListItemAvatar>
                                    {this.props.handlesWithNewMessage.indexOf(session.profile_name) > -1 ?
                                        <Badge color="primary" variant="dot" overlap="circle">
                                        <Avatar><PersonIcon/></Avatar>
                                        </Badge>
                                    :
                                        <Avatar><PersonIcon/></Avatar>
                                    }
                                </ListItemAvatar>
                                <ListItemText primary={session.profile_name} secondary="secondary text"/>
                            </ListItem>
                        )
                    })}
                {/*['Contact a', 'Contact b', 'Contact c', 'Contact d'].map((text, index) => (
                    <ListItem button selected={index === 1} key={text} onClick={((e) => console.log("Kontakt angeklickt!" + text))}>
                        <ListItemAvatar>
                            {index > 1 ?
                                <Badge color="primary" variant="dot" overlap="circle">
                                <Avatar><PersonIcon/></Avatar>
                                </Badge>
                            :
                                <Avatar><PersonIcon/></Avatar>
                            }
                        </ListItemAvatar>
                        <ListItemText primary={text}/>
                    </ListItem>
                        ))*/}
                </List>
            </Drawer>
        );
    }
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
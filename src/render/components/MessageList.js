import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

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
    let { classes } = this.props;

    if(this.props.messages.length > 0) {
      return (
        <div className={classes.msgList}>
          <List dense>
            {this.props.messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    message.senderHandle
                    + (message.senderHandle === this.props.loggedInUser.identity ? " (You) - " : " - ")
                    + new Date(message.timestamp).toLocaleString()}
                  secondary={message.content}/>
              </ListItem>
            ))}
          </List>
        </div>
      )
    }
    else {
      return (
        <div className={classes.msgList}>
          No contact selected or no messages for the selected contact available
        </div>
      )
    }

    /*return (
      <div className={classes.msgList}>
      <List subheader={<li />}>
        {[0, 1].map((sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.listSubheader}>{`I'm sticky ${sectionId}`}</ListSubheader>
              {[0, 1, 2].map((item) => (
                <ListItem key={`item-${sectionId}-${item}`}>
                  <ListItemText primary={`Item ${item} zg zsgf ozsgf soy7zf o8ysgho8ydg p9<szp9  wzgyudghldyubv lkydjbvl iubh vlib lvbd lkbliuhb vl nj vyrildiludnblrbn`} />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
      </div>
    )*/
  }
}

const styles = theme => ({
  msgList: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'auto',
  },
  ul: {
    padding: 0,
  },
  listSubheader: {
    backgroundColor: theme.palette.background.default,
  }
});

export default withStyles(styles)(MessageList)
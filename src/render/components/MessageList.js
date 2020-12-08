import React, { Component } from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
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
    return (
      <div className={classes.msgList}>
      <List subheader={<li />}>
        {[0, 1].map((sectionId) => (
          <li key={`section-${sectionId}`}>
            <ul className={classes.ul}>
              <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
              {[0, 1, 2].map((item) => (
                <ListItem key={`item-${sectionId}-${item}`}>
                  <ListItemText primary={`Item ${item}`} />
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
      </div>
    )

    /*if(this.props.messages.length > 0) {
      return (
        <ul className="list-group space-filling-msglist" ref={el => {this.messageListRef = el}}>
          {this.props.messages.map((message, index) =>
              this.renderItem(message, index)
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
    } */
  }

  /*renderItem(message, index) {
    return (
      <li key={index} className="list-group-item">
          <strong>{message.senderHandle + (message.senderHandle === this.props.loggedInUser.identity ? " (You)" : "")}</strong>
          <span className="pull-right grey">{new Date(message.timestamp).toLocaleString()}</span>
          <p className="selectable-text show-full-text">{message.content}</p>
      </li>
    )
  }*/
}

const styles = theme => ({
  msgList: {
    flexGrow: 1,
    flexShrink: 1,
    overflowY: 'auto',
  },
  ul: {
    padding: 0,
  }
});

export default withStyles(styles)(MessageList)
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

class SendMessageForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      msgText: ''
    }
  }

  onSubmit = e => {
    e.preventDefault()
    if(this.state.msgText !== ''){
      this.props.onSend(this.state.msgText)
      this.setState({ msgText: '' })
    }
  }

  onChange = (event) => {
    this.setState({ msgText: event.target.value })
  }

  onKeyPress = (event) => {
    if (event.charCode === 13 && !event.shiftKey) { // enter key pressed, without shift key (which would be new line)
      this.onSubmit(event)
    } 
  }

  render() { 
    let { classes } = this.props;

    return (
      <form onSubmit={this.onSubmit} noValidate autoComplete="off" className={classes.sendMsg}>
        <TextField label="Send Message" value={this.state.msgText} onChange={this.onChange} onKeyPress={this.onKeyPress} variant="filled" className={classes.txtField} multiline rowsMax="5" size="small"/>
        <IconButton aria-label="Send" type="submit">
          <SendIcon/>
        </IconButton>
      </form>
    )
  }
}

const styles = theme => ({
  sendMsg: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  txtField: {
    flexGrow: 1,
    flexShrink: 0,
    marginRight: theme.spacing(1),
  }
});

export default withStyles(styles)(SendMessageForm);

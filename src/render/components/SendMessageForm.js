import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

class SendMessageForm extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
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
    let { classes } = this.props;

    return (
      <form noValidate autoComplete="off" className={classes.sendMsg}>
        <TextField label="Send Message" variant="filled" className={classes.txtField} multiline/>
        <IconButton aria-label="Send">
          <SendIcon/>
        </IconButton>
      </form>
      /*<form onSubmit={this.onSubmit} className={classes.sendMsg}>
          <input type="text" className="form-control small-margin" placeholder="Message..." onChange={this.onChange} value={this.state.text}/>
          <button type="submit" className="btn btn-form btn-primary pull-right small-margin">Send</button>
      </form>*/
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

import React from 'react'
const {ipcRenderer} = window.require('electron');
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField  from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';



class LoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: '',
      identity: '',
      displayname: '',
    }
  }

  handleMnemonicChange = event => {
    this.setState({
      mnemonic: event.target.value
    })
  }

  handleIdentityChange = event => {
    this.setState({
      identity: event.target.value
    })
  }

  handleDisplayNameChange = event => {
    this.setState({
      displayname: event.target.value
    })
  }

  onLogin = e => {
    e.preventDefault()
    
    this.loginUser();
  }

  async loginUser() {
    // this is needed because immediate connect will occur
    // before the connect handler is bound on the node side
    //await new Promise(r => setTimeout(r, 1000))

    let options = {
      // Test user data:
      // mnemonic: "permit crime brush cross space axis near uncle crush embark hill apology",
      // identity: "9hnTvxpxJKPefK7HKmnyBBYMYr3B9jDw94UwDJb1F7X2",
      // displayname: "robsenwhats"
      mnemonic: this.state.mnemonic,
      identity: this.state.identity,
      displayname: this.state.displayname
    }
    let user = await ipcRenderer.invoke('connect', options)
    if (user) {
      this.props.setLoggedInUser(user)
    } else {
      console.error("Log in of user failed")
    }
    
  }


  render() {

    const { classes } = this.props;
    return (
         
      <main className={classes.main}>
       <CssBaseline/>
       <Paper className={classes.paper}>
        <form onSubmit={this.onLogin}  className="">
        
          <Typography component="h1" variant="h5">
          Log in!
          </Typography>
          <FormControl required fullWidth margin='normal'>
            <TextField id="standard-adornment-amount" label="enter your mnemonic" value={this.state.mnemonic} onChange={this.handleMnemonicChange} />
            </FormControl>
            <FormControl required fullWidth margin='normal'>
            <TextField id="standard-basic" label="enter your identity" value={this.state.identity} onChange={this.handleIdentityChange} />
            </FormControl>
            <FormControl required fullWidth margin='normal'>
            <TextField id="standard-basic" label="enter your displayname" value={this.state.displayname} onChange={this.handleDisplayNameChange} />
            </FormControl>
         
          <Button
              type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Log in</Button>
        </form>
        </Paper>
        </main>
    );
  }
}

export default withStyles(styles)(LoginForm); 
import React from 'react'
const {ipcRenderer} = window.require('electron');
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

class LoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mnemonic: '',
      displayName: '',
      dpnsName: '',
      password: '',
      showPassword: false,
      loginType: "login", //TODO: default value based on whether a storage is existing or not
      loginTypeInfo: "Log in with the existing WhatsDapp profile on this device!",
      provideIdentityAddr: false,
      identityAddr: ''
    }
  }

  onMnemonicChange = event => {
    this.setState({mnemonic: event.target.value})
  }

  onDpnsNameChange = event => {
    this.setState({dpnsName: event.target.value});
  }

  onDisplayNameChange = event => {
    this.setState({displayName: event.target.value})
  }

  onLoginTypeChange = event => {
    const value = event.target.value;
    this.setState({loginType: value});
    if (value === "login")
      this.setState({loginTypeInfo: "Log in with the existing WhatsDapp profile on this device!"});
    else
      this.setState({loginTypeInfo: "Create a new WhatsDapp profile on this device!"});
  }

  onPasswordChange = event => {
    this.setState({password: event.target.value});
  }

  togglePasswordVisibility = event => {
    this.setState({showPassword: !this.state.showPassword});
  }

  onProvideIdentityChange = event => {
    this.setState({provideIdentityAddr: event.target.checked})
  }

  onIdentityAddrChange = event => {
    this.setState({identityAddr: event.target.value})
  }

  onLogin = e => {
    e.preventDefault()
    this.loginUser();
  }

  onRegister = e => {
    e.preventDefault()
    this.loginUser();
  }

  async loginUser() {
    //TODO: rename identity in options => identityAddr/dashIdentity? 
    let options = {
      mnemonic: (this.state.mnemonic === "" ? null : this.state.mnemonic),
      identity: (this.state.identityAddr === "" ? null : this.state.identityAddr),
      dpnsName: (this.state.dpnsName === "" ? null : this.state.dpnsName),
      displayname: (this.state.displayName === "" ? this.state.dpnsName : this.state.displayName),
      password: (this.state.password === "" ? null : this.state.password)
    }
    let user = await ipcRenderer.invoke('connect', options)
    if (user) {
      this.props.setLoggedInUser(user)
    } else {
      console.error("GUI: Log in of user failed")
    }
    
  }


  render() {

    const { classes } = this.props;
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" className={classes.welcomeHeader}>Welcome to WhatsDapp Test-GUI!</Typography>
        <Paper elevation={2} className={classes.loginPaper}>
          <FormControl component="fieldset">
            <RadioGroup value={this.state.loginType} onChange={this.onLoginTypeChange} className={classes.loginTypeRadios} aria-label="Login or Registration">
              <FormControlLabel value="login" control={<Radio color="primary" />} label="Login" /> {/*TODO: Automatic disable if no account exists in storage*/}
              <FormControlLabel value="register" control={<Radio color="primary"/>} label="Registration" />
            </RadioGroup>
            <Typography variant="body2">{this.state.loginTypeInfo}</Typography>
          </FormControl>
        </Paper>
        <Paper hidden={this.state.loginType !== "login"} elevation={2} className={classes.loginPaper}>
          <form spellCheck="false" noValidate autoComplete="off" onSubmit={this.onLogin}>
            <FormControl size="small" variant="filled" fullWidth className={classes.textField} >
              <InputLabel htmlFor="login-password">Password</InputLabel>
              <FilledInput
                id="login-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.onPasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.togglePasswordVisibility}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button fullWidth type="submit" variant="contained" color="primary" endIcon={<LockOpenIcon />}>
              Log in
            </Button>
          </form>
        </Paper>
        <Paper hidden={this.state.loginType !== "register"} elevation={2} className={classes.loginPaper}>
          <form spellCheck="false" noValidate autoComplete="off" onSubmit={this.onRegister}>
            <TextField
              label="Mnemonic"
              helperText="You need an existing wallet with some Dash on it. The mnemonic is used to create and fund an identity. CAUTION: This is a probably unsecure application for test environments. Never give a real mnemonic to some random, unverified application from the internet!"
              value={this.state.mnemonic} onChange={this.onMnemonicChange} required className={classes.textField} variant="filled" size="small" fullWidth />
            <FormControlLabel
              control={
                <Checkbox checked={this.state.provideIdentityAddr} onChange={this.onProvideIdentityChange} color="primary"/>
              }
              label="Custom Identity Address"
              className={this.state.provideIdentityAddr ? "" : classes.textField}
            />
            <TextField
              label="Identity Address"
              helperText="If you want to create a profile for a specific identity address, you can put it here. Otherwise a new identity will be created."
              className={classes.textField + (this.state.provideIdentityAddr ? "" : " " + classes.hide)}
              value={this.state.identityAddr} onChange={this.onIdentityAddrChange} variant="filled" size="small" fullWidth />
            <TextField
              label="Username"
              helperText="Your unique username, with which your contacts can find you."
              value={this.state.dpnsName} onChange={this.onDpnsNameChange} required className={classes.textField} variant="filled" size="small" fullWidth />
            <TextField
              label="Display Name"
              helperText="If you want to provide a normal name to help others recognise you, this is your chance! "
              value={this.state.displayName} onChange={this.onDisplayNameChange} className={classes.textField} variant="filled" size="small" fullWidth />
            <FormControl required size="small" variant="filled" fullWidth className={classes.textField} >
              <InputLabel htmlFor="login-password">Password</InputLabel>
              <FilledInput
                spellCheck="false"
                id="register-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.onPasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.togglePasswordVisibility}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="register-password">The password is used to encrypt your local chat storage.</FormHelperText>
            </FormControl>
            <Button disabled={this.state.mnemonic === '' /*|| this.state.dpnsName === '' || this.state.password === ''*/}
              fullWidth className={classes.submitButton} type="submit" variant="contained" color="primary" endIcon={<BackupIcon />}>
              Create Profile
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }
}

const styles = theme => ({
  loginTypeRadios: {
    display: "block",
  },
  loginPaper: {
    margin: "auto",
    marginBottom: "25px",
    padding: "25px 40px 32px 40px"
  },
  welcomeHeader: {
    marginLeft: "40px",
    marginTop: "30px",
    marginBottom: "20px",
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  hide: {
    display: 'none'
  }
});

export default withStyles(styles)(LoginForm); 
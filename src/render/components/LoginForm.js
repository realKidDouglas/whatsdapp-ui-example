import React from 'react'
const {ipcRenderer} = window.require('electron');

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
    console.log(options)
    let user = await ipcRenderer.invoke('connect', options)
    if (user) {
      this.props.setLoggedInUser(user)
    } else {
      console.error("Log in of user failed")
    }
  }

  render() {
    return (
      <div className="login-container padded">
        <form onSubmit={this.onLogin}  className="">
          <h1 className="text-center">Log in!</h1>
          <div className="form-group">
            <label>Wallet mnemonic</label>
            <input type="text" className="form-control" placeholder="enter your mnemonic" value={this.state.mnemonic} onChange={this.handleMnemonicChange} />
          </div>
          <div className="form-group">
            <label>Identity</label>
            <input type="text" className="form-control" placeholder="enter your identity" value={this.state.identity} onChange={this.handleIdentityChange} />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" placeholder="enter your displayname" value={this.state.displayname} onChange={this.handleDisplayNameChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-large btn-primary">Log in</button>
          </div>
        </form>
      </div>
    )
  }
}

export default LoginForm
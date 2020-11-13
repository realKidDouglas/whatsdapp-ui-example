import React, { Component } from 'react';
import Chat from './Chat';
import LoginForm from './LoginForm';
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedInUser: undefined
    }
  }

  setLoggedInUser = user => {
    this.setState({loggedInUser: user})
  }

  //only for testing until login component is finished
  componentDidMount() {
    this.loginTestUser()
  }
  async loginTestUser() {
    let user = await ipcRenderer.invoke('loginUser', {handle: "testUser"})
    if (user) {
      this.setLoggedInUser(user)
    }
    else {
      console.error("Log in of test user failed")
    }
  }


  render() {
    if (this.state.loggedInUser) {
      return (
        <div className="window-content">
          <Chat loggedInUser={this.state.loggedInUser}/>
        </div>
      )
    }
    else {
      return (
        <div className="window-content">
          <LoginForm loggedInUser={this.state.loggedInUser} setLoggedInUser={this.setLoggedInUser}/>
        </div>
      )
    }
  }
}

export default App;

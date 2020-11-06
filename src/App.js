import React, { Component } from 'react';
import Chat from './Chat'
import LoginForm from './LoginForm'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedInUser: null
    }
  }

  setLoggedInUser = user => {
    this.setState({loggedInUser: user})
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

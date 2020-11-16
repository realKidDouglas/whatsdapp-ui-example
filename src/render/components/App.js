import React, {Component} from 'react';
import Chat from './Chat';
import LoginForm from './LoginForm';

const {ipcRenderer} = window.require('electron');

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
    


    render() {
        if (this.state.loggedInUser) {
            return (
                <div className="window-content">
                    <Chat loggedInUser={this.state.loggedInUser}/>
                </div>
            )
        } else {
            return (
                <div className="window-content">
                    <LoginForm loggedInUser={this.state.loggedInUser} setLoggedInUser={this.setLoggedInUser}/>
                </div>
            )
        }
    }
}

export default App;

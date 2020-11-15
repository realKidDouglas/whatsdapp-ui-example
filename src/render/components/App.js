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
    componentDidMount() {
        this.loginTestUser()
    }

    async loginTestUser() {
        // this is needed because immediate connect will occur
        // before the connect handler is bound on the node side
        await new Promise(r => setTimeout(r, 2000))
        let options = {
            mnemonic: "permit crime brush cross space axis near uncle crush embark hill apology",
            identity: "9hnTvxpxJKPefK7HKmnyBBYMYr3B9jDw94UwDJb1F7X2",
            displayname: "robsenwhats"
        }
        let user = await ipcRenderer.invoke('connect', options)
        console.log('user!', user)
        if (user) {
            this.setLoggedInUser(user)
        } else {
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

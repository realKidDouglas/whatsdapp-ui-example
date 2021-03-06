import React, {Component} from 'react';
import Chat from './Chat';
import LoginForm from './LoginForm';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedInUser: undefined
        }
    }

    setLoggedInUser = user => {
        this.setState({loggedInUser: user})
        console.log('GUI: Log in!');
        console.log(user);
    }

    render() {
        if (this.state.loggedInUser) {
            return (
                <React.Fragment>
                    <CssBaseline/>
                    <Chat loggedInUser={this.state.loggedInUser}/>
                </React.Fragment>
            )
        } else {
            return (
                <LoginForm setLoggedInUser={this.setLoggedInUser}/>
            )
        }
    }
}

export default App;

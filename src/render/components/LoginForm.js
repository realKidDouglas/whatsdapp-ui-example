import React from 'react'

class LoginForm extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        identity: '', 
        identity1: '',
        identityConfirmation: null,
        signinError: ''
      }
      this.clickHandler = this.clickHandler.bind(this)
    }

    onSubmit = e => {
        e.preventDefault()
        
        this.props.setLoggedInUser(this.state.identity) // nur als Beispiel wie man das Userobjekt zu App hochreicht beim Submit der Form
    }

    onChange = e => {
      this.setState({ identity: e.target.value })
      if (this.props.onChange) {
        this.props.onChange()
      }
    }

    clickHandler() {

      this.setState({

        identity1: 'must show up here the generated mnemonic'
      })
    }
  
    render() {
      return (
        
        
        <form onSubmit={(e) => this.onSubmit(e)}  >
  
          <button type="submit" className="btn btn-large btn-primary" >Log in</button>
          <input type="password" className="form-control small-margin" placeholder="enter your mnemonic" onChange={this.onChange} value={this.state.identity}/>


            <div>
              <button onClick={ () => this.clickHandler()} type="submit" className="btn btn-primary">or create one!</button>
              <div>{this.state.identity1}</div>
              </div>
          
          
        </form>
      )
    }
  }
  
  export default LoginForm
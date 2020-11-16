import React from 'react'
const {ipcRenderer} = window.require('electron');

class LoginForm extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
         
        identity1: '',
        signinError: '',
        loggedInUser: undefined,
        mnemonic: '',
        identity: '',
        displayname: '',
      }
      

      this.clickHandler = this.clickHandler.bind(this)
    }

    handleMnemonicChange = event => {
      this.setState({

       mnemonic: event.target.value
     } )
      // changing mnemonic value
     }


      handleIdentityChange = event => {
      this.setState({
      
        identity: event.target.value
      })
      // changing identity value
     }

     handleDisplayNameChange = event => {
      this.setState({
      
        displayname: event.target.value
      })
      // changing displayname value
     }

    
    onSubmit = e => {
      
      e.preventDefault()
      
      this.loginTestUser()
    
       // nur als Beispiel wie man das Userobjekt zu App hochreicht beim Submit der Form
  }
   


  async loginTestUser() {
      // this is needed because immediate connect will occur
      // before the connect handler is bound on the node side
      await new Promise(r => setTimeout(r, 1000))
      let options = {
          mnemonic: "permit crime brush cross space axis near uncle crush embark hill apology",
          identity: "9hnTvxpxJKPefK7HKmnyBBYMYr3B9jDw94UwDJb1F7X2",
          displayname: "robsenwhats"
      }
      let user = await ipcRenderer.invoke('connect', options)
      console.log('user!', user)
      if (user) {
        this.props.setLoggedInUser(this.state.mnemonic)
        this.props.setLoggedInUser(this.state.identity)
        this.props.setLoggedInUser(this.state.displayname)
        this.setLoggedInUser(user)
        
      } else {
          console.error("Log in of test user failed")
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
          <div>
          <input type="text" className="form-control small-margin" placeholder="enter your mnemonic" value={this.state.mnemonic} onChange={this.handleMnemonicChange} />
          </div>
          <div>
          <input type="text" className="form-control small-margin" placeholder="enter your identity" value={this.state.identity} onChange={this.handleIdentityChange} />
          </div>
          <div>
          <input type="text" className="form-control small-margin" placeholder="enter your displayname" value={this.state.displayname} onChange={this.handleDisplayNameChange} />
          </div>

            <div>
              <button onClick={ () => this.clickHandler()} type="submit" className="btn btn-primary">or create one!</button>
              <div>{this.state.identity1}</div>
              </div>
          
          
        </form>
      )
    }
  }
  
  export default LoginForm
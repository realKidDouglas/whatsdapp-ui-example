import React from 'react'

class LoginForm extends React.Component {

    constructor(props) {
      super(props)
      this.state = {

      }
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.setLoggedInUser("testUser") // nur als Beispiel wie man das Userobjekt zu App hochreicht beim Submit der Form
    }
  
    render() {
      return (
        <form onSubmit={this.onSubmit}>
          <button type="submit" className="btn btn-form">Log in</button>
        </form>
      )
    }
  }
  
  export default LoginForm
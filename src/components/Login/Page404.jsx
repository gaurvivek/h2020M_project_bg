import React, { Component } from "react";
import { Button, FormGroup, FormControl, InputLabel, TextField, Link as MaterialLink } from '@material-ui/core';
import {Link } from "react-router-dom";

import "assets/css/login.css";
import logo from "assets/img/logo.png";
// import { Button, FormGroup, FormControl, InputLabel } from "react-bootstrap";
// import "./Login.css";

export default class Page404 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",      
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
    const stylebtn={color: '#fff !important'};

    return (
      <div className="login-cover">
        <div className="logo-content">
          <img src={logo} alt="logo"/>
        </div>
        <div className="green-header">Forgot Password</div>
        <div className="login-content">
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                {/* <InputLabel>Email Address</InputLabel> */}
                <TextField  label="Email Address" type="email" name="name" value="" data-validators="isRequired,isAlpha" onChange={this.handleChange}/>
              </FormGroup>

              {/* <FormGroup controlId="password" bsSize="large">                
                <TextField label="Password" type="password"  name="name" value="" data-validators="isRequired,isAlpha" onChange={this.handleChange}/> 
              </FormGroup> */}
              <div>
                <Button
                  color="primary"
                  block
                  bsSize="large"
                  disabled={!this.validateForm()}
                  type="submit"
                >
                  Login
                </Button>
                <MaterialLink
                    href="/login"
                    color="secondary"
                    className="MuiButton-root back-btn"
                    style={stylebtn}
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="button"
                    >
                    Back                    
                </MaterialLink>                
              </div>
              <div className="signup-cover">
                  <Link to="/signup/">
                    <a href="/signup/">Signup</a>                    
                  </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

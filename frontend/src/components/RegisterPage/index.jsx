import React, { Component } from "react";
import "./styles.css";
import { BrowserRouter as Router, Redirect } from "react-router-dom";


let USER_ALREADY_EXISTS_MESSAGE = "this user already exists";
let PASSWORDS_NOT_EQUAL_MESSAGE = "passwords are not equal";
let EMPTY_FIELD_ERROR_MESSAGE = "fill in all the fields";
let SERVER_ERROR_MESSAGE = "server error";

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      errorMessage: "",
    };
  }

  handleRegister() {
    if (this.username.value === "" || this.password.value === "" || this.repeatPassword.value === "") {
      this.setState({ errorMessage: EMPTY_FIELD_ERROR_MESSAGE });
      return;
    }

    if (this.password.value !== this.repeatPassword.value)
    {
        this.setState({errorMessage: PASSWORDS_NOT_EQUAL_MESSAGE});
        return;
    }

    this.username.disabled = true;
    this.password.disabled = true;
    this.repeatPassword.disabled = true;

    fetch("http://127.0.0.1:5000/register/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        username: this.username.value,
        password: this.password.value,
      }),
    }).then((res) => {
      if (res.status === 409) {
        this.setState({
          errorMessage: USER_ALREADY_EXISTS_MESSAGE,
        });
      } else if (res.status === 201) {
        this.setState({ redirect: true });
        return
      } else {
        this.setState({
          errorMessage: SERVER_ERROR_MESSAGE,
        });
      }

      this.username.disabled = false;
      this.password.disabled = false;
      this.repeatPassword.disabled = false;
    });
  }


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.username.value}></Redirect>;
    }
    return (
      <Router>
        <div className="registerPage">
          <div className="registerInput">
            <input
              ref={(username) => (this.username = username)}
              placeholder="username"
            ></input>
            <input
              ref={(password) => (this.password = password)}
              type="password"
              placeholder="password"
            ></input>
            <input
              ref={(repeatPassword) => (this.repeatPassword = repeatPassword)}
              type="password"
              placeholder="repeat password"
            ></input>
            {this.state.errorMessage !== "" ? (
              <label className="errorMessage">{this.state.errorMessage}</label>
            ) : (
              ""
            )}
            <button onClick={this.handleRegister.bind(this)}>register</button>
          </div>
        </div>
      </Router>
    );
  }
}

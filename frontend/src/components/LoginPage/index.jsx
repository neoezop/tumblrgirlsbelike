import React, { Component } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import "./styles.css";

let EMPTY_FIELD_ERROR_MESSAGE = "fill in all the fields";
let WRONG_DATA_MESSAGE = "wrong username or password";
let SERVER_ERROR_MESSAGE = "server error";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      errorMessage: "",
    };
  }

  handleLogin() {
    if (this.username.value === "" || this.password.value === "") {
      this.setState({ errorMessage: EMPTY_FIELD_ERROR_MESSAGE });
      return;
    }

    this.username.disabled = true;
    this.password.disabled = true;

    fetch("http://127.0.0.1:5000/login/", {
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
      if (res.status === 401) {
        this.setState({
          errorMessage: WRONG_DATA_MESSAGE,
        });
      } else if (res.status === 200) {
        this.setState({ redirect: true });
        return
      } else {
        this.setState({
          errorMessage: SERVER_ERROR_MESSAGE,
        });
      }

      this.username.disabled = false;
      this.password.disabled = false;
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.username.value}></Redirect>;
    }
    return (
      <Router>
        <div className="loginPage">
          <div className="loginInput">
            <input
              ref={(username) => (this.username = username)}
              placeholder="username"
            ></input>
            <input
              ref={(password) => (this.password = password)}
              type="password"
              placeholder="password"
            ></input>
            {this.state.errorMessage !== "" ? (
              <label className="errorMessage">{this.state.errorMessage}</label>
            ) : (
              ""
            )}
            <label>Have no account yet?</label>
            <a href="/register">Register</a>
            <br></br>
            <button onClick={this.handleLogin.bind(this)}>login</button>
          </div>
        </div>
      </Router>
    );
  }
}

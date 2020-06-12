import React, { Component } from "react";
import "./styles.css";

let undefined_status = "%undefinded%";

export default class AuthStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status_checked: false,
      logged_in: false,
      username: undefined_status,
    };
  }

  componentDidMount() {
    this.updateAuthenticationStatus();
  }

  updateAuthenticationStatus()
  {
    fetch("http://127.0.0.1:5000/status/", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          status_checked: true,
          logged_in: data["logged_in"],
          username: data["username"] ? data["username"] : undefined_status,
        });
        return this.state.username;
      })
      .then(username => {
        this.props.onAuthUpdate(username !== undefined_status? username : null);
        console.log(username)
      });

  }

  handleLogout()
  {
    fetch('http://127.0.0.1:5000/logout', {
      method: "GET",
      credentials: "include"
    })
    .then(res => {
      this.setState({
        logged_in: false,
        username: undefined_status
      });
    })
    .then(this.props.onAuthUpdate(null));
  }

  render() {
    return (
      <div>
        {this.state.status_checked ? (
          this.state.logged_in ? (
            <div>
              <label>logged as </label>
          <a href={`/${this.state.username}`}>{this.state.username}</a>
          <br/>
          (

            <button className="logout" onClick={this.handleLogout.bind(this)}>logout</button>
          )
            </div>
          ) : (
            <a href="/login">log in</a>
          )
        ) : (
          <></>
        )}
      </div>
    );
  }
}

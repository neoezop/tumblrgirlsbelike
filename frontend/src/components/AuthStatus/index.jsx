import React, { Component } from "react";
import "./styles.css";

let undefined_status = "%undefinded%"

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
      });
  }

  render() {
    return (
      <div>
        {this.state.status_checked ? (
          this.state.logged_in ? (
            <label>logged as {this.state.username}</label>
          ) : (
            <label>not logged in</label>
          )
        ) : (
          <></>
        )}
      </div>
    );
  }
}

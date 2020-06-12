import React from "react";
import "./styles.css";
import "flexboxgrid2";
import { Switch, Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import Profile from "../Profile";
import LoginPage from "../LoginPage";
import RegisterPage from "../RegisterPage";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <div className="row center-xs">
              <div className="col-lg-8 col-md-10">
                <Switch>
                  <Route path="/login" component={LoginPage}></Route>
                  <Route path="/register" component={RegisterPage}></Route>
                  <Route path="/:id" component={Profile}></Route>
                  <Redirect from='/' to='/admin'></Redirect>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

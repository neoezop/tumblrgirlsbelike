import React from "react";
import "./styles.css";
import "flexboxgrid2";
import { Switch, Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import Profile from "../Profile";
import LoginPage from "../LoginPage";
import RegisterPage from "../RegisterPage";
import AuthStatus from "../AuthStatus";

export default class App extends React.Component {

  componentDidUpdate()
  {
    console.log("updated!!");
  }


  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <div className="row center-xs">
              <div className="col-lg-8 col-md-10">
                <AuthStatus></AuthStatus>
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

import React from "react";
import "./styles.css";
import "flexboxgrid2";
import Feed from "../Feed";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row center-xs">
            <div className="col-xs-12">
              <Feed/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

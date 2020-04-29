import React from "react";
import "./styles.css";
import "flexboxgrid2";
import ImageFeed from "../ImageFeed";
import ProfileHeader from "../ProfileHeader";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ProfileHeader username="%username%"/>
        <div class="container">
          <div class="row center-xs">
            <div class="col-xs-12">
              <ImageFeed/>
            </div>
          </div>
        </div>
      </div>  
    );
  }
}

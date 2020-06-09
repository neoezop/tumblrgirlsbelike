import React, { Component } from 'react';
import './styles.css'
import PostCreator from '../PostCreator'

    class ProfileHeader extends Component {
      constructor(props) {
        super(props);
        this.state = {
          isPostCreatorOpened: false,
        };
      }

      switchPostCreatorState = () => {
        this.setState({
            isPostCreatorOpened: !this.state.isPostCreatorOpened
        })
      }

      render() {
        return (
          <div className="header">
            <h1>{this.props.username}</h1>
            {this.state.isPostCreatorOpened ? (
              <PostCreator onPostLoad={this.forceUpdate.bind(this)} />
            ) : (
              <button className="upload" onClick={this.switchPostCreatorState}>upload</button>
            )}
          </div>
        );
      }
    }
    
    export default ProfileHeader;
import React, { Component } from 'react';
import './styles.css';
import {Clear} from '@material-ui/icons'

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDeleted: false
        }
    }
    

    deletePost= () => {
      this.setState({isDeleted: true})
      fetch(`http://127.0.0.1:5000/delete/${this.props.id}/`, {
        method: "DELETE",
        credentials: "include",
      });
    }


    render() {
      if (this.state.isDeleted) return <div></div>;
        return (
          <div className="post">
            {this.props.canDelete ? (
              <button
                className="delete"
                title="Delete post"
                onClick={this.deletePost.bind(this)}
              >
                <Clear className="clearIcon" fontSize="large"/>
              </button>
            ) : null}

            <img src={`data:image/jpeg;base64,${this.props.image}`} alt=""/>
            <div className="description">
              <p>{this.props.description}</p>
            </div>
          </div>
        );
    }
}

export default Post;
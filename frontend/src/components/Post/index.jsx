import React, { Component } from 'react';
import './styles.css';

class Post extends Component {
    render() {
        return (
            <div className="post">
                <img src={this.props.image} alt=""/>
                <div className="description">
                    <p>{this.props.description}</p>
                </div>
            </div>
        );
    }
}

export default Post;
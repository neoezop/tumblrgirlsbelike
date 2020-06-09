import React, { Component } from "react";
import "./styles.css";
import Post from "../Post";
import ProfileHeader from '../ProfileHeader'

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postIds: [],
      username: "%undefined%"
    };
  }

  componentDidMount() {
    this.fetchUserData()
    .then(res => this.loadPosts());
  }



  loadPosts() {
    this.state.postIds.forEach((id) =>
    {
      fetch(`http://127.0.0.1:5000/post/${id}`)
      .then(res => res.json())
      .then(data => 
        {
          let date = new Date(data['datetime']);
          this.setState({
            posts: [...this.state.posts, {description: data['text'], image: data['fileData'], datetime: date, id: id}]
          })
        });
    });
  }

  
  fetchUserData() {
    return fetch("http://127.0.0.1:5000/admin/")
    .then(res => res.json())
    .then(data =>  
      this.setState({
        username: data['username'],
        postIds : data['postIds']
      })
    );
  }

  
  getPostsToDisplay()
  {
    let resultPosts = [];
    let sortedByDatePosts = this.state.posts.sort(
      (a, b) => b.datetime.getTime() - a.datetime.getTime()
    );

    for (let i = 0; i < this.state.posts.length; i++) {
      if (this.state.postIds[i] === sortedByDatePosts[i].id)
        resultPosts.push(sortedByDatePosts[i]);
      else break; 
    }
    return resultPosts;
  }

  render() {
    return (
      <div className="feed">
        <ProfileHeader username={this.state.username}/>
        {this.getPostsToDisplay().map((post) => (
          <Post image={post.image} description={post.description} datetime={post.datetime} id={post.id} key={post.id}/>
        ))}
      </div>
    );
  }
}

export default Feed;
  
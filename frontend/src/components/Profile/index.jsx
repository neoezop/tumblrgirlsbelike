import React, { Component } from "react";
import "./styles.css";
import Post from "../Post";
import ProfileHeader from "../ProfileHeader";
import AuthStatus from '../AuthStatus'

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      posts: [],
      postIds: [],
      clientSidePosts: [],
      username: this.props.match.params.id,
      pageExists: false,
    };
  }

  componentDidMount() {
    this.fetchUserData().then((res) => this.loadPosts());
  }

  loadPosts() {
    this.state.postIds.forEach((id) => {
      fetch(`http://127.0.0.1:5000/post/${id}`)
        .then((res) => res.json())
        .then((data) => {
          let date = new Date(data["datetime"]);
          this.addPost({
            description: data["text"],
            image: data["fileData"],
            datetime: date,
            id: id,
          });
        });
    });
  }

  fetchUserData() {
    return fetch(`http://127.0.0.1:5000/${this.state.username}/`)
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          username: data["username"],
          postIds: data["postIds"],
          pageExists: true
        })
      );
  }

  getPostsToDisplay() {
    let postsFromServer = [];
    let sortedByDatePosts = this.sortPostsByDate(this.state.posts);


    for (let i = 0; i < this.state.posts.length; i++) {
      if (this.state.postIds[i] === sortedByDatePosts[i].id)
      postsFromServer.push(sortedByDatePosts[i]);
      else break;
    }
    
    let clientSideSortedPosts = this.sortPostsByDate(this.state.clientSidePosts);

    return  clientSideSortedPosts.concat(postsFromServer);
  }

  sortPostsByDate(posts){
    return posts.sort(
      (a, b) => b.datetime.getTime() - a.datetime.getTime()
    );
  }

  addPost(post) {
    if (!this.state.postIds.includes(post.id)) {
      this.setState({
        clientSidePosts: [...this.state.clientSidePosts, post],
      });
    } else {
      this.setState({
        posts: [...this.state.posts, post],
      });
    }
  }

  updateCurrentUser(currentUser)
  {
    this.setState({
      currentUser: currentUser
    })
  }

  render() {
    if (!this.state.pageExists) return "page does not exist";

    return (
      <div className="feed">
        
        <AuthStatus onAuthUpdate={this.updateCurrentUser.bind(this)}></AuthStatus>
        <ProfileHeader
          username={this.state.username}
          onPostUpload={this.addPost.bind(this)}
          currentUser={this.state.currentUser}
        />
        {
        }
        {this.getPostsToDisplay().map((post) => (
          <Post
            canDelete={this.state.currentUser === this.state.username}
            image={post.image}
            description={post.description}
            datetime={post.datetime}
            id={post.id}
            key={post.id}
          />
        ))}
      </div>
    );
  }
}
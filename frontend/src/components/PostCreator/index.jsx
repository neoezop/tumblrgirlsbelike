import React, { Component } from "react";
import "./styles.css";

export default class PostCreator extends Component {
  constructor(props) {
    super(props);
    this.preview = React.createRef();
    this.state = {
      image: "",
    };
  }

  triggerChooseFile() {
    this.input.click();
  }

  readFileDataAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  }

  handleFile(event) {
    if (event.target.value.length === 0) {
      console.log("no file choosen");
      return;
    }
    let file = event.target.files[0];
    fetch("http://127.0.0.1:5000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      credentials: "include",
      body: JSON.stringify({
        username: "admin",
        password: "admin",
      }),
    })
      .then((res) => this.readFileDataAsBase64(file))
      .then((data) => {
        //preview image
        this.preview.current.src = data;
        return data;
      })
      .then((data) => {
        return data.split(/,(.+)/)[1];
      })
      .then((data) =>
        fetch("http://127.0.0.1:5000/create/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            text: this.description.value,
            imageData: data,
          }),
        })
      )
      .then((res) => this.props.onPostLoad());
  }

  render() {
    return (
      <div className="postCreator">
        {true ? (
          <button
            className="selector"
            onClick={this.triggerChooseFile.bind(this)}
          >
            select image
          </button>
        ) : (
          <img
            className="preview"
            ref={this.preview}
            src={this.state.image}
            alt=""
          ></img>
        )}
        <input
          ref={(input) => (this.input = input)}
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => this.handleFile(e)}
        ></input>

        <input
          className="create-description"
          placeholder="Description..."
          maxLength="140"
          ref={(description) => (this.description = description)}
        />
      </div>
    );
  }
}

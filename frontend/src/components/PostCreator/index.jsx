import React, { Component } from "react";
import "./styles.css";

export default class PostCreator extends Component {
  constructor(props) {
    super(props);
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
     this.readFileDataAsBase64(file)
      .then((data) => {
        this.setState({
          image: data,
        });
      });
  }

  handleUpload() {
    let data = this.state.image.split(/,(.+)/)[1];

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
    });
    this.props.onPostUpload({description: this.description.value, image: data, datetime: new Date(), id: (+new Date).toString(36)})
    this.handleClose();
  }

  clearPreviewImage() {
    this.setState({
      image: "",
    });
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    return (
      <div className="postCreator">
        <div className="postElements">
          {this.state.image === "" ? (
            <button
              className="selector"
              onClick={this.triggerChooseFile.bind(this)}
            >
              select image
            </button>
          ) : (
            <img className="previewImage" src={this.state.image} alt=""></img>
          )}

          <textarea
            className="create-description"
            placeholder="Description..."
            maxLength="140"
            ref={(description) => (this.description = description)}
          />
        </div>

        <div className="buttons">
          {this.state.image !== "" ? (
            <button className="upload" onClick={this.handleUpload.bind(this)}>upload</button>
          ) : (
            <></>
          )}

          <button className="cancel" onClick={this.handleClose.bind(this)}>
            cancel
          </button>
        </div>

        <input
          ref={(input) => (this.input = input)}
          type="file"
          accept="image/jpeg, image/png"
          onChange={(e) => this.handleFile(e)}
        ></input>
      </div>
    );
  }
}

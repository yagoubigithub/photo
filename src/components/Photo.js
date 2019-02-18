import React, { Component } from "react";
import { Replay, Save } from "@material-ui/icons";
import "./style.css";
import CircularProgress from "@material-ui/core/CircularProgress";

class Photo extends Component {
  state = {
    load: false
  };

  componentDidMount = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: { ideal: this.props.width },
          height: { ideal: this.props.height },
          facingMode: this.props.front ? "user" : "environment"
        }
      })
      .then(this.success)
      .catch(this.error);
    this.setState({
      camWidth: null,
      camHeight: null
    });
  };

  success = stream => {
    const video = this.refs.cam;
    video.srcObject = stream;
    video.play();

    video.addEventListener("playing", () => {
      this.setState({
        camWidth: video.videoWidth,
        camHeight: video.videoHeight
      });
    });
  };

  error = err => {
    console.log(err);
  };

  capture = () => {
    const canvas = this.refs.canvas;
    const video = this.refs.cam;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    const newImage = document.getElementById("new-image");
    newImage.style.display = "inline";
    newImage.style.backgroundImage = `url("${canvas.toDataURL("image/png")}")`;
    newImage.addEventListener("click", this.showImage);

    if (this.props.linkToSave) {
      //send
      document.getElementById("save").addEventListener("click", () => {
        if(!this.state.load){
          const http = new XMLHttpRequest();
          const url = this.props.linkToSave;
          const params = "src=" + canvas.toDataURL("image/png");
          http.open("POST", url, true);
          this.setState({ load: true });
  
         
          //Send the proper header information along with the request
          http.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
  
          http.onreadystatechange = () => {
            //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
              this.setState({ load: false });
            }
          };
          http.send(params);
        }
      
      });
    }
    if (this.props.capture) {
      this.props.capture(canvas.toDataURL("image/png"));
    }
  };

  showImage = () => {
    if(!this.state.load){
      const imageContainer = document.getElementById("new-image");
      const replay = document.getElementById("replay");
      const save = document.getElementById("save");
  
      replay.style.display = "flex";
      save.style.display = "flex";
  
      replay.style.transition = "opacity 1s";
      save.style.transition = "opacity 1s";
  
      replay.style.opacity = 1;
      save.style.opacity = 1;
  
      imageContainer.style.transition = "all 1s";
      imageContainer.style.width = "100%";
      imageContainer.style.height = "100%";
      imageContainer.style.bottom = 0;
      imageContainer.style.left = 0;
    }
   
  };

  replay = () => {
    const imageContainer = document.getElementById("new-image");
    imageContainer.style.cssText += "width : 60px; height :60px;";
    const replay = document.getElementById("replay");
    const save = document.getElementById("save");
    replay.style.opacity = 0;
    save.style.opacity = 0;
    replay.style.display = "none";
    save.style.display = "none";
    imageContainer.style.bottom = "12px";
    imageContainer.style.left = "20px";
  };
  render() {
    return (
      <div>
        <video id="video" autoPlay playsInline ref="cam" />

        <div
          className="camera-btn-outer flexbox"
          style={{
            justifyContent: "center",
            alignItems: "center",
            bottom: 10,
            left: "-30px",
            background: this.props.btnColor ? this.props.btnColor : "#2acef5"
          }}
        >
          <input
            type="button"
            onClick={this.capture}
            id="camera-btn"
            style={{
              background: this.props.btnColor ? this.props.btnColor : "#2acef5"
            }}
          />
        </div>
        <div id="new-image">
          <div
            id="replay"
            onClick={this.replay}
            className="camera-btn-outer flexbox"
            style={{
              justifyContent: "center",
              alignItems: "center",
              bottom: 10,
              marginLeft: 0,
              left: 10,
              opacity: 0,
              display: "none"
            }}
          >
            <Replay />
          </div>

          {this.props.linkToSave ? (
            <div
              id="save"
              className="camera-btn-outer flexbox"
              style={{
                justifyContent: "center",
                alignItems: "center",
                bottom: 10,
                marginLeft: "100%",
                opacity: 0,
                right: 10,
                display: "none"
              }}
            >
              <Save />
            </div>
          ) : null}
        </div>
        {this.state.load ? (
          <CircularProgress
            size={100}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 100
            }}
          />
        ) : null}

        <canvas
          id="canvas"
          width={this.state.camWidth}
          height={this.state.camHeight}
          ref="canvas"
          style={{ display: "none" }}
        />

        <div id="imageContainer" />
      </div>
    );
  }
}

export default Photo;

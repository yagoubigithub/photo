import React, { Component } from "react";
import { Replay, Save, Camera } from "@material-ui/icons";
import "./Photo.css";
import soundFile from "./audio/camera-shutter-click-03.mp3";

import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
class Photo extends Component {
  state = {
    load: false
  };

  componentWillUnmount = () => {
    // delete userMedia
    // stream.getVideoTracks()[0].stop();
    document.getElementById("video").pause();
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
    video.addEventListener("pause", () => {
      stream.getVideoTracks()[0].stop();
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
    var audio = new Audio(soundFile);
    audio.play();
    newImage.addEventListener("click", this.showImage);

    if (this.props.linkToSave) {
      //send
      document.getElementById("save").addEventListener("click", () => {
        if (!this.state.load) {
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
            if (http.readyState === 4 && http.status === 200) {
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
      <div
        style={{
          position: "fixed",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0
        }}
      >
        <video id="video" autoPlay playsInline ref="cam" />
        <div
          style={{
            position: "fixed",
            bottom: 10,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }}
        >
          <IconButton color="secondary" onClick={this.capture}>
            <Camera fontSize="large" />
          </IconButton>
          <div id="new-image">
            <IconButton
              color="secondary"
              id="replay"
              onClick={this.replay}
              style={{
                position: "fixed",
                bottom: 10,

                left: 10,
                opacity: 0,
                display: "none"
              }}
            >
              <Replay fontSize="large" />
            </IconButton>
          </div>

          <IconButton
            color="secondary"
            id="save"
            style={{
              position: "fixed",
              bottom: 10,

              opacity: 0,
              display: "none",
              right: 10
            }}
          >
            <Save fontSize="large" />
          </IconButton>
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

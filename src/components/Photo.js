import React, { Component } from "react";
import { Replay, Save, Camera,SwitchCamera } from "@material-ui/icons";
import soundFile from "./audio/camera-shutter-click-03.mp3";
import { withStyles } from "@material-ui/core/styles";

import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";

const styles = {
  camera_btn_outer: {
    width: "60px",
    height: "60px",
    position: "fixed",
    marginLeft: "50%",
    borderRadius: "30px !important",
    bottom: 10,
    background: "transparent",
    zIndex: 99
  }
};
class Photo extends Component {
  state = {
    load: false,
    videoLoad: false,
    facingMode: "user"
  };

  componentWillUnmount = () => {
    // delete userMedia
    // stream.getVideoTracks()[0].stop();
    document.getElementById("video").pause();
  };
  componentDidMount = () => {
  this.Media();
  };

  success = stream => {
    const video = this.refs.cam;
    if (window.URL) {
      try {
        video.src = window.URL.createObjectURL(stream);
      } catch (error) {
        video.srcObject = stream;
      }
    } else {
      video.src = stream;
    }
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

  Media = () =>{
    const video = this.refs.cam;
    video.addEventListener("loadedmetadata", () => {
      this.setState({ videoLoad: true });
    });

    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.getMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      navigator.getMedia(
        {
          video: {
            width: { ideal: this.props.width },
            height: { ideal: this.props.height },
            facingMode: { ideal: this.state.facingMode }
          },
          audio: false
        },
        this.success,
        this.error
      );
    } else {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: { ideal: this.props.width },
            height: { ideal: this.props.height },
            facingMode: { ideal: this.state.facingMode }
          }
        })
        .then(this.success)
        .catch(this.error);
    }

    this.setState({
      camWidth: null,
      camHeight: null
    });
  }
  error = err => {
    alert(err);
  };
  chnageFacingMode = () =>{
    if(this.state.facingMode === "user")
    this.setState({facingMode : "environment"});
    else{
      this.setState({facingMode : "user"});
    }
    this.Media();
    console.log(this.state.facingMode);
  }
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

    replay.style.display = "inline";
    save.style.display = "inline";

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
        <video
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            minHeight: "100%",
            background: "#000"
          }}
          id="video"
          autoPlay
          playsInline
          ref="cam"
        />

        {this.state.videoLoad ? (
          <IconButton
            color="secondary"
            onClick={this.chnageFacingMode}
            style={{
              position: "fixed",
              top: 10,
              right: 10
            }}
          >
            <SwitchCamera fontSize="large" />
          </IconButton>
        ) : null}
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
          {this.state.videoLoad ? (
            <IconButton color="secondary" onClick={this.capture}>
              <Camera fontSize="large" />
            </IconButton>
          ) : null}

          <div
            id="new-image"
            style={{
              position: "fixed",
              bottom: 12,
              left: 20,
              width: 60,
              height: 60,
              border: "1px solid #fff",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: 99,
              display: "none"
            }}
          >
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
        </div>

        {this.state.load ? (
          <CircularProgress
            size={100}
            style={{
              position: "fixed",
              top: "50%",
              left: "44%",
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

export default withStyles(styles)(Photo);

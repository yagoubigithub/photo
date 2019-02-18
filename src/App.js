import React, { Component } from "react";
import Photo from "./components/Photo";
import Dialog from "@material-ui/core/Dialog";
import { IconButton, Button } from "@material-ui/core";
import { Replay, Close } from "@material-ui/icons";

class App extends Component {
  state = {
    dialog: false
  };
  capture = imgSrc => {
    console.log(imgSrc);
  };
  OpenCloseDialog = () => {
    this.setState({ dialog: !this.state.dialog });
  };
  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.OpenCloseDialog}>Prendre une photo</Button>
        <Dialog open={this.state.dialog}>
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              position: "fixed",
              left: 5,
              top: 5,
              zIndex: 100,
              borderRadius: "100%",
              width: 60,
              height: 60,
              backgroundColor: "#2acef5"
            }}
            onClick={this.OpenCloseDialog}
          >
            <Close />
          </div>
          <Photo
            capture={this.capture}
            width={1920}
            linkToSave="http://yagoubi.000webhostapp.com/getImage/index.php"
            height={1440}
          />
        </Dialog>


      </div>
    );
  }
}

export default App;

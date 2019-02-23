import React, { Component } from "react";
import Photo from "./components/Photo";
import Dialog from "@material-ui/core/Dialog";
import { Button, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

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
        <Button
          variant="contained"
          color="primary"
          onClick={this.OpenCloseDialog}
        >
          Prendre une photo
        </Button>
        <Dialog open={this.state.dialog}>
          <IconButton
            color="secondary"
            style={{
              position: "fixed",
              left: 10,
              top: 10,
              zIndex: 100
            }}
            onClick={this.OpenCloseDialog}
          >
            <Close fontSize="large" />
          </IconButton>

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

import React, { Component } from 'react';
import Photo from './components/Photo';

class App extends Component {

  capture = (imgSrc) => {
    console.log(imgSrc);



  }
  render() {
    return (
      <div>
    <Photo 
    capture={this.capture}
    width={1920} 
    linkToSave="http://yagoubi.000webhostapp.com/getImage/index.php"
    height={1440} />

        
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactBotUI from './index.js';

class App extends Component {

	constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    if (this.chat) {
      this.chat.handleToggle();
    }
  }

 render() {
    return (
      <div>
        <h1>react-bot-ui demo</h1>
        <button onClick={this.handleToggle}>Toggle Chat</button>
        <ReactBotUI
          dialogHeightMax={350}
          isUserHidden={true}
          isVisible={false}
          ref={el => this.chat = el} />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));

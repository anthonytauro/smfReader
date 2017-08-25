import React, { Component } from 'react';
import logo from './PA_Logo.png';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      screenNameValue: '', 
      readCount: 10,
      readResults: null 
    }
    this.handleScreenNameChange = this.handleScreenNameChange.bind(this)
    this.handleCountChange = this.handleCountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleScreenNameChange(event) {
    this.setState({ screenNameValue: event.target.value })
  }
  handleCountChange(event) {
    this.setState({ readCount: event.target.value })
  }

  handleSubmit(event) {
    fetch('/api/read?screen_name=' + this.state.screenNameValue + "&count=" + this.state.readCount)
    .then(res => res.json())
    .then(data => {
      console.log("Got: ", data)
      this.setState({ readResults: data.message })
    });

    event.preventDefault()
  }

  componentDidMount() {
    this.setState({ readResults: '' })
    
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} alt="logo" />
          <h2>Social Media Feeds Reader</h2>
        </div>
        <p className="App-intro">
        </p>
        <div>
          <form onSubmit={this.handleSubmit} >
            <label htmlFor="screenName">Screen Name:</label>
            <input type="text" name="screenName" 
                   value={this.state.screenNameValue} onChange={this.handleScreenNameChange} /> <br />
            <label htmlFor="screenName">Read count:</label>
            <input type="text" name="count" 
                   value={this.state.count} onChange={this.handleCountChange} />
            <input type="submit" value="Read" />
          </form>
          <div> 
            { this.state.readResults } 
          </div>
        </div>

      </div>
    );
  }
}

export default App;

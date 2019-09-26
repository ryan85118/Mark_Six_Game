import React from 'react';
import ReactDOM from 'react-dom';
//import { readConfig } from 'jest-config';

//import './index.css';

class Bet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_bet_one: null,
      num_bet_two: null,
      num_bet_three: null,
      num_bet_four: null,
      num_bet_five: null,
      num_bet_six: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <from>
        <label>
          Num_one:
          <input
            name="num_bet_one"
            type="number"
            value={this.state.num_bet_one}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Num_two:
        <input
            name="num_bet_two"
            type="number"
            value={this.state.num_bet_two}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Num_three:
        <input
            name="num_bet_three"
            type="number"
            value={this.state.num_bet_three}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Num_four:
        <input
            name="num_bet_four"
            type="number"
            value={this.state.num_bet_four}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Num_five:
        <input
            name="num_bet_five"
            type="number"
            value={this.state.num_bet_five}
            onChange={this.handleInputChange} />
        </label>
        <label>
          Num_six:
        <input
            name="num_bet_six"
            type="number"
            value={this.state.num_bet_six}
            onChange={this.handleInputChange} />
        </label>
      </from>
    );
  }
}

// ========================================

ReactDOM.render(
  <Bet />,
  document.getElementById("root")
);
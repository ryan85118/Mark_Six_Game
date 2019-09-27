import React from 'react';
import ReactDOM from 'react-dom';
//import { readConfig } from 'jest-config';
//import './index.css';

class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numBet: Array(6).fill(1),
            output: []
        };
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    numRandom = () => {
        let num = []
        while (num.length < 6) {
            let temp = getRandom(1, 49)
            num.push(temp)
            if (isRepeat(num)) { num.pop() }
        }
        this.setState({ numBet: num })
    }

    handleInputChange(event) {
        const value = event.target.value
        const id = event.target.id
        let newNumBet = this.state.numBet.slice()
        if (value > 0 && value < 50) {
            newNumBet[id] = value
        }
        else if (value === "") {
            newNumBet[id] = ""
        }
        this.setState({ numBet: newNumBet })
    }

    Submit = () => {
        let result = calculation(this.state.numBet)
        let newOutput = this.state.output.slice()
        newOutput.push(result)
        this.setState({ output: newOutput })
    }

    Bets = () => {
        return (
            this.state.numBet.map((v, i) =>
                <div key={i} >
                    <label>
                        Num_{i + 1} :
                            <input
                            id={i}
                            type="number"
                            value={v}
                            onChange={this.handleInputChange} />
                    </label>
                </div >
            )
        )
    }

    OutputList = () => {
        return (
            this.state.output.map((v, i) =>
                <div>
                    {v}
                </div>
            )
        )
    }

    print = () => {
        return (

            <label>
                <this.OutputList />
            </label>

        )
    }

    clear = () => {
        let empty = []
        this.setState({ output: empty })
    }

    render() {
        return (
            <div>
                <div>
                    <this.Bets />
                    <button onClick={this.Submit}>
                        run
                    </button>
                    <button onClick={this.numRandom}>
                        random
                    </button>
                    <button onClick={this.clear}>
                        clear
                    </button>
                </div>
                <this.print />
            </div >
        )
    }
}

// ========================================

ReactDOM.render(
    <Bet />,
    document.getElementById("root")
);

function calculation(numBet) {
    let winningNum = []
    for (let i = 0; i < numBet.length; i++) {
        if (numBet[i] === "") {
            window.alert("Don't input the empty")
            return
        }
    }
    if (isRepeat(numBet)) {
        window.alert("Repeat input the numbers")
        return
    }
    while (winningNum.length < 6) {
        let temp = getRandom(1, 49)
        winningNum.push(temp)
        if (isRepeat(winningNum)) { winningNum.pop() }
    }
    winningNum.sort((a, b) => { return a - b })
    numBet.sort((a, b) => { return a - b })
    let count = winnigCount(winningNum.concat(numBet))
    return ("your num:" + numBet + "\nwinning num:" + winningNum + "\nsame :" + count)
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function isRepeat(arr) {
    let appearNum = Array(49).fill(0)
    for (let i = 0; i < arr.length; i++) {
        appearNum[arr[i]]++
        if (appearNum[arr[i]] > 1) {
            return true
        }
    }
    return false
}

function winnigCount(arr) {
    let appearNum = Array(49).fill(0)
    let count = 0
    for (let i = 0; i < arr.length; i++) {
        appearNum[arr[i]]++
        if (appearNum[arr[i]] > 1) {
            count++
        }
    }
    return count
}
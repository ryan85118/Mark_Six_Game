import React from 'react';
import './game.css';

const BET_AMOUNT = 6
const MIN_WIN_NUM = 1
const MAX_WIN_NUM = 49

export default class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numBet: Array(BET_AMOUNT).fill(1),
            output: []
        };
    }

    quickPick = () => {
        let num = []
        while (num.length < BET_AMOUNT) {
            let temp = getRandom(MIN_WIN_NUM, MAX_WIN_NUM)
            if (!hasDuplicate(num.concat(temp))) { num.push(temp) }
        }
        this.setState({ numBet: num })
    }

    handleInputChange = (event) => {
        let value = event.target.value
        let id = event.target.id
        let newNumBet = [...this.state.numBet]
        if (value > 0 && value < 50) {
            newNumBet[id] = value
        }
        else if (value === "") {
            newNumBet[id] = ""
        }
        this.setState({ numBet: newNumBet })
    }

    submit = () => {
        const lastLine = this.calculation(this.state.numBet)
        const newOutput = [...this.state.output]
        newOutput.push(lastLine)
        this.setState({ output: newOutput })
    }

    calculation = (numBet) => {
        let winningNum = []
        for (let i = 0; i < numBet.length; i++) {
            if (numBet[i] === "")
                return ("Don't input the empty")
        }
        if (hasDuplicate(numBet))
            return ("Repeat input the numbers")
        while (winningNum.length < BET_AMOUNT) {
            let temp = getRandom(MIN_WIN_NUM, MAX_WIN_NUM)
            winningNum.push(temp)
            if (hasDuplicate(winningNum)) { winningNum.pop() }
        }
        winningNum.sort((a, b) => { return a - b })
        numBet.sort((a, b) => { return a - b })
        this.setState({ numBet: numBet })
        const count = countDuplicateNums(numBet, winningNum)
        return ("your num:" + numBet + "\nwinning num:" + winningNum + "\nsame :" + count)
    }

    clear = () => {
        let empty = []
        this.setState({ output: empty })
    }

    render() {
        return (
            <div>
                <div>
                    <Bets
                        state={this.state}
                        handleInputChange={this.handleInputChange}
                    />
                    <button onClick={this.submit}>
                        run
                    </button>
                    <button onClick={this.quickPick}>
                        random
                    </button>
                    <button onClick={this.clear}>
                        clear
                    </button>
                </div>
                <label>
                    <OutputList
                        state={this.state}
                    />
                </label>
            </div >
        )
    }
}
// ========================================

function Bets(props) {
    const { state, handleInputChange } = props
    return state.numBet.map((v, i) =>
        <div key={i} >
            <label>
                Num_{i + 1} :
                <input
                    id={i}
                    type="number"
                    value={v}
                    onChange={handleInputChange} />
            </label>
        </div >
    )
}

function OutputList(props) {
    const { state } = props
    return state.output.map((v, _) =>
        <div>
            {v}
        </div>
    )
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function hasDuplicate(numArr) {
    while (numArr.length > 0) {
        let temp = numArr[0]
        if (numArr.slice(1).includes(temp))
            return true
        numArr = numArr.slice(1)
    }
    return false
}

function countDuplicateNums(arr1, arr2) {
    let count = 0
    while (arr1.length > 0) {
        if (arr2.includes(arr1[0]))
            count++
        arr1 = arr1.slice(1);
    }
    return count
}
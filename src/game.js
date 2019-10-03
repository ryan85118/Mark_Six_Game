import React from 'react';
import './game.css';

const BET_AMOUNT = 6
const MIN_WIN_NUM = 1
const MAX_WIN_NUM = 49

export default class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sum: 1,
            NumberOfWins: 0,
            numBet: Array(BET_AMOUNT).fill(1),
            output: [],
            winningCount: Array(BET_AMOUNT).fill(0),
            runTime: 1,
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
        let value = +event.target.value
        let id = event.target.id
        let newNumBet = [...this.state.numBet]
        if (value > 0 && value < 50) {
            newNumBet[id] = value
        }
        else if (value === 0) {
            newNumBet[id] = ""
        }
        this.setState({ numBet: newNumBet })
    }

    handleRunTimeChange = (event) => {
        let value = +event.target.value
        let newNumBet = 0
        if (value > 0 && value < 1001) {
            newNumBet = value
        }
        else {
            newNumBet = 0
        }
        this.setState({ runTime: newNumBet })
    }

    submit = () => {
        const newOutput = [...this.state.output]
        const newWinningCount = [...this.state.winningCount]
        console.time('start')
        for (let i = 0; i < this.state.runTime; i++) {

            let result = this.calculation(this.state.numBet)
            if (result == null) {
                return
            }
            else {
                newWinningCount[result.same.length - 1]++
                newOutput.unshift(
                    <tr key={newOutput.length - 1}>
                        <td>
                            {newOutput.length + 1}
                        </td>
                        <td>
                            {this.zorePadding(result.bet).sort((a, b) => { return a - b }).map((v, i) => <button key={i} className="ball">{v}</button>)}
                        </td>
                        <td>
                            {this.zorePadding(result.winning).sort((a, b) => { return a - b }).map((v, i) => <button key={i} className="ball">{v}</button>)}
                        </td>
                        <td>
                            {result.same.map((v, i) => <button key={i} className="ball">{v}</button>)}
                        </td>
                    </tr>
                )
            }
        }
        console.timeEnd("start")
        let winningSum = 0
        newWinningCount.map((v, i) => winningSum += v)
        this.setState({
            output: newOutput,
            sum: newOutput.length,
            winningCount: newWinningCount,
            NumberOfWins: winningSum
        })
    }

    calculation = (numBet) => {
        let winningNum = []
        for (let i = 0; i < numBet.length; i++) {
            if (numBet[i] === "") {
                alert("Don't input the empty")
                return null
            }
        }
        if (hasDuplicate(numBet)) {
            alert("Repeat input the numbers")
            return null
        }
        while (winningNum.length < BET_AMOUNT) {
            let temp = getRandom(MIN_WIN_NUM, MAX_WIN_NUM)
            winningNum.push(temp)
            if (hasDuplicate(winningNum)) { winningNum.pop() }
        }
        winningNum.sort((a, b) => { return a - b })

        const winNum = countDuplicateNums(numBet, winningNum)

        return {
            bet: numBet,
            winning: winningNum,
            same: winNum,
        }
    }

    zorePadding = (numArr) => {
        let temp = [...numArr]
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] > 0 && temp[i] < 10) {
                temp[i] = "0" + temp[i]
            }
            else temp[i] = "" + temp[i]
        }
        return temp
    }

    clear = () => {
        let empty = []
        this.setState({ output: empty, sum: 1, NumberOfWins: 0, winningCount: Array(BET_AMOUNT).fill(0), runTime: 1 })
    }

    render() {
        return (
            <div>
                <h1>Lotto Game</h1>
                <div class="container">
                    <div>
                        <Bets
                            state={this.state}
                            handleInputChange={this.handleInputChange}
                        />
                        <div key="1" >
                            Run time :
                            <input
                                type="number"
                                value={this.state.runTime}
                                onChange={this.handleRunTimeChange} />
                        </div >
                        <br />
                        <button className="button" onClick={this.submit}>
                            run
                        </button>
                        <button className="button" onClick={this.quickPick}>
                            random
                        </button>
                        <button className="button" onClick={this.clear}>
                            clear
                        </button>
                    </div>
                    <div>
                        <ResultTable state={this.state} />
                    </div>
                    <div>
                        SUM = {this.state.output.length} Winnging Rate = {(this.state.NumberOfWins / this.state.sum).toFixed(2)}
                        {this.state.winningCount.map((v, i) => <div key={i} >Win {i + 1} ={v} Winnging Rate = {(v / this.state.sum).toFixed(6)} </div>)}
                    </div>
                </div>
            </div>
        )
    }
}
// ========================================

function Bets(props) {
    const { state, handleInputChange } = props
    return state.numBet.map((v, i) =>
        <div key={i} >
            Num_{i + 1} :
                <input
                id={i}
                type="number"
                value={v}
                onChange={handleInputChange} />
        </div >
    )
}

function ResultTable(props) {
    const { state } = props
    const buttonName = ["index", "numarr", "winningNum", "same"]
    return (
        <table>
            <thead>
                <tr>
                    {buttonName.map((v, _) => <td>{v}</td>)}
                </tr>
            </thead>
            <tbody>
                {state.output.slice(0, 10).map((v, _) => v)}
            </tbody>
        </table >
    )
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function hasDuplicate(numA) {
    while (numA.length > 0) {
        let temp = numA[0]
        if (numA.slice(1).includes(temp))
            return true
        numA = numA.slice(1)
    }
    return false
}

function countDuplicateNums(arr1, arr2) {
    let winNum = []
    while (arr1.length > 0) {
        if (arr2.includes(arr1[0])) {
            winNum.push(arr1[0])
        }
        arr1 = arr1.slice(1);
    }
    return winNum
}
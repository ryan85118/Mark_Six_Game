import React from 'react';
import './game.css';

const BET_AMOUNT = 6
const MIN_WIN_NUM = 1
const MAX_WIN_NUM = 49

export default class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numBet: [1, 2, 3, 4, 5, 6],
            winCount: Array(BET_AMOUNT).fill(0),
            outputData: [],
            outputDataStore: [],
            runTime: 1,
            winNumSum: 0,
            sum: 1,
        };
    }

    handleNumBetChange = (event) => {
        let value = +event.target.value
        let id = event.target.id
        let newNumBet = [...this.state.numBet]
        if (value > 0 && value < 50) {
            newNumBet[id] = value
        }
        else {
            newNumBet[id] = ""
        }
        this.setState({ numBet: newNumBet })
    }

    handleRunTimeChange = (event) => {
        let value = +event.target.value
        let newRunTime = 0
        if (value > 0 && value < 100001) {
            newRunTime = value
        }
        else {
            newRunTime = ""
        }
        this.setState({ runTime: newRunTime })
    }

    quickPick = () => {
        this.setState({ numBet: getRandomGroup() })
    }

    submit = () => {
        let newOutputDataStore = [...this.state.outputDataStore]
        let newWinCount = [...this.state.winCount]
        let newOutputData = [...this.state.outputData]
        let newSum = this.state.sum
        console.time('start')
        for (let i = 0; i < this.state.runTime; i++) {
            let result = this.matchPrizeNum(this.state.numBet)
            const resultData = [result.betNum, result.prizeNum, result.matchingNum]
            if (!result) return

            if (newOutputData.length > 9) newOutputData.pop()
            let sum = newOutputDataStore.length
            let betNum = result.betNum
            let prizeNum = result.prizeNum
            let matchingNum = result.matchingNum
            newOutputDataStore.push({ sum, betNum, prizeNum, matchingNum })
            newOutputData.unshift(
                <tr key={newSum}>
                    <td>{newSum}</td>
                    {resultData.map((V, I) => <td key="I"> {V.map((v, i) => <button key={i} className="ball">{v}</button>)}</td>)}
                </tr>
            )
            newSum++
            newWinCount[result.matchingNum.length - 1]++
        }
        console.timeEnd("start")
        let winningSum = 0
        newWinCount.map((v, i) => winningSum += v)

        this.setState({
            outputDataStore: newOutputDataStore,
            winCount: newWinCount,
            winNumSum: winningSum,
            outputData: newOutputData,
            sum: newSum
        })
    }

    matchPrizeNum = (numBet) => {
        if (hasDuplicate(numBet)) {
            alert("Repeat input the numbers")
            return
        }
        let prizeNum = getRandomGroup().sort((a, b) => { return a - b })
        const matchingNum = countDuplicateNums(numBet, prizeNum)
        return {
            betNum: this.zorePadding(numBet).sort((a, b) => { return a - b }),
            prizeNum: this.zorePadding(prizeNum).sort((a, b) => { return a - b }),
            matchingNum: this.zorePadding(matchingNum).sort((a, b) => { return a - b }),
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
        this.setState({
            outputDataStore: [],
            outputData: [],
            winNumSum: 0,
            winCount: Array(BET_AMOUNT).fill(0),
            runTime: 1,
            sum: 1
        })
    }

    render() {
        return (
            <div>
                <h1>Lotto Game</h1>
                <div className="container">
                    <div>
                        <Bets
                            state={this.state}
                            handleNumBetChange={this.handleNumBetChange}
                        />
                        Run time :
                            <input
                            type="number"
                            value={this.state.runTime}
                            onChange={this.handleRunTimeChange} />
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
                        SUM = {this.state.sum} Win Rate = {(this.state.winNumSum / this.state.sum).toFixed(6)}
                        {this.state.winCount.map((v, i) => <div key={i}> Win {i + 1} = {v} Win Rate = {(v / this.state.sum).toFixed(6)}</div>)}
                    </div>
                </div>
            </div>
        )
    }
}
// ========================================

function Bets(props) {
    const { state, handleNumBetChange } = props
    return state.numBet.map((v, i) => (
        <div key={i} >
            Num_{i + 1} :
                <input
                id={i}
                type="number"
                value={v}
                onChange={handleNumBetChange} />
        </div>
    )
    )
}

function ResultTable(props) {
    const { state } = props
    const buttonName = ["index", "numarr", "winningNum", "same"]
    return (
        <table>
            <thead>
                <tr>
                    {buttonName.map((v, i) => <td key={i}>{v}</td>)}
                </tr>
            </thead>
            <tbody>
                {state.outputData.map((v, _) => v)}
            </tbody>
        </table>
    )
}

function getRandomGroup() {
    let newNum = []
    while (newNum.length < BET_AMOUNT) {
        let temp = Math.floor(Math.random() * (MAX_WIN_NUM - MIN_WIN_NUM + 1)) + MIN_WIN_NUM
        if (!hasDuplicate(newNum.concat(temp))) { newNum.push(temp) }
    }
    return newNum
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
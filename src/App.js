import './App.css';
import React from 'react';
import { Analyzer, Analyze, JudgeWord } from './Analyzer';
import wordlist from './wordleMain.json'

const lStates = ['gray', 'yellow', 'green']

const guessTotal = 6

const Letter = (props) => {
  return (
    <button className={`letterBox ${lStates[props.state]}`} onClick={props.onClick}>{props.letter.toUpperCase()}</button>
  )
}

const Line = (props) => {
  const letters = []
  for (let i = 0; i < props.count; i++) {
    letters.push(<Letter key={i} letter={i >= props.val.length ? "" : props.val[i]} state={props.state[i]} onClick={() => props.changeState(i)}/>)
  }

  return (
    <div className={`line ${props.active ? "active" : "inactive"}`}>
      {letters}
      {props.bitInfo ? <p className="bitInfo">({props.bitInfo ? props.bitInfo.toString().slice(0,5): "inf"})</p> : null}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    let letterState = []
    let line = []
    let bitInfo = []

    for (let i = 0; i < guessTotal; i++) {
      letterState[i] = [0, 0, 0, 0, 0]
      line[i] = ""
      bitInfo[i] = 0
    }

    this.state = {
      line,
      letterState,
      count: 5,
      activeLine: 0,
      list: wordlist,
      evalList: null,
      bitInfo
    }
  }

  reset () {
    let letterState = []
    let line = []
    let bitInfo = []

    for (let i = 0; i < guessTotal; i++) {
      letterState[i] = [0, 0, 0, 0, 0]
      line[i] = ""
      bitInfo[i] = 0
    }

    this.setState({
      line,
      letterState,
      count: 5,
      activeLine: 0,
      list: wordlist,
      evalList: null,
      bitInfo
    })
  }

  changeState (line, index) {
    if (line !== this.state.activeLine) return
    let letterState = this.state.letterState.slice()
    letterState[line][index] = letterState[line][index] >= lStates.length - 1 ? 0 : letterState[line][index] + 1
    this.setState({ letterState })
  }

  filterList (word, state, list) {
    // Calculate state id
    let basket = 0
    for (let i = 0; i < this.state.count; i++) {
      basket *= 3
      basket += state[i]
    }

    console.log(basket)

    // Filter
    let newList = []
    list.forEach(entry => {
      const j = JudgeWord(entry, word, this.state.count)
      if (j === basket) {
        newList.push(entry)
      }
    })
    console.log(newList)

    return newList
  }

  keyDownHandler (e) {
    if (this.state.activeLine >= guessTotal) return
    if (e.keyCode === 8 && this.state.line[this.state.activeLine]) {
      let newLines = this.state.line.slice()
      newLines[this.state.activeLine] = newLines[this.state.activeLine].substring(0, newLines[this.state.activeLine].length - 1)
      this.setState({line: newLines})
    }
    else if(e.keyCode === 13){
      e.preventDefault() // Stop the active buttons from changing state, if they are active

      if (this.state.line[this.state.activeLine].length === this.state.count && wordlist.includes(this.state.line[this.state.activeLine])) {
        const originalLength = this.state.list.length
        const newList = this.filterList(this.state.line[this.state.activeLine], this.state.letterState[this.state.activeLine], this.state.list)

        let evalList = null
        if (newList.length <= 3000) {
          let stateCount = 1

          for (let i = 0; i < this.state.count; i++) {
            stateCount *= 3
          }
        
          evalList = newList.map(w => [w, Analyze(w, stateCount, newList)])
          evalList.sort((a, b) => b[1] - a[1])
        }

        let bitInfo = this.state.bitInfo
        bitInfo[this.state.activeLine] = Math.log2(originalLength / newList.length)

        this.setState({
          activeLine: this.state.activeLine + 1,
          list: newList,
          evalList,
          
        })
      }
    }
    else {
      const letter = String.fromCharCode(e.keyCode).trim()
      if (letter.match(/[a-z]/i) && this.state.line[this.state.activeLine].length < this.state.count) {
        let line = this.state.line.slice()
        line[this.state.activeLine] += letter.toLowerCase()
        this.setState({ line })
      }
      else if (letter.match(/[1-9]/i)) {
        const id = parseInt(letter)
        if (id <= this.state.count) this.changeState(this.state.activeLine, id - 1)
      }
    }
  } 

  componentDidMount() {
    window.addEventListener("keydown", this.keyDownHandler.bind(this))
  }

  // componentWillUnmount() {
  //   window.removeEventListener("keydown", this.keyDownHandler.bind(this))
  // }

  render() {
    const lines = new Array(guessTotal)

    for (let i = 0; i < guessTotal; i++) {
      lines[i] = <Line key={i} count={5} active={i===this.state.activeLine} state={this.state.letterState[i]} bitInfo={this.state.bitInfo[i]} val={this.state.line[i]} changeState={(index) => this.changeState(i, index)}/>
    }

    return (
      <div className="App">
        <h1 className='title'>Wordle Agent</h1>
        <p className='title'>Treating all allowed words as possible answers!</p>
        <div className="inputDiv">
          {lines}
          <button className='resetButton' onClick={() => this.reset()}>Reset</button>
        </div>
        <Analyzer count={this.state.count} set={this.state.evalList || this.state.list} originalSize={wordlist.length} search={this.state.list.length <= 3000}/>
      </div>
    )
  }
}



export default App;

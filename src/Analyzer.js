const JudgeWord = (target, entry, l) => {
  if (entry.length !== l || target.length !== l) {
    console.log(`${entry}/${target}`)
    return -1
  }
  const repeater = new Array(l)
  
  // First Pass
  for (let i = 0; i < l; i++) {
    repeater[i] = (target[i] === entry[i])
  }

  if (target === 'baked') {
    console.log(l)
  }

  // Second Pass
  let basket = 0
  for (let i = 0; i < l; i++) {
    basket *= 3
    if (target[i] === entry[i]) {
      basket += 2
    }
    else {
      for (let j = 0; j < l; j++) {
        if (target === 'baked') {
          console.log(`Home:${i} Targ:${j} => ${!repeater[j] && target[j] === entry[i]}`)
        }
        if (!repeater[j] && target[j] === entry[i]) {
          repeater[j] = true
          basket += 1
          break
        }
      }
    }
  }

  if (target === 'baked') {
    console.log(basket)
  }

  return basket
}

const Analyze = (word, stateCount, set) => {
  let res = new Array(stateCount)
  let l = word.length

  for (const entry of set) {
    const basket = JudgeWord(word, entry, l)
    if (basket >= 0) res[basket] = res[basket] ? res[basket] + 1 : 1
  }
  
  let score = 0
  let total = 0
  res.forEach(a => total += a)
  for (const entry of res) {
    if (entry && entry > 0) {
      const p = entry / set.length
      score += p * Math.log2(1 / p)
    }
  }

  return score
}

const Analyzer = (props) => {
  let set = props.set

  let elementList;

  if (props.search) {
    elementList = set.slice(0, 200).map(([w,r]) => <li key={w}>{`${w}(${r.toString().slice(0, 5)})`}</li>)
  }
  else {
    elementList = set.slice(0, 200).map(w => <li key={w}>{w}</li>)
  }

  return (
    <div>
      <h3 className="Analyzer Title">{`${set.length}/${props.originalSize} (${set.length === 0 ? 0 : Math.log2(set.length).toString().slice(0,5)} bits left)`}</h3>
      <ul>
        {elementList}
      </ul>
    </div>
  )
}

export {
  Analyzer,
  Analyze,
  JudgeWord
} 
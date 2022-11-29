import { useState } from 'react'

const Display = props => (
  <div>
    good {props.good}<br/>
    neutral {props.neutral}<br/>
    bad {props.bad}
  </div>
)

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newGood => {
    console.log('good now', newGood)
    setGood(newGood)
  }
  const setToNeutral = newNeutral => {
    console.log('neutral now', newNeutral)
    setNeutral(newNeutral)
  }
  const setToBad = newBad => {
    console.log('bad now', newBad)
    setBad(newBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Display good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
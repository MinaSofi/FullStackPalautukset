import { useState } from 'react'

const Statistics = props => {
  if(props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return <div>No feedback given.</div>
  }
  return (
  <div>
    good {props.good}<br/>
    neutral {props.neutral}<br/>
    bad {props.bad}<br/>
    all {props.good + props.neutral + props.bad}<br/>
    average {props.average}<br/>
    positive {props.positive} %
  </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = good + bad * -1 / all
  const positive = good / all * 100

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
      <Statistics good={good} neutral={neutral} bad={bad} all={all}
      average={average} positive={positive} />
    </div>
  )
}

export default App
import { useState } from 'react'

const StatisticLine = (props) => (
  <table>
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>
  </table>
)

const Statistics = props => {
  if(props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return <div>No feedback given.</div>
  }
  return (
  <div>
    <StatisticLine text="good" value={props.good} />
    <StatisticLine text="neutral" value={props.neutral} />
    <StatisticLine text="bad" value={props.bad} />
    <StatisticLine text="all" value={props.good + props.neutral + props.bad} />
    <StatisticLine text="average" value={props.average} />
    <StatisticLine text="positive" value={props.positive} />
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
  const positive = good / all * 100 + ' %'

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
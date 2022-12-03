import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const DisplayedVotes = props => {
  return <p>has {props.voted} votes</p>
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const votes = new Uint8Array(anecdotes.length)
  const [allVotes, setAllVotes] = useState(votes)
  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)
  const [popularAnecdote, setPopularAnecdote] = useState(0)

  const setToSelected = newSelect => {
    console.log('selected now ', newSelect)
    setSelected(newSelect)
    setVoted(allVotes[newSelect])
  }
  const setToVoted = newVote => {
    const totalVotes = [...allVotes]
    newVote += 1
    totalVotes[selected] = newVote
    console.log('voted ', newVote, ' times')
    console.log('votes: ', votes)
    console.log('total votes: ', totalVotes)
    setVoted(newVote)
    setAllVotes(totalVotes)
    if(newVote > mostVoted) {
      setMostVoted(newVote)
      setPopularAnecdote(selected)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br/>
      <DisplayedVotes voted={voted} />
      <Button handleClick={() => setToVoted(voted)} text="vote" />
      <Button handleClick={() => setToSelected(Math.floor(Math.random() 
        * anecdotes.length))} text="anecdote" />
      <h1>Anecdote with most votes</h1>
      {anecdotes[popularAnecdote]}<br/>
      <DisplayedVotes voted={mostVoted} />
    </div>
  )
}

export default App
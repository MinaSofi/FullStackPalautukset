import { useState } from 'react'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import People from './components/People'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newFilter, setNewFilter] = useState('')

  const peopleToShow = showAll
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const setToNewName = (event) => {
      setNewName(event.target.value)
  }

  const setToNewNumber = (event) => {
      setNewNumber(event.target.value)
  }

  const setToPersons = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    console.log(newPerson.name)
    console.log(persons)
    persons.map(person => person.name).includes(newPerson.name)
    ? alert(`${newName} is already added to phonebook`)
    : setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const setToNewFilter = (event) => {
      setNewFilter(event.target.value)
      if (event.target.value === '') {
        console.log(event.target.value + ' is true')
        setShowAll(showAll)
      } else {
        console.log(event.target.value + ' is not true')
        setShowAll(!showAll)
      }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter newFilter={newFilter} setToNewFilter={setToNewFilter}/>
      </div>
      <h2>Add a new</h2>
        <NewPerson newName={newName} setToNewName={setToNewName} newNumber={newNumber} setToNewNumber={setToNewNumber} setToPersons={setToPersons}/>
      <h2>Numbers</h2>
        <People peopleToShow={peopleToShow} />
    </div>
  )

}

export default App
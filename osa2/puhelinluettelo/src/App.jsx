import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import People from './components/People'
import peopleService from './services/peopleService'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    peopleService.getAll().then((initialPeople) => {
      setPersons(initialPeople)
    })
  }, [])

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
    console.log(newPerson.name + ' is added to phonebook')
    console.log(persons)
    if(persons.map(person => person.name).includes(newPerson.name)) {
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newPerson.name)
        peopleService.update(personToUpdate.id, newPerson).then((returnedPerson) => {
          setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      } else {
        console.log('Error updating person')
      }
    } else {
      peopleService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const setToNewFilter = (event) => {
      setNewFilter(event.target.value)
      newFilter.includes(event.target.value.toLowerCase())
      ? setShowAll(true)
      : setShowAll(false)
  }

  const peopleToShow = showAll
  ? persons
  : persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const deletePerson = (event) => {
    event.preventDefault()
    console.log(event.target.value + ' event target value when deleting')
    if(persons.map(person => person.name).includes(event.target.value)) {
      if(confirm(`Delete ${event.target.value}?`)) {
        const personToDelete = persons.find(person => person.name === event.target.value)
        peopleService.deleteData(personToDelete.id).then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
      } else {
        console.log('Error deleting person')
      }
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
        <People peopleToShow={peopleToShow} deletePerson={deletePerson}/>
    </div>
  )

}

export default App
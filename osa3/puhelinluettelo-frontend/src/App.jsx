import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import People from './components/People'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import peopleService from './services/peopleService'
import './index.css'

const App = () => {

  const [people, setPeople] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [newFilter, setNewFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    peopleService.getAll().then((initialPeople) => {
      setPeople(initialPeople)
    })
  }, [])

  const setToNewName = (event) => {
      setNewName(event.target.value)
  }

  const setToNewNumber = (event) => {
      setNewNumber(event.target.value)
  }

  const setToPeople = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }
    console.log(people)
    if(people.map(person => person.name).includes(newPerson.name)) {
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = people.find(person => person.name === newPerson.name)
        peopleService
          .update(personToUpdate.id, newPerson)
          .then((returnedPerson) => {
            setPeople(people.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            console.log(`${personToUpdate.name}'s number was updated successfully to phonebook`)
            setNotifMessage(
              `${personToUpdate.name}'s number was updated successfully to phonebook`
            )
            setTimeout(() => {
              setNotifMessage(null)
            }, 5000)
          })
          .catch((error) => {
            console.log(error.response.data)
            setErrorMessage(
              `${personToUpdate.name}'s number could not be updated to phonebook. Did you type the name correctly?`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      } else {
        console.log('Error updating person')
      }
    } else {
      console.log('Trying to add ' + newPerson.name + ' to phonebook')
      peopleService
        .create(newPerson)
        .then((returnedPerson) => {
          setPeople(people.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          console.log(`${newPerson.name} was added successfully to phonebook`)
          setNotifMessage(
            `${newPerson.name} was added successfully to phonebook`
          )
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000)
        })
        .catch((error) => {
          console.log(error.response.data)
          setErrorMessage(
            `${newPerson.name}'s number could not be added to phonebook. Did you type the number correctly?`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const setToNewFilter = (event) => {
    setNewFilter(event.target.value)
    newFilter.length > 0
    ? setShowAll(false)
    : setShowAll(true)
  }

  const peopleToShow = showAll
  ? people
  : people.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const deletePerson = (event) => {
    event.preventDefault()
    console.log(event.target.value + ' event target value when deleting')
    if(people.map(person => person.name).includes(event.target.value)) {
      if(confirm(`Delete ${event.target.value}?`)) {
        const personToDelete = people.find(person => person.name === event.target.value)
        peopleService
          .deleteData(personToDelete.id)
          .then(() => {
            setPeople(people.filter(person => person.id !== personToDelete.id))
            console.log(`${personToDelete.name}'s number was deleted successfully from phonebook`)
            setNotifMessage(
              `${personToDelete.name}'s number was deleted successfully from phonebook`
            )
            setTimeout(() => {
              setNotifMessage(null)
            }, 5000)
          })
          .catch(() => {
            console.log(`${personToDelete.name}'s number could not be deleted from phonebook. It may have already been removed from the server.`)
            setErrorMessage(
              `${personToDelete.name}'s number could not be deleted from phonebook. It may have already been removed from the server.`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      } else {
        console.log('Error deleting person')
      }
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} />
      <ErrorNotification message={errorMessage} />
      <div>
        <Filter newFilter={newFilter} setToNewFilter={setToNewFilter}/>
      </div>
      <h2>Add a new</h2>
        <NewPerson newName={newName} setToNewName={setToNewName} newNumber={newNumber} setToNewNumber={setToNewNumber} setToPeople={setToPeople}/>
      <h2>Numbers</h2>
        <People peopleToShow={peopleToShow} deletePerson={deletePerson}/>
    </div>
  )

}

export default App
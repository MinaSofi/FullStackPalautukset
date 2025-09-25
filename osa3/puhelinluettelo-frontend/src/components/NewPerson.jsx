const NewPerson = ({ newName, setToNewName, newNumber, setToNewNumber, setToPersons }) => {

  return (
    <form>
        <div>
          name: <input type={"text"} value={newName} onChange={setToNewName}/>
        </div>
        <div>
          number: <input type={"text"} value={newNumber} onChange={setToNewNumber}/>
        </div>
        <div>
          <button type="submit" onClick={setToPersons}>add</button>
        </div>
      </form>
  )

}

export default NewPerson
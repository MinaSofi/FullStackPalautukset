const NewPerson = ({ newName, setToNewName, newNumber, setToNewNumber, setToPeople }) => {

  return (
    <form>
        <div>
          name: <input type={"text"} value={newName} onChange={setToNewName}/>
        </div>
        <div>
          number: <input type={"text"} value={newNumber} onChange={setToNewNumber}/>
        </div>
        <div>
          <button type="submit" onClick={setToPeople}>add</button>
        </div>
      </form>
  )

}

export default NewPerson
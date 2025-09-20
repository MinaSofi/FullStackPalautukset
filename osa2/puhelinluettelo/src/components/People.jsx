const People = ({ peopleToShow, deletePerson }) => {

  return (
    <div>
      {peopleToShow.map(person => (
        <div>
          <p key={person.name}>{person.name}, {person.number}</p>
          <button key={person.name} value={person.name} onClick={deletePerson}>delete</button>
        </div>
      ))}
    </div>
  )

}

export default People
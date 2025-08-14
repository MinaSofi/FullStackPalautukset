const People = ({ peopleToShow, deletePerson }) => {

  return (
    <div>
      {peopleToShow.map(person =>
        <p key={person.name}>{person.name}, {person.number}</p>
      )}
      {peopleToShow.map(person =>
        <button key={person.name} value={person.name} onClick={deletePerson}>delete</button>
      )}
    </div>
  )

}

export default People
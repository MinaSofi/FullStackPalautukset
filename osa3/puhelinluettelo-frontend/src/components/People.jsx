const People = ({ peopleToShow, deletePerson }) => {

  return (
    <div>
      {peopleToShow.map(person => (
        <p key={person.name}>{person.name}, {person.number}
        <button key={person.name} value={person.name} onClick={deletePerson}>delete</button>
        </p>
      ))}
    </div>
  )

}

export default People
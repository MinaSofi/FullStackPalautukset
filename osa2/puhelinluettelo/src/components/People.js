const People = ({ peopleToShow }) => {

  return (
    <div>
      {peopleToShow.map(person =>
        <p key={person.name}>{person.name}, {person.number}</p>
      )}
    </div>
  )

}

export default People
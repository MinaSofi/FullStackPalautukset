const Countries = ({ countryToShow, showCountry }) => {

    /*{countryToShow.map(country =>
        <p key={country.name}>{country.name}</p>
      )}
      {countryToShow.map(country =>
        <button key={country.name} value={country.name} onClick={showCountry}>show</button>
      )}*/

  return (
    <div>
        {JSON.stringify(countryToShow)}
        <button onClick={showCountry}>show</button>
    </div>
  )

}

export default Countries
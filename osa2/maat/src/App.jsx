import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import countryService from './services/countryService'

const App = () => {

  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('Fetching countries from API')
    countryService.getAll()
      .then((initialCountries) => {
        console.log('Countries fetched successfully')
        console.log(initialCountries)
        setCountries(initialCountries)
      })
      .catch(() => {
        console.error('Error fetching countries')
      })
  }, [])

  const setToNewFilter = (event) => {
    console.log(`Setting new filter to: ${event.target.value}`)
    setNewFilter(event.target.value)
    //newFilter.includes(event.target.value.toLowerCase())
    //? setShowAll(true)
    //: setShowAll(false)
    countryService.getCountry(event.target.value).then((country) => {
      setCountries(country)
    }).catch(() => {
      console.log(`Country with name ${event.target.value} not found`)
      setCountries([])
    })
  }

  const countryToShow = showAll
  ? countries
  : countries.filter((country) => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  const showCountry = (event) => {
    event.preventDefault()
    console.log(`Showing details for country: ${event.target.value}`)
  }

  return (
    <div>
      <Filter newFilter={newFilter} setToNewFilter={setToNewFilter}/>
      <Countries countryToShow={countryToShow} showCountry={showCountry}/>
    </div>
  )
}

export default App

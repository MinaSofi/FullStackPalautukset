const Filter = ({ newFilter, setToNewFilter }) => {

    return (
        <div>
            filter shown with <input type={"text"} value={newFilter} onChange={setToNewFilter}/>
        </div>
    )
}

export default Filter
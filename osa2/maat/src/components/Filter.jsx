const Filter = ({ newFilter, setToNewFilter }) => {

    return (
        <div>
            find countries <input type={"text"} value={newFilter} onChange={setToNewFilter}/>
        </div>
    )
}

export default Filter
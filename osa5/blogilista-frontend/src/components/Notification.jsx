const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    if (message.includes('Welcome') || message.includes('successfully')) {
        return (
            <div className="notif">
                {message}
            </div>
        )
    }
    
    return (
        <div className="error">
            {message}
        </div>
    )
}

export default Notification
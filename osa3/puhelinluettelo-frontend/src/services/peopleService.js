import axios from 'axios'
const baseURL = '/api/people'

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const create = (newObject) => {
    const request = axios.post(baseURL, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseURL}/${id}`, newObject)
    return request.then(response => response.data)
}

const deleteData = (id, newObject) => {
    const request = axios.delete(`${baseURL}/${id}`, newObject)
    return request.then(response => response.data)
}

export default {
    getAll,
    create,
    update,
    deleteData
}
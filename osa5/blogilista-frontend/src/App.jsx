import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`Welcome ${user.name}!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Wrong credentials!')
      console.log(message, error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    setMessage('Logged out successfully')
    setTimeout(() => {
      setMessage(null)
      setUser(null)
    }, 5000)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added successfully!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Error adding blog')
      console.log(message, error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <form onSubmit={logout}>
        <div>Logged in as {user.name}
          <button type="submit">Logout</button>
        </div>
      </form>
      <br/>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
          <br/>
          Author:
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
          <br/>
          URL:
          <input
            type="text"
            value={newUrl}
            name="URL"
            onChange={({ target }) => setNewUrl(target.value)}
          />
          <br/>
          <button type="submit">Add</button>
        </div>
      </form>
      <br/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
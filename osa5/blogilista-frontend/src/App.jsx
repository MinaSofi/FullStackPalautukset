import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()

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

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
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

  const updateLikes = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id
    }

    try {
      const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)
      const blogWithUser = {
        ...returnedBlog,
        user: blogToUpdate.user
      }

      setBlogs(blogs.map(blog =>
        blog.id !== blogToUpdate.id ? blog : blogWithUser
      ))
    } catch (error) {
      setMessage('Error updating blog details')
      console.log(message, error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      const fetchedBlogs = await blogService.getAll()
      setBlogs(fetchedBlogs)
      setMessage('Blog removed successfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Error removing blog')
      console.log(message, error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const confirmRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this blog?')) {
      removeBlog(id)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm
        handleLogin={handleLogin}
        handleUsernameSetting={({ target }) => setUsername(target.value)}
        handlePasswordSetting={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
      />
    </Togglable>
  )

  const blogForm = () => (
    <div>Logged in as {user.name}
      <button type="submit" onClick={logout}>Logout</button>
      <Togglable buttonLabel="Add new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <ul>
        {sortBlogs(blogs).map(blog =>
          <li>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              updateShownDetails={() => updateLikes(blog)}
              removeBlog={() => confirmRemove(blog.id)}/>
          </li>
        )}
      </ul>
    </div>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />

      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App
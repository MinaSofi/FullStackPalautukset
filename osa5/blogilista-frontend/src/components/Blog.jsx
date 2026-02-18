import { useState } from 'react'

const Blog = ({ blog, user, updateShownDetails, removeBlog }) => {
  const [shown, setShown] = useState(false)

  const showLess = { display: shown ? '' : 'none' }
  const viewMore = { display: shown ? 'none' : '' }

  const toggleVisibility = () => {
    setShown(!shown)
  }

  const showRemove = () => {
    if (blog.user.username === user.username) {
      return (
        <button type="submit" onClick={removeBlog}>Remove</button>
      )
    }
  }

  return (
    <div className="bloglist">
      <div style={viewMore}>
        {blog.title} {blog.author}
        <button type="submit" onClick={toggleVisibility}>View</button>
      </div>
      <div style={showLess}>
        {blog.title} {blog.author}
        <button type="submit" onClick={toggleVisibility}>Hide</button>
        <p>{blog.url}</p>
        <p>Likes: {blog.likes}
          <button type="submit" onClick={updateShownDetails}>Like</button>
        </p>
        <p>Added by {blog.user.name}</p>
        {showRemove()}
      </div>
    </div>
  )
}

export default Blog
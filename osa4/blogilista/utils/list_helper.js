const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
    const counts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})

    return Object.entries(counts).reduce((max, [author, blogs]) =>
        blogs > max.blogs ? { author, blogs } : max,
        { author: null, blogs: 0 }
    )
}

const mostLikes = (blogs) => {
    const likesCount = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})

    return Object.entries(likesCount).reduce((max, [author, likes]) =>
        likes > max.likes ? { author, likes } : max,
        { author: null, likes: 0 }
    )
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
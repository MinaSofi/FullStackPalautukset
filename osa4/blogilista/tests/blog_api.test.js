const assert = require('node:assert')
const bcrypt = require('bcrypt')
const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(listHelper.listWithMultipleBlogs)
    })

    test('right amount of blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect('Content-Type', /application\/json/)
        
        const blogs = await listHelper.blogsInDb()
        assert.strictEqual(blogs.length, listHelper.listWithMultipleBlogs.length)
    })

    test('returned blogs are identified by id', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        blogs.forEach(blog => {
            assert.ok(blog.id)
        })
    })
})

describe('addition of a new blog', () => {
    let token

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('salainensana', 10)
        const user = new User({ username: 'mkarhu', passwordHash })
        await user.save()

        const response = await api
            .post('/api/login')
            .send({ username: 'mkarhu', password: 'salainensana' })

        token = response.body.token
        await Blog.insertMany(listHelper.listWithMultipleBlogs)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "New blog post",
            author: "Test Author",
            url: "http://example.com/new-blog-post",
            likes: 7
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await listHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length + 1)
        const titles = blogsAtEnd.map(b => b.title)
        assert.ok(titles.includes('New blog post'))
    })

    test('if likes property is missing, it defaults to 0', async () => {
        const newBlog = {
            title: "Blog without likes",
            author: "No Likes Author",
            url: "http://example.com/blog-without-likes"
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: "No Title Author",
            url: "http://example.com/blog-without-title",
            likes: 3
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
        const blogsAtEnd = await listHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "Blog without URL",
            author: "No URL Author",
            likes: 4
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
        const blogsAtEnd = await listHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length)
    })

    test('adding a blog fails with status code 401 if token is not provided', async () => {
        const newBlog = {
            title: "Unauthorized blog post",
            author: "No Token Author",
            url: "http://example.com/unauthorized-blog-post",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
        const blogsAtEnd = await listHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length)
    })
})

describe('deletion and updating of a blog', () => {
    let token

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('salainensana', 10)
        const user = new User({ username: 'mkarhu', passwordHash })
        await user.save()

        const response = await api
            .post('/api/login')
            .send({ username: 'mkarhu', password: 'salainensana' })
            
        token = response.body.token

        const blogsWithUser = listHelper.listWithMultipleBlogs.map(blog => ({
            ...blog,
            user: user._id
        }))
        
        await Blog.insertMany(blogsWithUser)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await listHelper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const blogsAtEnd = await listHelper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length - 1)
        const titles = blogsAtEnd.map(b => b.title)
        assert.ok(!titles.includes(blogToDelete.title))
    })

    test('a blog can be updated', async () => {
        const blogsAtStart = await listHelper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedData = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 10
        }
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await listHelper.usersInDb()
        const newUser = {
            username: 'ppaavo',
            name: 'Paavo Pesusieni',
            password: 'paavonsalaisuus',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await listHelper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await listHelper.usersInDb()
        assert(result.body.error.includes('username must be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
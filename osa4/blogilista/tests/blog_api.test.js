const assert = require('node:assert')
const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

const api = supertest(app)

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

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "New blog post",
        author: "Test Author",
        url: "http://example.com/new-blog-post",
        likes: 7
    }
    await api
        .post('/api/blogs')
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
        .send(newBlog)
        .expect(400)
    const blogsAtEnd = await listHelper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, listHelper.listWithMultipleBlogs.length)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
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

after(async () => {
    await mongoose.connection.close()
})
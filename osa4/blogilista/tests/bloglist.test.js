const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const result = listHelper.dummy(listHelper.emptyBlogList)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(listHelper.emptyBlogList)
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listHelper.listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listHelper.listWithMultipleBlogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    test('returns the blog with most likes', () => {
        const result = listHelper.favoriteBlog(listHelper.listWithMultipleBlogs)
        assert.deepStrictEqual(result, 
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        })
    })
})

describe('most blogs', () => {
    test('returns the author with most blogs', () => {
        const result = listHelper.mostBlogs(listHelper.listWithMultipleBlogs)
        assert.deepStrictEqual(result, 
        {
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('returns the author with most likes', () => {
        const result = listHelper.mostLikes(listHelper.listWithMultipleBlogs)
        assert.deepStrictEqual(result, 
        {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})
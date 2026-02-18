const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Minna Karhu',
        username: 'mkarhu',
        password: 'salainensana'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click()

    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mkarhu', 'salainensana')
      await expect(page.getByText('Welcome Minna Karhu!')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mkarhu', 'wrong')
      const errorNotification = page.locator('.error')
      await expect(errorNotification).toBeVisible()
      await expect(errorNotification).toContainText('Wrong credentials!')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mkarhu', 'salainensana')
    })

    test('A blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing a form...', 'Test Author', 'http://testurl.com')
      await expect(page.locator('.bloglist')).toContainText('Testing a form... Test Author')
    })

    test('A blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testing a form...', 'Test Author', 'http://testurl.com')
      await page.getByRole('button', { name: 'View' }).click()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.locator('.bloglist')).toContainText('Likes: 1')
    })

    test('A blog can be deleted by the user who created it', async ({ page }) => {
      await createBlog(page, 'Testing a form...', 'Test Author', 'http://testurl.com')
      await page.getByRole('button', { name: 'View' }).click()
      const blogItem = page.getByText('Testing a form... Test Author')
      await Promise.all([
        page.waitForEvent('dialog').then(dialog => dialog.accept()),
        page.getByRole('button', { name: 'Remove' }).click(),
      ])
      await expect(blogItem).toHaveCount(0)
    })

    test('A blog cannot be deleted by another user', async ({ page, request }) => {
      await createBlog(page, 'Testing a form...', 'Test Author', 'http://testurl.com')
      await request.post('/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'anotherpassword'
        }
      })
      await page.getByRole('button', { name: 'Logout' }).click()
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
      await loginWith(page, 'anotheruser', 'anotherpassword')
      await page.getByRole('button', { name: 'View' }).click()
      const blogItem = page.getByText('Testing a form... Test Author')
      await expect(blogItem.getByRole('button', { name: 'Remove' })).toBeHidden()
    })

    test('Blogs are ordered according to likes in descending order', async ({ page }) => {
      await createBlog(page, 'First blog', 'Author One', 'http://firstblog.com')
      await createBlog(page, 'Second blog', 'Author Two', 'http://secondblog.com')
      const secondBlog = page.getByText('Second blog Author Two')
      await secondBlog.getByRole('button', { name: 'View' }).click()
      await secondBlog.getByRole('button', { name: 'Like' }).click()
      const blogs = page.locator('.bloglist')
      await Promise.all([
        await expect(blogs.nth(0)).toContainText('Second blog Author Two'),
        await expect(blogs.nth(1)).toContainText('First blog Author One')
      ])
    })
  })
})
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByLabel('Username:').fill(username)
  await page.getByLabel('Password:').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Add new blog' }).click()
  await page.getByPlaceholder('Type title here...').fill(title)
  await page.getByPlaceholder('Type author here...').fill(author)
  await page.getByPlaceholder('Type URL here...').fill(url)
  await page.getByRole('button', { name: 'Add' }).click()
}

export { loginWith, createBlog }
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getAllByPlaceholderText('Type title here...')[0]
  const inputAuthor = screen.getAllByPlaceholderText('Type author here...')[0]
  const inputUrl = screen.getAllByPlaceholderText('Type URL here...')[0]
  const sendButton = screen.getByRole('button', { name: 'Add' })

  await user.type(inputTitle, 'Testing a form...')
  await user.type(inputAuthor, 'Test Author')
  await user.type(inputUrl, 'http://testurl.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testurl.com')
})

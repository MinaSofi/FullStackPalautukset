const LoginForm = ({
  handleLogin,
  handleUsernameSetting,
  handlePasswordSetting,
  username,
  password
}) => {
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              name="Username"
              onChange={handleUsernameSetting}
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={handlePasswordSetting}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
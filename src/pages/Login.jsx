import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/login.css'

import API_URL from '../api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()

    setError('')

    try {
      const response = await fetch(
        '${API_URL}/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      localStorage.setItem(
        'coregg_token',
        data.token
      )

      navigate('/admin')
    } catch {
      setError('Erro ao conectar')
    }
  }

  return (
    <div className="loginPage">
      <form
        className="loginBox"
        onSubmit={handleLogin}
      >
        <span>
          PAINEL ADMINISTRATIVO
        </span>

        <h1>
          COREGG LOGIN
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="loginError">
            {error}
          </p>
        )}

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login
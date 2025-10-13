import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../context/authContext'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResetMessage('')
    setLoading(true)

    try {
      await resetPassword(email)
      setResetMessage('Password reset email sent! Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-15 flex items-center justify-center bg-primary px-4">
      <div className="max-w-md w-full space-y-8 bg-secondary p-8 rounded-lg shadow-lg border border-highlights">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            {isResetMode ? 'Reset Password' : 'Sign In'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {isResetMode 
              ? 'Enter your email to receive a reset link' 
              : 'Access your dashboard'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isResetMode ? handleResetPassword : handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-primary border border-highlights rounded-md 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-highlights"
                placeholder="you@example.com"
              />
            </div>

            {!isResetMode && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-primary border border-highlights rounded-md 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-highlights"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {resetMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded">
              {resetMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white bg-highlights 
                     hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-highlights disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Processing...' : isResetMode ? 'Send Reset Link' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(!isResetMode)
                setError('')
                setResetMessage('')
              }}
              className="text-highlights hover:underline cursor-pointer"
            >
              {isResetMode ? '← Back to Sign In' : 'Forgot Password?'}
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: '/register' })}
              className="text-highlights hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
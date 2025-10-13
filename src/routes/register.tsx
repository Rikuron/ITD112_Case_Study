import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../context/authContext'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-15 flex items-center justify-center bg-primary px-4">
      <div className="max-w-md w-full space-y-8 bg-secondary p-8 rounded-lg shadow-lg border border-highlights">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign up to get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-white mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-primary border border-highlights rounded-md 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-highlights"
                placeholder="John Doe"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-primary border border-highlights rounded-md 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-highlights"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded">
              {error}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate({ to: '/login' })}
              className="text-sm text-highlights hover:underline cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

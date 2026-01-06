import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Since we disabled "Confirm Email", this will log you in immediately
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Account created! You are logged in.')
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm p-8 bg-gray-900 rounded-xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">BioMech Login</h1>
        <div className="flex flex-col gap-4">
          <input
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="p-3 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>
          <button
             onClick={handleSignUp}
             disabled={loading}
             className="text-gray-400 hover:text-white text-sm"
          >
             Need an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
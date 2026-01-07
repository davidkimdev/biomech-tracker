import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Navbar from './Navbar'
import InputForm from './InputForm'
import HistoryList from './HistoryList'
import Auth from './Auth' // Import the new Login Screen
import ProgressChart from './ProgressChart'

export default function App() {
  const [session, setSession] = useState(null)
  const [history, setHistory] = useState([])

  // 1. AUTH LISTENER: Check if user is logged in
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. FETCH DATA: Only runs if we have a session
  useEffect(() => {
    if (session) {
      fetchWorkouts()
    }
  }, [session]) // Run whenever 'session' changes

  const fetchWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session.user.id) // <--- CRITICAL: Only get MY data
      .order('created_at', { ascending: false })

    if (error) console.log('Error fetching:', error)
    else {
      const formattedData = data.map(item => ({
        ...item,
        time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      setHistory(formattedData)
    }
  }

  const addWorkout = async (exercise, weight, reps) => {
    const { error } = await supabase
      .from('workouts')
      .insert([
        { 
          exercise, 
          weight: Number(weight), 
          reps: Number(reps),
          user_id: session.user.id // <--- CRITICAL: Stamp it with MY ID
        }
      ])

    if (error) alert('Error saving data!')
    else fetchWorkouts()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setHistory([]) // Clear screen
  }

  // 3. THE GATEKEEPER RENDER
  if (!session) {
    return <Auth /> // If no user, show Login Screen
  }

  // If user exists, show the Tracker
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="pt-24 px-4 max-w-xl mx-auto pb-20">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Session Active</h2>
            <p className="text-gray-400 text-sm">
              User: <span className="text-blue-500">{session.user.email}</span>
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-white px-3 py-2 rounded transition-all"
          >
            Sign Out
          </button>
        </div>

        <InputForm onAdd={addWorkout} />
        
        {/* NEW: The Visuals - Inserted here */}
        <ProgressChart data={history} />

        <HistoryList data={history} />
      </main>
    </div>
  )
}
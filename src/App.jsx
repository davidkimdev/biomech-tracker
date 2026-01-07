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
    // 1. SANITIZE: Force "Title Case" (e.g. "bench press" -> "Bench Press")
    // This regex takes the first letter of every word and makes it Uppercase
    const cleanExercise = exercise.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

    const { data, error } = await supabase
      .from('workouts')
      .insert([
        { 
          exercise: cleanExercise, // Use the clean version
          weight: parseFloat(weight), 
          reps: parseInt(reps),
          user_id: session.user.id 
        }
      ])
      .select()

    if (error) {
      console.error('Error adding workout:', error)
    } else {
      setHistory([data[0], ...history])
    }
  }
const deleteWorkout = async (id) => {
    // 1. Tell Supabase to delete the row with this specific ID
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
    } else {
      // 2. Update the local screen immediately (remove it from the list)
      setHistory(history.filter(item => item.id !== id))
    }
  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setHistory([]) // Clear screen
  }

  // 3. THE GATEKEEPER RENDER
  if (!session) {
    return <Auth /> // If no user, show Login Screen
  }
  // EXTRACT UNIQUE EXERCISES
  // 1. Get all names
  // 2. Use 'Set' to remove duplicates
  // 3. Convert back to array
  const uniqueExercises = [...new Set(history.map(item => item.exercise))]
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

        {/* Pass the list of names to the form */}
        <InputForm onAdd={addWorkout} uniqueExercises={uniqueExercises} />
        
        {/* NEW: The Visuals - Inserted here */}
        <ProgressChart data={history} />

        <HistoryList data={history} onDelete={deleteWorkout} />
      </main>
    </div>
  )
}
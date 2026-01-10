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


// Toast State
  const [toast, setToast] = useState(null); // stores the error message (e.g. "Invalid Weight")

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
    // Helper to show toast for 3 seconds
    const showError = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000); 
    };

    // 1. Check Name
    if (!exercise || !exercise.trim()) {
      showError("Please enter an exercise name.");
      return;
    }

    const numWeight = parseFloat(weight);
    const numReps = parseFloat(reps); 

    // 2. Check Math
    if (isNaN(numWeight) || numWeight <= 0) {
      showError("Weight must be a positive number.");
      return;
    }

    if (isNaN(numReps) || numReps <= 0) {
      showError("Reps must be a positive number.");
      return;
    }

    // 3. Success -> Send to DB
    const cleanExercise = exercise.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());

    const { data, error } = await supabase
      .from('workouts')
      .insert([
        { 
          exercise: cleanExercise, 
          weight: numWeight, 
          reps: Math.floor(numReps), 
          user_id: session.user.id 
        }
      ])
      .select()

    if (error) {
      showError("Database Error: " + error.message);
    } else {
      // --- THE FIX IS HERE ---
      const newItem = data[0];
      
      // We manually format the time right now so we don't have to wait for a refresh
      const formattedItem = {
        ...newItem,
        time: new Date(newItem.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory([formattedItem, ...history]);
      setToast(null); 
    }
  }
  const updateWorkout = async (id, newWeight, newReps) => {
    // 1. Update Supabase
    const { error } = await supabase
      .from('workouts')
      .update({ weight: parseFloat(newWeight), reps: parseInt(newReps) })
      .eq('id', id)

    if (error) {
      console.error('Error updating:', error)
    } else {
      // 2. Update local state
      setHistory(history.map(item => 
        item.id === id ? { ...item, weight: parseFloat(newWeight), reps: parseInt(newReps) } : item
      ))
    }
  }
  const deleteWorkout = async (id) => {
    // 1. Delete from Supabase
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
    } else {
      // 2. Remove from local state
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

        <HistoryList data={history} onDelete={deleteWorkout} onUpdate={updateWorkout} />
      </main>
{/* THE TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl z-50 transition-all font-bold flex items-center gap-2">
          <span>⚠️</span>
          {toast}
        </div>
      )}

    </div>
  )
}
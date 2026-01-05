import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient' // Importing the bridge we just built
import Navbar from './Navbar'
import InputForm from './InputForm'
import HistoryList from './HistoryList'

export default function App() {
  const [history, setHistory] = useState([])

  // 1. FETCH: Run this when the app starts
  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    // Talk to Supabase
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false }) // Newest first

    if (error) {
      console.log('Error fetching:', error)
    } else {
      // Format the raw data so it looks nice in our list
      const formattedData = data.map(item => ({
        ...item,
        time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      setHistory(formattedData)
    }
  }

  // 2. INSERT: Run this when you click "Log Data"
  const addWorkout = async (exercise, weight, reps) => {
    // Send data to the Cloud
    const { error } = await supabase
      .from('workouts')
      .insert([
        { exercise: exercise, weight: weight, reps: reps }
      ])

    if (error) {
      console.error('Error inserting:', error)
      alert('Error saving data!')
    } else {
      // If successful, re-fetch the list to see the new item immediately
      fetchWorkouts()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="pt-24 px-4 max-w-xl mx-auto pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Session Active</h2>
          <p className="text-gray-400">
            System memory: <span className="text-blue-500 font-bold">CLOUD SYNC</span>
          </p>
        </div>

        <InputForm onAdd={addWorkout} />
        <HistoryList data={history} />
      </main>
    </div>
  )
}
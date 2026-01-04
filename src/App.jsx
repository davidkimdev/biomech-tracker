import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import InputForm from './InputForm'
import HistoryList from './HistoryList'

export default function App() {
  // 1. Load data from browser memory on startup
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('biomech-data')
    return saved ? JSON.parse(saved) : []
  })

  // 2. Save data to browser memory whenever history changes
  useEffect(() => {
    localStorage.setItem('biomech-data', JSON.stringify(history))
  }, [history])

  const addWorkout = (exercise, weight, reps) => {
    const newWorkout = {
      id: Date.now(),
      exercise: exercise,
      weight: weight,
      reps: reps,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Real time
    }
    setHistory([newWorkout, ...history]) 
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="pt-24 px-4 max-w-xl mx-auto pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Session Active</h2>
          <p className="text-gray-400">
            System memory: <span className="text-green-500 font-bold">PERSISTENT</span>
          </p>
        </div>

        <InputForm onAdd={addWorkout} />
        <HistoryList data={history} />
      </main>
    </div>
  )
}
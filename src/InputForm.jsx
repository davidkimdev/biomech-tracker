import { useState } from 'react'

export default function InputForm({ onAdd }) {
  // Local state to track what the user types
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const handleSubmit = () => {
    // 1. Validation (Don't submit empty)
    if (!exercise || !weight || !reps) return;

    // 2. Send data up to App
    onAdd(exercise, weight, reps)

    // 3. Clear the form
    setExercise('')
    setWeight('')
    setReps('')
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-6">
      <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-wider">
        Log New Set
      </h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Exercise</label>
          <input 
            type="text" 
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g. Bench Press" 
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Weight (lbs)</label>
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0" 
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Reps</label>
            <input 
              type="number" 
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0" 
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          LOG DATA +
        </button>
      </div>
    </div>
  )
}
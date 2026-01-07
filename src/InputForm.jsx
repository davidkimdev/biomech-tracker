import { useState } from 'react'

export default function InputForm({ onAdd, uniqueExercises = [] }) {
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!exercise || !weight || !reps) return
    onAdd(exercise, weight, reps)
    setExercise('')
    setWeight('')
    setReps('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <div className="grid grid-cols-1 gap-4">
        {/* Exercise Input with Autocomplete */}
        <div>
          <label className="block text-gray-400 text-xs uppercase font-bold mb-1 ml-1">Exercise</label>
          <input
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
            type="text"
            placeholder="e.g. Bench Press"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            list="exercise-options" // Connects to the datalist below
          />
          {/* This hidden list powers the autocomplete */}
          <datalist id="exercise-options">
            {uniqueExercises.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase font-bold mb-1 ml-1">Weight (lbs)</label>
            <input
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
              type="number"
              placeholder="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase font-bold mb-1 ml-1">Reps</label>
            <input
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 outline-none transition-all placeholder-gray-600"
              type="number"
              placeholder="0"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-blue-900/20"
        >
          Log Workout
        </button>
      </div>
    </form>
  )
}
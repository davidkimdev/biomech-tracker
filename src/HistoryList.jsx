export default function HistoryList({ data, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-4">No workouts yet. Go lift something!</div>
  }

  return (
    <div className="space-y-4">
      {data.map((workout) => (
        <div 
          key={workout.id} 
          className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center shadow-md hover:border-blue-900/50 transition-colors"
        >
          {/* Left Side: The Info */}
          <div>
            <h3 className="font-bold text-lg text-white capitalize">{workout.exercise}</h3>
            <p className="text-gray-400 text-sm">
              <span className="text-blue-400 font-medium">{workout.weight} lbs</span> 
              <span className="mx-2">•</span> 
              {workout.reps} reps
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {new Date(workout.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Right Side: The Delete Button */}
          <button 
            onClick={() => onDelete(workout.id)}
            className="text-red-500 hover:text-red-400 text-sm font-semibold px-3 py-1 border border-transparent hover:border-red-900/30 rounded bg-red-900/10 hover:bg-red-900/20 transition-all"
            aria-label="Delete workout"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
import { useState } from 'react';
import EditRow from './EditRow';

export default function SessionCard({ date, workouts, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  const totalVolume = workouts.reduce((sum, w) => sum + (w.weight * w.reps), 0);

  const handleSave = (id, newWeight, newReps) => {
    onUpdate(id, newWeight, newReps);
    setEditingId(null); // Exit edit mode
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-lg">
      <div className="bg-gray-800/50 p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="font-bold text-white text-lg">{date}</h3>
        <span className="text-xs text-gray-400 font-mono">
          Vol: <span className="text-blue-400">{totalVolume.toLocaleString()} lbs</span>
        </span>
      </div>

      <div className="divide-y divide-gray-800">
        {workouts.map((workout) => (
          <div key={workout.id} className="p-4">
            {editingId === workout.id ? (
              // SHOW EDIT FORM
              <EditRow 
                workout={workout} 
                onSave={handleSave} 
                onCancel={() => setEditingId(null)} 
              />
            ) : (
              // SHOW NORMAL ROW
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-gray-200">{workout.exercise}</p>
                  <p className="text-sm text-gray-500">
                    {workout.weight} lbs × {workout.reps} reps
                  </p>
                </div>

                <div className="flex gap-2">
                   {/* EDIT BUTTON */}
                   <button 
                    onClick={() => setEditingId(workout.id)}
                    className="text-gray-600 hover:text-blue-400 transition-colors p-2"
                  >
                    ✎
                  </button>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => onDelete(workout.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors p-2"
                  >
                    🗑
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
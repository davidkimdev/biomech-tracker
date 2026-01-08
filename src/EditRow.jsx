import { useState } from 'react';

export default function EditRow({ workout, onSave, onCancel }) {
  const [weight, setWeight] = useState(workout.weight);
  const [reps, setReps] = useState(workout.reps);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(workout.id, weight, reps);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-between p-2 bg-gray-800 rounded">
      <div className="flex gap-2">
        <div className="w-20">
            <input 
              type="number" 
              value={weight} 
              onChange={e => setWeight(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none"
            />
        </div>
        <span className="text-gray-400 self-center">lbs</span>
        <div className="w-16">
            <input 
              type="number" 
              value={reps} 
              onChange={e => setReps(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none"
            />
        </div>
        <span className="text-gray-400 self-center">reps</span>
      </div>

      <div className="flex gap-2">
        {/* Cancel Button */}
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-white">
          ✕
        </button>
        {/* Save Button */}
        <button type="submit" className="text-green-500 hover:text-green-400 font-bold">
          ✓
        </button>
      </div>
    </form>
  );
}
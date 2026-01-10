import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data }) {
  const uniqueExercises = [...new Set(data.map(item => item.exercise))];
  const [selectedExercise, setSelectedExercise] = useState('');

  useEffect(() => {
    // If we have data but no exercise selected, pick the first one
    if (data.length > 0 && !selectedExercise) {
      setSelectedExercise(data[0].exercise);
    }
    // If the selected exercise doesn't exist anymore (deleted), reset
    if (uniqueExercises.length > 0 && !uniqueExercises.includes(selectedExercise)) {
      setSelectedExercise(uniqueExercises[0]);
    }
  }, [data, selectedExercise, uniqueExercises]);

  const chartData = data
    .filter(item => item.exercise === selectedExercise)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // --- ANALYTICS ---
  const currentPR = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.weight)) 
    : 0;

  const calculateOneRepMax = (weight, reps) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  }

  const theoreticalMax = chartData.length > 0
    ? Math.max(...chartData.map(item => calculateOneRepMax(item.weight, item.reps)))
    : 0;

  return (
    <div className="w-full bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 shadow-lg">
      
      {/* HEADER: Dropdown */}
      <div className="mb-4">
        {uniqueExercises.length > 0 ? (
          <select 
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="bg-gray-800 text-white text-sm font-semibold border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 w-full"
          >
            {uniqueExercises.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        ) : (
          <div className="text-gray-500 text-sm font-semibold">Ready to Log</div>
        )}
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Heaviest Lift</p>
          <p className="text-2xl font-bold text-white">{currentPR} <span className="text-sm text-blue-500">lbs</span></p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Est. 1 Rep Max</p>
          <p className="text-2xl font-bold text-white">{theoreticalMax} <span className="text-sm text-purple-500">lbs</span></p>
        </div>
      </div>

      {/* GRAPH - ALWAYS RENDERED (No Conditional Logic) */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="time" hide={true} />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{fontSize: 12}}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              width={35}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
              itemStyle={{ color: '#60A5FA' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`${value} lbs`, 'Weight']}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#1d4ed8', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
              isAnimationActive={false} // Keeps it instant
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
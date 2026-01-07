import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ data }) {
  // 1. Extract unique exercise names to populate a selector (future proofing)
  // For now, let's just automatically pick the most recent exercise type to graph
  const mostRecentExercise = data.length > 0 ? data[0].exercise : '';
  
  // 2. Filter data to only show that specific exercise
  // (Otherwise the graph jumps wildly between Squat weights and Curl weights)
  const chartData = data
    .filter(item => item.exercise === mostRecentExercise)
    .reverse(); // Recharts reads left-to-right, so we need oldest-to-newest

  if (data.length === 0) return null;

  return (
    <div className="w-full bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
          Progress: <span className="text-blue-500">{mostRecentExercise}</span>
        </h3>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              tick={{fontSize: 12}}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{fontSize: 12}}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']} // Auto-scale the height
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
              itemStyle={{ color: '#60A5FA' }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#1d4ed8', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
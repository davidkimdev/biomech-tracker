// Now accepting "data" as a prop
export default function HistoryList({ data }) {
  
  return (
    <div className="mt-8">
      <h3 className="text-gray-400 text-sm font-bold uppercase mb-4 tracking-wider">
        Recent Activity ({data.length})
      </h3>

      <div className="flex flex-col gap-3">
        {/* Map through the REAL data passed from App */}
        {data.map((item) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/30 transition animate-fade-in">
            
            <div>
              <h4 className="font-bold text-white">{item.exercise}</h4>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>

            <div className="text-right">
              <span className="block text-xl font-bold text-blue-400">{item.weight} <span className="text-xs text-gray-600">lbs</span></span>
              <span className="text-xs text-gray-400">{item.reps} reps</span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-gray-600 text-center italic mt-4">No data logged yet.</p>
        )}
      </div>
    </div>
  )
}
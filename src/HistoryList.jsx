import { groupWorkoutsByDate } from './utils';
import SessionCard from './SessionCard';

// 1. RECEIVE IT HERE (add onUpdate to the list)
export default function HistoryList({ data, onDelete, onUpdate }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-10">No workouts yet. Go lift something!</div>
  }

  const groupedData = groupWorkoutsByDate(data);
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <SessionCard 
          key={date} 
          date={date} 
          workouts={groupedData[date]} 
          onDelete={onDelete} 
          
          // 2. PASS IT DOWN HERE
          onUpdate={onUpdate} 
        />
      ))}
    </div>
  )
}
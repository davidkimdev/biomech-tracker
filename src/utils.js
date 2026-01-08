export function groupWorkoutsByDate(history) {
  const groups = {};

  history.forEach(workout => {
    // 1. Get the date string (e.g. "1/7/2026")
    const date = new Date(workout.created_at).toLocaleDateString();

    // 2. If this date bucket doesn't exist, create it
    if (!groups[date]) {
      groups[date] = [];
    }

    // 3. Add the workout to the bucket
    groups[date].push(workout);
  });

  return groups;
}
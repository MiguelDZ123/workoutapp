import { useSession } from 'next-auth/react';

interface Workout {
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
  }>;
}

export default function WorkoutDisplay({ workout }: { workout: Workout }) {
  const { data: session } = useSession();
  
  const handleSaveWorkout = async () => {
    try {
      const response = await fetch('/api/workouts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workout }),
      });
      
      if (response.ok) {
        alert('Workout saved successfully!');
      } else {
        throw new Error('Failed to save workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    }
  };

  return (
    <div>
      {/* ... existing workout display code ... */}
      
      {session && (
        <button
          onClick={handleSaveWorkout}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Workout
        </button>
      )}
    </div>
  );
} 
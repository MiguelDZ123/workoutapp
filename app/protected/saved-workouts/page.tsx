'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useSession } from 'next-auth/react';
import { Dumbbell, Loader2 } from 'lucide-react';

interface SavedWorkout {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function SavedWorkouts() {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedWorkouts = async () => {
      try {
        const response = await fetch('/api/workouts/saved');
        if (response.ok) {
          const data = await response.json();
          setWorkouts(data.workouts);
        } else {
          console.error('Failed to fetch saved workouts');
        }
      } catch (error) {
        console.error('Error fetching saved workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchSavedWorkouts();
    }
  }, [session]);

  if (!session) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-lg">Please sign in to view your saved workouts.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Your Saved Workouts</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Access and manage your personalized workout plans.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No saved workouts yet</h3>
          <p className="text-gray-500">
            Generate and save workouts to access them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{workout.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Saved on {new Date(workout.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => window.location.href = `/workout/${workout.id}`}
                  className="text-sm bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  View Workout
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this workout?')) {
                      try {
                        const response = await fetch(`/api/workouts/${workout.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          setWorkouts(workouts.filter(w => w.id !== workout.id));
                        }
                      } catch (error) {
                        console.error('Error deleting workout:', error);
                      }
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
} 
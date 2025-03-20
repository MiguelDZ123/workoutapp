'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useSession } from 'next-auth/react';
import { Dumbbell, Loader2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SavedWorkout {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function SavedWorkouts() {
  const { data: session } = useSession();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const handleEdit = (workout: SavedWorkout) => {
    setEditingId(workout.id);
    setEditTitle(workout.title);
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update title');
      }

      const data = await response.json();
      setWorkouts(workouts.map(w => 
        w.id === id ? { ...w, title: data.workout.title } : w
      ));
      setEditingId(null);
      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        const response = await fetch(`/api/workouts/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setWorkouts(workouts.filter(w => w.id !== id));
          toast.success('Workout deleted successfully');
        } else {
          throw new Error('Failed to delete workout');
        }
      } catch (error) {
        console.error('Error deleting workout:', error);
        toast.error('Failed to delete workout');
      }
    }
  };

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
              <div className="flex items-center justify-between mb-2">
                {editingId === workout.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSave(workout.id)}
                      className="p-1 text-green-500 hover:text-green-600"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-500 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{workout.title}</h3>
                    <button
                      onClick={() => handleEdit(workout)}
                      className="p-1 text-gray-500 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Saved on {new Date(workout.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push(`/protected/workout/${workout.id}`)}
                  className="text-sm bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  View Workout
                </button>
                <button
                  onClick={() => handleDelete(workout.id)}
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
'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useSession } from 'next-auth/react';
import { Loader2, FileDown, Trash2, ChevronRight, Pencil, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [editingTitle, setEditingTitle] = useState('');

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

  const handleEditClick = (workout: SavedWorkout) => {
    setEditingId(workout.id);
    setEditingTitle(workout.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditSave = async (id: string) => {
    if (!editingTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update workout');
      }

      setWorkouts(workouts.map(w => 
        w.id === id ? { ...w, title: editingTitle } : w
      ));
      toast.success('Workout name updated');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating workout:', error);
      toast.error('Failed to update workout name');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Saved workouts</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{workouts.length} workouts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="min-w-full">
            {/* Table Header - Hidden on mobile */}
            <div className="hidden sm:block border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-6 sm:col-span-4">Title</div>
                <div className="hidden sm:block col-span-3">Created</div>
                <div className="hidden sm:block col-span-3">Status</div>
                <div className="col-span-6 sm:col-span-2 text-right">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {workouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="grid grid-cols-12 items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-4 mb-2 sm:mb-0">
                    {editingId === workout.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(workout.id)}
                          className="p-1 text-green-500 hover:text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-gray-500 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <Link 
                          href={`/protected/workout/${workout.id}`}
                          className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white dark:hover:text-green-400"
                        >
                          {workout.title}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(workout)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(workout.id)}
                            className="sm:hidden p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Mobile-only date */}
                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Desktop-only columns */}
                  <div className="hidden sm:block col-span-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="hidden sm:block col-span-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                  <div className="hidden sm:flex col-span-2 items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {workouts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No saved workouts yet. Generate a workout to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 
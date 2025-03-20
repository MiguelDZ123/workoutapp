'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useSession } from 'next-auth/react';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { use } from 'react';

interface Workout {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = use(params);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch workout');
        }

        setWorkout(data.workout);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workout');
        toast.error('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchWorkout();
    }
  }, [id, session]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete workout');
      }

      toast.success('Workout deleted successfully');
      router.push('/protected/saved-workouts');
    } catch (err) {
      toast.error('Failed to delete workout');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!session?.user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please sign in</h1>
            <p className="text-gray-600 dark:text-gray-400">You need to be signed in to view this workout.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">Loading workout...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !workout) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Workout not found</h1>
            <p className="text-gray-600 dark:text-gray-400">{error || 'This workout could not be loaded.'}</p>
            <button
              onClick={() => router.push('/protected/saved-workouts')}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Back to Saved Workouts
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/protected/saved-workouts')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Saved Workouts
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center text-sm text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Workout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {workout.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {new Date(workout.createdAt).toLocaleDateString()}
          </p>
          
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{workout.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
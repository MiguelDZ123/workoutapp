'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useSession } from 'next-auth/react';
import {
  Loader2,
  ArrowLeft,
  Trash2,
  Target,
  AlertCircle,
  Dumbbell,
  BarChart,
  Timer,
  ScrollText,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Download,
  Clock,
  FileDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { use } from 'react';
import jsPDF from 'jspdf';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface DayWorkout {
  focus: string;
  exercises: Exercise[];
  notes: string;
}

interface WorkoutPlan {
  title: string;
  overview: string;
  weeklySchedule: {
    [key: string]: DayWorkout;
  };
  nutritionTips: string[];
}

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
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch workout');
        }

        setWorkout(data.workout);
        setWorkoutPlan(JSON.parse(data.workout.content));
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

  const handleDownload = async () => {
    if (!workoutPlan) return;

    setIsDownloading(true);
    try {
      const pdf = new jsPDF();

      // PDF Styling
      const titleFont = 16;
      const headingFont = 14;
      const normalFont = 12;
      const smallFont = 10;
      const lineHeight = 8;
      const margin = 20;
      let yPosition = margin;
      const pageWidth = pdf.internal.pageSize.width;

      // Helper function to add text with word wrap
      const addWrappedText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) {
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setFont('helvetica', 'normal');
        }

        const splitText = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        pdf.text(splitText, margin, y);
        return y + (splitText.length * lineHeight);
      };

      // Add Title and content
      yPosition = addWrappedText(workoutPlan.title, yPosition, titleFont, true);
      yPosition += lineHeight;

      if (workoutPlan.overview) {
        yPosition = addWrappedText(workoutPlan.overview, yPosition, normalFont);
        yPosition += lineHeight;
      }

      // Add workout schedule
      Object.entries(workoutPlan.weeklySchedule).forEach(([day, dayWorkout]) => {
        if (yPosition > pdf.internal.pageSize.height - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addWrappedText(day, yPosition, headingFont, true);
        yPosition += lineHeight / 2;

        dayWorkout.exercises.forEach((exercise, index) => {
          if (yPosition > pdf.internal.pageSize.height - 50) {
            pdf.addPage();
            yPosition = margin;
          }

          const exerciseText = `${index + 1}. ${exercise.name} - ${exercise.sets} sets × ${exercise.reps}`;
          yPosition = addWrappedText(exerciseText, yPosition, normalFont);
          yPosition += lineHeight / 2;
        });

        yPosition += lineHeight;
      });

      // Add nutrition tips
      if (workoutPlan.nutritionTips.length > 0) {
        if (yPosition > pdf.internal.pageSize.height - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addWrappedText('Nutrition Tips', yPosition, headingFont, true);
        yPosition += lineHeight / 2;
        workoutPlan.nutritionTips.forEach((tip, index) => {
          yPosition = addWrappedText(tip, yPosition, smallFont);
          yPosition += lineHeight;
        });
      }

      await pdf.save('workout-plan.pdf');
      toast.success('Workout plan downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download workout plan');
    } finally {
      setIsDownloading(false);
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

  if (error || !workout || !workoutPlan) {
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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{workoutPlan.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {isDeleting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <button onClick={handleDelete} disabled={isDeleting}><Trash2 className="w-4 h-4" /></button>
                </>
              )}
              {isDownloading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <button onClick={handleDownload} disabled={isDownloading}><FileDown className="w-4 h-4" /></button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-gray-600 dark:text-gray-300">{workoutPlan.overview}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(workoutPlan.weeklySchedule).map(([day, dayWorkout]) => (
            <div key={day} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleDay(day)}
                className="w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold capitalize text-left">{day}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{dayWorkout.focus}</span>
                    </div>
                  </div>
                </div>
                {expandedDay === day ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {expandedDay === day && (
                <div className="p-4">
                  <div className="space-y-4">
                    {dayWorkout.exercises.map((exercise, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{exercise.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <BarChart className="w-4 h-4 text-blue-500" />
                              <span>{exercise.sets} sets × {exercise.reps}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Timer className="w-4 h-4 text-purple-500" />
                            <span>{exercise.rest}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {dayWorkout.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-2">
                        <ScrollText className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{dayWorkout.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Nutrition Tips</h2>
          </div>
          <ul className="list-none space-y-3">
            {workoutPlan.nutritionTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <ArrowUpRight className="w-4 h-4 text-green-500 mt-1" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
} 
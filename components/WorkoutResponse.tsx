import { useState } from 'react';
import {
  Download,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Calendar,
  Clock,
  ArrowUpRight,
  AlertCircle,
  Save,
  Target,
  Flame,
  Timer,
  Apple,
  ScrollText,
  BarChart,
  FileDown
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import WorkoutPlanDisplay from './WorkoutPlanDisplay';

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

interface WorkoutResponseProps {
  content: WorkoutPlan;
}

export default function WorkoutResponse({ content }: WorkoutResponseProps) {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleSave = async () => {
    if (!session) {
      toast.error('Please sign in to save workouts');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/workouts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.title || 'Custom Workout Plan',
          content: JSON.stringify(content),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      toast.success('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Failed to save workout');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
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

      // Add Title
      yPosition = addWrappedText(content.title || 'Personalized Workout Plan', yPosition, titleFont, true);
      yPosition += lineHeight;

      // Add Overview
      if (content.overview) {
        yPosition = addWrappedText(content.overview, yPosition, normalFont);
        yPosition += lineHeight;
      }

      // Add Workout Days
      Object.entries(content.weeklySchedule).forEach(([day, dayWorkout]) => {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.height - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add Day Title
        yPosition = addWrappedText(day, yPosition, headingFont, true);
        yPosition += lineHeight / 2;

        // Add Exercises
        dayWorkout.exercises.forEach((exercise: Exercise, exerciseIndex: number) => {
          // Check if we need a new page
          if (yPosition > pdf.internal.pageSize.height - 50) {
            pdf.addPage();
            yPosition = margin;
          }

          const exerciseText = `${exerciseIndex + 1}. ${exercise.name} - ${exercise.sets} sets × ${exercise.reps}`;
          yPosition = addWrappedText(exerciseText, yPosition, normalFont);
          yPosition += lineHeight / 2;
        });

        yPosition += lineHeight;
      });

      // Add Tips Section
      if (content.nutritionTips.length > 0) {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.height - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addWrappedText('Nutrition Tips', yPosition, headingFont, true);
        yPosition += lineHeight / 2;
        content.nutritionTips.forEach((tip, index) => {
          yPosition = addWrappedText(tip, yPosition, smallFont);
          yPosition += lineHeight;
        });
      }

      // Add footer with date
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const today = new Date().toLocaleDateString();
      pdf.text(`Generated on ${today} by Workout.io`, margin, pdf.internal.pageSize.height - 10);

      await pdf.save('workout-plan.pdf');
      toast.success('Workout plan downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Downloading as text instead.');
      // Fallback to text download
      const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workout-plan.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border-gray-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{content.title}</h1>
          </div>
          {session &&
            <div className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <button onClick={handleSave} disabled={isSaving}><Save className="w-4 h-4" /></button>
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
          }
        </div>
        <div className="flex items-start gap-2">
          <p className="text-gray-600 dark:text-gray-300">{content.overview}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(content.weeklySchedule).map(([day, dayWorkout]) => (
          <div key={day} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleDay(day)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className='justify-items-start'>
                  <h3 className="text-lg font-semibold capitalize">{day}</h3>
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
          {content.nutritionTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <ArrowUpRight className="w-4 h-4 text-black-500 mt-1" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className='font-bold text-red-400'>Make sure you always consult a health professional before attempting these workouts or nutrition tips.</span>
    </div>
  );
} 
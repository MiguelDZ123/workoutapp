import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Dumbbell } from 'lucide-react';

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

interface WorkoutPlanDisplayProps {
  workout: WorkoutPlan;
}

export default function WorkoutPlanDisplay({ workout }: WorkoutPlanDisplayProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-2">{workout.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{workout.overview}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(workout.weeklySchedule).map(([day, dayWorkout]) => (
          <div key={day} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleDay(day)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div>
                <h3 className="text-lg font-semibold capitalize">{day}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dayWorkout.focus}</p>
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
                          <h4 className="font-medium">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exercise.sets} sets × {exercise.reps}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {exercise.rest}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {dayWorkout.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dayWorkout.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Nutrition Tips</h2>
        <ul className="list-disc list-inside space-y-2">
          {workout.nutritionTips.map((tip, index) => (
            <li key={index} className="text-gray-600 dark:text-gray-300">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 
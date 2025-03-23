'use client';

import { useState } from 'react';
import { Send, Info, Dumbbell, Calendar, ArrowRight, Paperclip, Mic } from 'lucide-react';
import WorkoutResponse from './WorkoutResponse';

export default function WorkoutGenerator() {
  const [prompt, setPrompt] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          fitnessLevel,
          workoutGoal
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workout plan');
      }

      const data = await response.json();
      setCurrentWorkout(data.workout);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (template: string) => {
    setPrompt(template);
  };

  const quickPrompts = [
    "I'm a beginner looking to build strength with minimal equipment at home.",
    "I want to lose weight and have access to a full gym.",
    "I need a workout plan for building muscle, I can go to the gym 5 days a week.",
    "I'm training for a 10k run and need a complementary strength routine."
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {!currentWorkout ? (
        // Initial features view
        <>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info size={18} className="text-green-500" />
              How to get the best results
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              For the most personalized workout plan, include details about:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <Dumbbell size={16} className="mt-0.5 text-green-500 flex-shrink-0" />
                <span>Your fitness level (beginner, intermediate, advanced)</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar size={16} className="mt-0.5 text-green-500 flex-shrink-0" />
                <span>How many days per week you can work out</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-0.5 text-green-500 flex-shrink-0" />
                <span>Your specific goals (weight loss, muscle gain, endurance)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-md font-medium mb-3">Try one of these prompts:</h3>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1.5 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <WorkoutResponse content={currentWorkout} />
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full mt-4">
        

        <div className="relative w-full">
          <div className="flex items-center w-full rounded-full ... border mt-8 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm px-4 py-2">
            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
            <textarea
              className="flex-grow bg-transparent border-none resize-none min-h-[24px] max-h-[120px] focus:outline-none focus:ring-0 py-1 px-3 text-sm"
              placeholder="Describe your fitness goals, experience level, available equipment..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={3000}
              rows={1}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {prompt.length}/3000
              </span>
              <button
                type="submit"
                className="ml-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!prompt.trim() || isGenerating}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 
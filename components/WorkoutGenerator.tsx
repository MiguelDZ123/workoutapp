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

  // Mock function to generate workout plans
  const generateWorkoutPlan = (userPrompt: string) => {
    // This would be replaced with actual AI API call
    const lowerPrompt = userPrompt.toLowerCase();

    if (lowerPrompt.includes('beginner')) {
      return `## Beginner Workout Plan\n\n### Monday - Full Body\n- Bodyweight Squats: 3 sets of 12 reps\n- Push-ups (or knee push-ups): 3 sets of 8-10 reps\n- Dumbbell Rows: 3 sets of 10 reps per arm\n- Plank: 3 sets, hold for 20-30 seconds\n\n### Wednesday - Cardio\n- 5 minute warm-up walk\n- 20 minutes of interval walking/jogging\n- 5 minute cool-down\n\n### Friday - Full Body\n- Lunges: 3 sets of 10 reps per leg\n- Dumbbell Shoulder Press: 3 sets of 10 reps\n- Glute Bridges: 3 sets of 12 reps\n- Bird-dogs: 3 sets of 8 reps per side`;
    } else if (lowerPrompt.includes('weight loss') || lowerPrompt.includes('lose weight')) {
      return `## Weight Loss Focused Workout Plan\n\n### Monday - HIIT\n- Warm-up: 5 minutes light cardio\n- Circuit (repeat 3 times):\n  - Jumping Jacks: 45 seconds\n  - Mountain Climbers: 45 seconds\n  - Burpees: 45 seconds\n  - Rest: 30 seconds\n- Cool-down: 5 minutes stretching\n\n### Tuesday - Strength\n- Goblet Squats: 3 sets of 15 reps\n- Push-ups: 3 sets of 12 reps\n- Dumbbell Rows: 3 sets of 12 reps per arm\n- Plank: 3 sets, hold for 45 seconds\n\n### Wednesday - Steady State Cardio\n- 30-45 minutes of walking, jogging, cycling, or swimming\n\n### Thursday - Rest or Light Activity\n\n### Friday - Full Body Circuit\n- Warm-up: 5 minutes\n- Circuit (repeat 3 times):\n  - Lunges: 12 reps per leg\n  - Dumbbell Shoulder Press: 12 reps\n  - Kettlebell Swings: 15 reps\n  - Bicycle Crunches: 20 reps\n  - Rest: 60 seconds\n\n### Saturday - Active Recovery\n- 30 minutes of yoga or light walking\n\n### Sunday - Rest`;
    } else if (lowerPrompt.includes('muscle') || lowerPrompt.includes('strength') || lowerPrompt.includes('build')) {
      return `## Muscle Building Workout Plan\n\n### Monday - Chest & Triceps\n- Bench Press: 4 sets of 8-10 reps\n- Incline Dumbbell Press: 3 sets of 10 reps\n- Chest Flyes: 3 sets of 12 reps\n- Tricep Pushdowns: 3 sets of 12 reps\n- Overhead Tricep Extensions: 3 sets of 12 reps\n\n### Tuesday - Back & Biceps\n- Deadlifts: 4 sets of 6-8 reps\n- Pull-ups or Lat Pulldowns: 4 sets of 8-10 reps\n- Barbell Rows: 3 sets of 10 reps\n- Barbell Curls: 3 sets of 10 reps\n- Hammer Curls: 3 sets of 12 reps\n\n### Wednesday - Rest or Light Cardio\n\n### Thursday - Legs\n- Squats: 4 sets of 8-10 reps\n- Romanian Deadlifts: 3 sets of 10 reps\n- Leg Press: 3 sets of 12 reps\n- Leg Extensions: 3 sets of 15 reps\n- Leg Curls: 3 sets of 15 reps\n- Calf Raises: 4 sets of 15-20 reps\n\n### Friday - Shoulders & Abs\n- Overhead Press: 4 sets of 8-10 reps\n- Lateral Raises: 3 sets of 12 reps\n- Face Pulls: 3 sets of 15 reps\n- Hanging Leg Raises: 3 sets of 12 reps\n- Planks: 3 sets of 45-60 seconds\n\n### Saturday - Active Recovery\n- Light cardio for 20-30 minutes\n\n### Sunday - Rest`;
    } else {
      return `## Custom Workout Plan\n\nBased on your request, here's a personalized workout plan:\n\n### Monday - Upper Body\n- Bench Press or Push-ups: 3 sets of 10-12 reps\n- Dumbbell Rows: 3 sets of 10-12 reps\n- Shoulder Press: 3 sets of 10-12 reps\n- Bicep Curls: 3 sets of 12 reps\n- Tricep Dips: 3 sets of 12 reps\n\n### Tuesday - Lower Body\n- Squats: 3 sets of 12 reps\n- Lunges: 3 sets of 10 reps per leg\n- Deadlifts: 3 sets of 10 reps\n- Calf Raises: 3 sets of 15 reps\n- Glute Bridges: 3 sets of 15 reps\n\n### Wednesday - Rest or Light Cardio\n\n### Thursday - Full Body\n- Dumbbell Thrusters: 3 sets of 12 reps\n- Renegade Rows: 3 sets of 10 reps per arm\n- Walking Lunges: 3 sets of 20 steps\n- Plank: 3 sets, hold for 45 seconds\n- Mountain Climbers: 3 sets of 20 reps\n\n### Friday - HIIT\n- 5 minute warm-up\n- 20 minutes of high-intensity interval training\n- 5 minute cool-down\n\n### Saturday - Active Recovery\n- Light walking, yoga, or stretching\n\n### Sunday - Rest`;
    }
  };

  const features = [
    {
      title: "Personalized Plans",
      description: "Get workouts tailored to your fitness level and goals",
      icon: "💪"
    },
    {
      title: "Nutrition Tips",
      description: "Receive dietary suggestions to complement your workouts",
      icon: "🥗"
    },
    {
      title: "Progress Tracking",
      description: "Track your fitness journey with detailed metrics",
      icon: "📈"
    },
    {
      title: "Exercise Library",
      description: "Access a vast database of exercises with proper form guides",
      icon: "📚"
    }
  ];

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
        {!currentWorkout && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <div>
              <label htmlFor="fitness-level" className="block text-sm font-medium mb-1">
                Fitness Level
              </label>
              <select
                id="fitness-level"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
              >
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="workout-goal" className="block text-sm font-medium mb-1">
                Primary Goal
              </label>
              <select
                id="workout-goal"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={workoutGoal}
                onChange={(e) => setWorkoutGoal(e.target.value)}
              >
                <option value="">Select your goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>
          </div>
        )}

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
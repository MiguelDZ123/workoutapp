'use client';

import { useState } from 'react';
import { Send, Info, Dumbbell, Calendar, ArrowRight, Download, MessageSquare } from 'lucide-react';
import WorkoutChat from './WorkoutChat';
import WorkoutFeatureCard from './WorkoutFeatureCard';
import WorkoutResponse from './WorkoutResponse';

export default function WorkoutGenerator() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const [currentWorkout, setCurrentWorkout] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Add user message to chat
    const newMessage = { role: 'user', content: prompt };
    setChatHistory([...chatHistory, newMessage]);
    
    setPrompt('');
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
      
      // Set the workout response separately
      setCurrentWorkout(data.workout);
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'ve generated a new workout plan for you! You can view it on the right.' 
      }]);
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
      {!chatHistory.length ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Chat Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              Chat History
            </h2>
            <WorkoutChat 
              messages={chatHistory} 
              isLoading={isGenerating} 
            />
          </div>

          {/* Workout Response Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell size={20} className="text-green-600" />
              Generated Workout Plan
            </h2>
            {currentWorkout ? (
              <WorkoutResponse content={currentWorkout} />
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Dumbbell className="text-green-600 dark:text-green-400" size={20} />
                      Your Workout Plan
                    </h3>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium mb-2">No workout plan generated yet</p>
                  <p className="text-sm text-gray-400">
                    Start chatting to generate your personalized workout plan
                  </p>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex flex-wrap gap-2 opacity-50">
                    <button disabled className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">
                      <Download size={14} />
                      Download Plan
                    </button>
                    {/* Add other disabled buttons */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Input - Move outside the grid to maintain full width */}
      <form onSubmit={handleSubmit} className="w-full mt-4">
        {!chatHistory.length && (
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
          <div className="flex items-center w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm px-4 py-3">
            <div className="flex items-center gap-2 mr-3">
              <button 
                type="button"
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <button 
                type="button"
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </button>
            </div>
            
            <textarea
              className="flex-grow bg-transparent border-none resize-none min-h-[24px] max-h-[120px] focus:outline-none focus:ring-0 py-0 px-0 text-sm"
              placeholder="Describe your fitness goals, experience level, available equipment..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={1}
            />
            
            <div className="flex items-center gap-3 ml-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {prompt.length}/3000
              </span>
              <button 
                type="submit" 
                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!prompt.trim() || isGenerating}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 
'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, ThumbsUp, ThumbsDown, Share2, ChevronDown, ChevronUp, Dumbbell, Calendar, Clock, ArrowUpRight } from 'lucide-react';

interface WorkoutChatProps {
  messages: Array<{role: string, content: string}>;
  isLoading: boolean;
}

export default function WorkoutChat({ messages, isLoading }: WorkoutChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDownload = (content: string) => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout-plan.md';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to format workout content with better structure
  const formatWorkoutContent = (content: string, index: number) => {
    const isExpanded = expandedSections[index] !== false; // Default to expanded
    
    // Check if this is a workout plan response
    const isWorkoutPlan = content.includes('Workout Plan') || 
                          content.includes('Weekly Schedule') || 
                          content.includes('Day 1');
    
    if (!isWorkoutPlan) {
      // For regular responses, just render the markdown
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }
    
    // For workout plans, create a more structured layout
    return (
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dumbbell className="text-green-600 dark:text-green-400" size={20} />
              Personalized Workout Plan
            </h3>
            <button 
              onClick={() => toggleSection(index)}
              className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-green-500" />
              <span>Complete Workout Schedule</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Clock size={14} className="text-green-500" />
              <span>With Rest Periods</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <ArrowUpRight size={14} className="text-green-500" />
              <span>Progression Guidelines</span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 overflow-auto max-h-[500px]">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          <button 
            onClick={() => handleDownload(content)}
            className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            <Download size={14} />
            Download Plan
          </button>
          <button className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <ThumbsUp size={14} />
            Helpful
          </button>
          <button className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <ThumbsDown size={14} />
            Not helpful
          </button>
          <button className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Share2 size={14} />
            Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-y-auto max-h-[600px] border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-6">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] ${
                message.role === 'user' 
                  ? 'bg-green-500 text-white p-4 rounded-lg rounded-tr-none' 
                  : ''
              }`}
            >
              {message.role === 'user' ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">You</span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-800 dark:text-green-300">AI</span>
                    </div>
                    <span className="text-sm font-medium">Workout AI</span>
                  </div>
                  
                  {formatWorkoutContent(message.content, index)}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[90%]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-800 dark:text-green-300">AI</span>
                </div>
                <span className="text-sm font-medium">Workout AI</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
    </div>
  );
} 
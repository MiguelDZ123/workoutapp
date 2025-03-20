import { useState } from 'react';
import { Download, ThumbsUp, ThumbsDown, Share2, ChevronDown, ChevronUp, Dumbbell, Calendar, Clock, ArrowUpRight, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

interface WorkoutResponseProps {
  content: string;
}

export default function WorkoutResponse({ content }: WorkoutResponseProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse the workout content into structured data
  const parseWorkoutContent = (content: string) => {
    const sections = content.split('\n\n');
    const workoutPlan = {
      title: '',
      overview: '',
      days: [] as any[],
      nutrition: '',
      tips: ''
    };

    let currentDay: any = null;
    
    sections.forEach(section => {
      if (section.includes('# ')) {
        workoutPlan.title = section.replace('# ', '').trim();
      } else if (section.toLowerCase().includes('day')) {
        currentDay = {
          title: section.split('\n')[0].trim(),
          exercises: [],
          notes: ''
        };
        
        const lines = section.split('\n').slice(1);
        lines.forEach(line => {
          if (line.startsWith('-')) {
            const exercise = line.replace('- ', '').trim();
            currentDay.exercises.push(exercise);
          } else if (line.trim() !== '') {
            currentDay.notes += line.trim() + '\n';
          }
        });
        
        if (currentDay) {
          workoutPlan.days.push(currentDay);
        }
      } else if (section.toLowerCase().includes('nutrition')) {
        workoutPlan.nutrition = section.split('\n').slice(1).join('\n').trim();
      } else if (section.toLowerCase().includes('tips') || section.toLowerCase().includes('guidelines')) {
        workoutPlan.tips = section.split('\n').slice(1).join('\n').trim();
      } else if (!workoutPlan.overview && section.trim()) {
        workoutPlan.overview = section.trim();
      }
    });

    return workoutPlan;
  };

  const workoutPlan = parseWorkoutContent(content);

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
      yPosition = addWrappedText(workoutPlan.title || 'Personalized Workout Plan', yPosition, titleFont, true);
      yPosition += lineHeight;

      // Add Overview
      if (workoutPlan.overview) {
        yPosition = addWrappedText(workoutPlan.overview, yPosition, normalFont);
        yPosition += lineHeight;
      }

      // Add Workout Days
      workoutPlan.days.forEach((day, index) => {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.height - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add Day Title
        yPosition = addWrappedText(day.title, yPosition, headingFont, true);
        yPosition += lineHeight/2;

        // Add Exercises
        day.exercises.forEach((exercise: string, exerciseIndex: number) => {
          // Check if we need a new page
          if (yPosition > pdf.internal.pageSize.height - 50) {
            pdf.addPage();
            yPosition = margin;
          }
          
          const exerciseText = `${exerciseIndex + 1}. ${exercise}`;
          yPosition = addWrappedText(exerciseText, yPosition, normalFont);
          yPosition += lineHeight/2;
        });

        yPosition += lineHeight;
      });

      // Add Tips Section
      if (workoutPlan.tips) {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.height - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addWrappedText('Tips & Guidelines', yPosition, headingFont, true);
        yPosition += lineHeight/2;
        yPosition = addWrappedText(workoutPlan.tips, yPosition, smallFont);
        yPosition += lineHeight;
      }

      // Add Nutrition Section
      if (workoutPlan.nutrition) {
        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.height - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addWrappedText('Nutrition Recommendations', yPosition, headingFont, true);
        yPosition += lineHeight/2;
        yPosition = addWrappedText(workoutPlan.nutrition, yPosition, smallFont);
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
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workout-plan.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-4 h-[calc(100vh-200px)]">
      <div className="flex flex-col h-full">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 border-b border-green-100 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Dumbbell className="text-green-600 dark:text-green-400" size={20} />
              Your Workout Plan
            </h3>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Calendar size={14} className="text-green-500" />
              <span>{workoutPlan.days.length}-Day Plan</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <Clock size={14} className="text-green-500" />
              <span>With Rest Periods</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              <ArrowUpRight size={14} className="text-green-500" />
              <span>Progressive</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isExpanded && (
            <div className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download PDF</span>
                </>
              )}
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
      </div>
    </div>
  );
} 
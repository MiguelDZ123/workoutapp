interface WorkoutFeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function WorkoutFeatureCard({ title, description, icon }: WorkoutFeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <div className="mt-auto pt-3">
        <span className="inline-block text-xs font-medium text-green-600 dark:text-green-400 hover:underline cursor-pointer">
          Learn more
        </span>
      </div>
    </div>
  );
} 
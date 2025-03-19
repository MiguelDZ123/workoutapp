import WorkoutGenerator from "@/components/WorkoutGenerator";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full mb-3">
          AI-Powered Fitness
        </span>
        <h1 className="text-4xl font-bold mb-4">Fitness Plan Generator</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Describe your fitness needs and goals, and our generator will create a personalized workout plan tailored just for you.
        </p>
      </div>
      
      <WorkoutGenerator />
    </Layout>
  );
}

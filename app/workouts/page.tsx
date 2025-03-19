import Layout from "@/components/Layout";

export default function Workouts() {
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Workout Library</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse our collection of pre-designed workout plans for different fitness levels and goals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Example workout cards */}
        {['Beginner Strength', 'Weight Loss', 'Muscle Building', 'HIIT Training'].map((title, index) => (
          <div key={index} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              A {title.toLowerCase()} program designed for optimal results.
            </p>
            <button className="text-sm bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors">
              View Plan
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
} 
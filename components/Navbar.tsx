import Link from 'next/link';

const Navbar = () => {
  const session = true; // Replace with actual session check

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-auto">
              {/* Logo */}
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {session && (
                  <Link
                    href="/my-workouts"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Workouts
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
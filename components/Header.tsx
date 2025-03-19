import Link from "next/link";
import { Search, Home, Zap, Target, Settings, User } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-3 px-2 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold">WORKOUT.IO</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link 
            href="/workouts" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            <Zap size={18} />
            <span>Workouts</span>
          </Link>
          
          <Link 
            href="/nutrition" 
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            <Target size={18} />
            <span>Goals</span>
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-full focus:outline-none w-[180px] md:w-[220px]"
          />
          <Search size={16} className="absolute left-3 text-gray-500 outline-none" />
        </div>
        
        <Link 
          href="/settings" 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings size={20} className="text-gray-700 dark:text-gray-300" />
        </Link>
        
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
          <User size={16} />
        </button>
      </div>
    </header>
  );
} 
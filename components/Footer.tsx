import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 pt-4">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">WORKOUT.IO © 2025</span>
        </div>
        
        <div className="flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
          <Link
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
} 
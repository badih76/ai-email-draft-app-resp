"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { EllipsisVertical, X, LogOut } from 'lucide-react';
import navLinks from "@/data/navLinks.json";

interface DashboardSidebarProps {
  user: any; // Using any for simplicity
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Overlay for mobile
  const Overlay = () => (
    <div
      className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={() => setIsOpen(false)}
    />
  );

  return (
    <>
      <Overlay />



      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 md:w-52 
        bg-white dark:bg-gray-800 
        shadow-xl md:shadow-md 
        flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-60 md:translate-x-0"}
        pt-16 md:pt-0 /* Add padding on mobile to account for fixed header/trigger */
      `}>


        {/* Mobile Toggle Button (Attached) */}
        <div className="w-full flex justify-end md:hidden">
          <button
            onClick={toggleSidebar}
            className="md:hidden bg-indigo-600 text-white w-4 pt-2 pb-2
              rounded-r-md shadow-lg hover:bg-indigo-700 transition-colors text-right"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <X size={18} /> : <EllipsisVertical size={18} />}
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={{
                  pathname: item.href,
                  query: { userId: user.id }
                }}
                onClick={() => setIsOpen(false)}
                className={`flex items-center p-3 rounded-lg transition-colors duration-150 group
                  ${isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                    : "text-indigo-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                  }
                `}
              >
                <DynamicIcon name={item.icon as IconName} className={`w-5 h-5 mr-3 ${isActive ? "text-indigo-700" : "text-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"}`} />
                <span className="font-semibold">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <a
            href="/api/auth/logout"
            className="flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 mt-1 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            <span className="font-semibold text-red-500">Log Out</span>
          </a>
        </div>
      </aside>
    </>
  );
}
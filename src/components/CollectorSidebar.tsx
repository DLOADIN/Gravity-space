import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Palette,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function CollectorSidebar() {
  const location = useLocation();
  const { signout } = useAuth();

  const menuItems = [
    {
      path: '/collector-dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/collector-categories',
      icon: FolderOpen,
      label: 'Categories'
    },
    {
      path: '/collector-artists',
      icon: Users,
      label: 'Artists'
    },
    {
      path: '/collector-artworks',
      icon: Palette,
      label: 'Artworks'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Collector Panel</h2>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={signout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
} 
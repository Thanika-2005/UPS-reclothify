'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Reclothify Logistics
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/donate" className="text-gray-600 hover:text-gray-900">
              Donate
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/business/logistics" className="text-gray-600 hover:text-gray-900">
              Logistics
            </Link>
            <Link href="/fleet" className="text-gray-600 hover:text-gray-900">
              Fleet
            </Link>
            <Link href="/tracking" className="text-gray-600 hover:text-gray-900">
              Tracking
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

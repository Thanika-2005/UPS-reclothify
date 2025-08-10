'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Please Log In</h1>
        <p className="text-gray-600">You need to be logged in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">My Donations</h3>
            <p className="text-blue-600">Track your clothing donations</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Impact Report</h3>
            <p className="text-green-600">See your environmental impact</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Account Settings</h3>
            <p className="text-purple-600">Manage your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirm: '', 
    phone: '', 
    address: '', 
    userType: 'customer' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      await register({ 
        ...form, 
        userType: form.userType as 'customer' | 'business' 
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white px-8 py-6 shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            placeholder="Full Name" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            disabled={loading}
          />
          
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            type="email" 
            placeholder="Email Address" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            disabled={loading}
          />
          
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            placeholder="Phone Number" 
            value={form.phone} 
            onChange={e => setForm({ ...form, phone: e.target.value })} 
            disabled={loading}
          />
          
          <textarea 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            placeholder="Address" 
            rows={2}
            value={form.address} 
            onChange={e => setForm({ ...form, address: e.target.value })} 
            disabled={loading}
          />
          
          <select 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            value={form.userType} 
            onChange={e => setForm({ ...form, userType: e.target.value })}
            disabled={loading}
          >
            <option value="customer">Customer</option>
            <option value="business">Business</option>
          </select>
          
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            type="password" 
            placeholder="Password (min 6 characters)" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            disabled={loading}
            minLength={6}
          />
          
          <input 
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500" 
            required 
            type="password" 
            placeholder="Confirm Password" 
            value={form.confirm} 
            onChange={e => setForm({ ...form, confirm: e.target.value })} 
            disabled={loading}
            minLength={6}
          />
          
          <button 
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-bold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}

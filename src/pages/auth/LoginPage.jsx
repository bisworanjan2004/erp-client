import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, LogIn, School } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-indigo-600 p-12 text-white justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <School size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">School ERP</span>
        </div>
        
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Everything you need <br />
            to manage your school.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            The all-in-one platform for operations, administration, communication, and more. 
            Streamline your workflow today.
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-indigo-200 text-sm">Efficiency</p>
          </div>
          <div className="w-px h-8 bg-indigo-400"></div>
          <div>
            <p className="text-2xl font-bold">24/7</p>
            <p className="text-indigo-200 text-sm">Support</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="flex items-center space-x-3 text-indigo-600">
              <School size={32} />
              <span className="text-2xl font-bold tracking-tight">School ERP</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  placeholder="name@school.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account? <a href="#" className="font-semibold text-indigo-600">Contact admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-3.5rem)]">
      <motion.div 
        layout
        className="w-full max-w-md bg-[#151F2E]/90 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <h1 className="text-2xl font-bold text-white mb-2">Welcome Back 👋</h1>
                  <p className="text-[#a1a1aa] text-sm">Sign in to your AniWorld account to stream seamlessly.</p>
                </div>
                
                {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-end mb-1">
                      <a href="#" className="text-xs font-medium text-primary hover:brightness-125 transition-all">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="........" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-[#0B0C0F] font-bold rounded-md py-3 flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                    <LogIn size={18} />
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-4">
                  <div className="h-px bg-gray-700/50 flex-1"></div>
                  <span className="text-[#a1a1aa] text-xs font-medium uppercase tracking-wider">OR</span>
                  <div className="h-px bg-gray-700/50 flex-1"></div>
                </div>

                <div className="mt-6">
                  <button type="button" onClick={handleGoogleAuth} disabled={loading} className="w-full bg-transparent border border-gray-700 hover:border-gray-500 hover:bg-white/5 text-white font-medium rounded-md py-3 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-[#a1a1aa]">
                  Don't have an account?{' '}
                  <button onClick={toggleMode} disabled={loading} className="text-primary font-bold hover:brightness-125 transition-all">
                    Sign Up
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
                  <p className="text-[#a1a1aa] text-sm">Sign up with your username and email to get started.</p>
                </div>
                
                {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Username <span className="text-primary">(Required Handle)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="sonava_official" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Email Address <span className="text-primary">(Required Email)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@domain.com" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Password <span className="text-primary">(Minimum 8 characters)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="........" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">
                      Confirm Password <span className="text-primary">(Must match password)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="........" 
                        className="w-full bg-black/50 border border-gray-700/80 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-primary text-[#0B0C0F] font-bold rounded-md py-3 flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    <span>{loading ? 'Signing Up...' : 'Sign Up'}</span>
                    <UserPlus size={18} />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#a1a1aa]">
                  Already have an account?{' '}
                  <button onClick={toggleMode} disabled={loading} className="text-primary font-bold hover:brightness-125 transition-all">
                    Sign In
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

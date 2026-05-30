import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaBalanceScale, FaUserLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// Import your live configuration tools
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email format (e.g., name@domain.com).' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required.' })
    .min(6, { message: 'Security password must be at least 6 characters long.' })
});

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data) => {
    setAuthError('');
    
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      if (typeof setIsAuthenticated === 'function') {
        setIsAuthenticated(true);
      }
      navigate('/Dashboard');
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('Authentication failed. Invalid email or password.');
      } else if (error.code === 'auth/too-many-requests') {
        setAuthError('Access temporarily blocked due to too many failed attempts. Try again later.');
      } else {
        setAuthError('Unable to securely reach authentication server. Check network.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans text-slate-800">
      {/* Background Decorative Ambient Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#0d233a]/5 blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#00a896]/10 blur-[80px] sm:blur-[120px] pointer-events-none" />
      
      {/* Container Card */}
      <div className="bg-[#ffffff] p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200/60 w-full max-w-md z-10 dynamic-card">
        
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-[#00a896] text-3xl mb-4 shadow-sm">
            <FaBalanceScale />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0d233a] tracking-wide">JurisAI</h1>
          <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-widest font-semibold">Legal Assistant Portal</p>
        </div>

        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-semibold">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <input 
              type="text" 
              {...register('email')}
              placeholder="developer@indiaspan.com"
              className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-[#0d233a] text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                errors.email 
                  ? 'border-rose-400 focus:ring-1 focus:ring-rose-400/30' 
                  : 'border-slate-200 focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]/30'
              }`}
            />
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1.5 pl-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Access Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                {...register('password')}
                placeholder="••••••••"
                className={`w-full bg-slate-50/50 border rounded-xl pl-4 pr-12 py-3 text-[#0d233a] text-sm placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
                  errors.password 
                    ? 'border-rose-400 focus:ring-1 focus:ring-rose-400/30' 
                    : 'border-slate-200 focus:border-[#00a896] focus:ring-1 focus:ring-[#00a896]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1.5 pl-1 font-medium">{errors.password.message}</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00a896] hover:bg-teal-600 disabled:bg-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 mt-2 text-sm select-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FaUserLock className="text-xs" /> Initialize Portal
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/Signup" className="text-[#00a896] font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 text-center text-[11px] text-slate-400 tracking-wide font-medium">
          IndiaSpan Company Training Project Module
        </div>

      </div>
    </div>
  );
}
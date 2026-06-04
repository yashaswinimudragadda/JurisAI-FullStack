import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaBalanceScale, FaUserLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { auth, loginWithGoogle } from '../Firebase/firebase'; // Added loginWithGoogle import
import { signInWithEmailAndPassword } from 'firebase/auth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email format.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' })
});

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Handler for Email/Password
  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate('/Dashboard');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Handler for Google
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      if (setIsAuthenticated) setIsAuthenticated(true);
      navigate('/Dashboard');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-base text-text-main flex flex-col justify-center items-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-3xl border border-text-main/10 bg-text-main/5 backdrop-blur-xl shadow-xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-text-main/5 border border-text-main/10 text-accent text-3xl mb-4">
            <FaBalanceScale />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter">JURIS<span className="text-accent">AI</span></h1>
          <p className="text-text-main/60 text-xs uppercase tracking-widest font-semibold mt-1">Legal Assistant Portal</p>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-3.5 mb-6 flex items-center justify-center gap-3 bg-text-main/5 hover:bg-text-main/10 border border-text-main/10 rounded-xl font-semibold transition-all"
        >
          <FaGoogle className="text-accent" /> Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6 text-xs text-text-main/40 uppercase tracking-widest">
          <div className="h-px flex-1 bg-text-main/10" /> OR <div className="h-px flex-1 bg-text-main/10" />
        </div>

        {authError && <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-semibold">{authError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('email')} placeholder="Email Address" className="w-full p-3 rounded-xl bg-text-main/5 border border-text-main/10 outline-none focus:ring-2 ring-accent transition-all" />
          {errors.email && <p className="text-red-500 text-[10px] pl-1">{errors.email.message}</p>}

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Access Password" className="w-full p-3 rounded-xl bg-text-main/5 border border-text-main/10 outline-none focus:ring-2 ring-accent transition-all pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-accent">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] pl-1">{errors.password.message}</p>}
          
          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all mt-2 flex items-center justify-center gap-2">
            {isSubmitting ? "Authenticating..." : <><FaUserLock /> Initialize Portal</>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-main/60">
          Need an account? <Link to="/Signup" className="text-accent font-bold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
    </>
  );
}
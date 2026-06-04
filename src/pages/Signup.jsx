import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaBalanceScale, FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../Firebase/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const signupSchema = z.object({
  email: z.string().nonempty({ message: 'Email address is required.' }).email({ message: 'Please enter a valid email format.' }),
  password: z.string().nonempty({ message: 'Password is required.' }).min(6, { message: 'Password must be at least 6 characters long.' }),
  confirmPassword: z.string().nonempty({ message: 'Please confirm your security password.' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], 
});

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema), 
    mode: 'onTouched'
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMessage('');
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      await signOut(auth);
      setSuccessMessage('Account registered successfully! Redirecting...');
      setTimeout(() => navigate('/Login'), 2200);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') setAuthError('Email already in use.');
      else setAuthError('Authentication server unreachable.');
    }
  };

  return (
    // Applied 'bg-base' and 'text-text-main' for theme compatibility
    <div className="min-h-screen bg-base text-text-main flex flex-col justify-center items-center px-4 transition-colors duration-300">
      
      {/* Container - uses 'bg-text-main/5' to adapt colors based on theme */}
      <div className="w-full max-w-md p-8 rounded-3xl border border-text-main/10 bg-text-main/5 backdrop-blur-xl shadow-xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-text-main/5 border border-text-main/10 text-accent text-3xl mb-4">
            <FaBalanceScale />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter">JURIS<span className="text-accent">AI</span></h1>
          <p className="text-text-main/60 text-xs uppercase tracking-widest font-semibold mt-1">Create Assistant Account</p>
        </div>

        {authError && <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-semibold">{authError}</div>}
        {successMessage && <div className="mb-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs text-center font-semibold">{successMessage}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <input {...register('email')} placeholder="Email Address" className="w-full p-3 rounded-xl bg-text-main/5 border border-text-main/10 outline-none focus:ring-2 ring-accent transition-all" />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Access Password" className="w-full p-3 rounded-xl bg-text-main/5 border border-text-main/10 outline-none focus:ring-2 ring-accent transition-all pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-accent transition-colors">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" className="w-full p-3 rounded-xl bg-text-main/5 border border-text-main/10 outline-none focus:ring-2 ring-accent transition-all" />
            {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.confirmPassword.message}</p>}
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg mt-2">
            {isSubmitting ? "Registering..." : "Register Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-main/60">
          Already have verified access? <Link to="/Login" className="text-accent font-bold hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
}
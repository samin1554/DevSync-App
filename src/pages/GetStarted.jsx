import React, { useState, useEffect } from "react";
import { FileCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../backend/supabase-back';

export default function GetStarted() {

    const [IsValid, setIsValid] = useState(false);
    const [IsLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [gettingStarted, setGettingStarted] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: "",
        termsAccepted: false,
        newsletterSubscribed: false
    });

    const navigate = useNavigate(); // React Router navigation hook

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function handleValid(){
        const {
            firstname,
            lastname,
            email,
            password,
            confirm_password,
            termsAccepted
          } = gettingStarted;

          if (
            firstname.trim() !== "" &&
            lastname.trim() !== "" &&
            emailRegex.test(email) &&
            password.length >= 8 &&
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password) &&
            confirm_password === password &&
            termsAccepted
          ) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
    }

    // Run validation whenever form data changes
    useEffect(() => {
        handleValid();
    }, [gettingStarted]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setGettingStarted((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (IsValid) {
            setIsLoading(true);
            setError('');
            // Supabase sign-up with email and password
            const { /* data, */ error } = await supabase.auth.signUp({
                email: gettingStarted.email,
                password: gettingStarted.password,
            });
            setIsLoading(false);
            if (error) {
                setError(error.message);
                return;
            }
            // Use React Router navigation for redirect
            navigate('/dashboard'); // Redirect to dashboard after sign up
        }
    };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <FileCheck/>
            <h1 className="text-3xl font-bold text-base-content">Sign Up</h1>
            <p className="text-base-content/70 mt-2">Create your account to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="John" 
                  className="input input-bordered w-full" 
                  required 
                  name="firstname"
                  value={gettingStarted.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="input input-bordered w-full" 
                  required 
                  name="lastname"
                  value={gettingStarted.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input 
                  type="email" 
                  className="grow" 
                  placeholder="mail@site.com" 
                  required 
                  name="email"
                  value={gettingStarted.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  type="password" 
                  className="grow" 
                  placeholder="Enter password" 
                  required 
                  name="password"
                  value={gettingStarted.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  type="password" 
                  className="grow" 
                  placeholder="Confirm password" 
                  required 
                  name="confirm_password"
                  value={gettingStarted.confirm_password}
                  onChange={handleChange}
                />
              </label>
            </div>

            {/* Terms and Conditions */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  required 
                  name="termsAccepted"
                  checked={gettingStarted.termsAccepted}
                  onChange={handleChange}
                />
                <span className="label-text">
                  I agree to the{" "}
                  <a href="#" className="link link-primary">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="link link-primary">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Newsletter Subscription */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-secondary" 
                  name="newsletterSubscribed"
                  checked={gettingStarted.newsletterSubscribed}
                  onChange={handleChange}
                />
                <span className="label-text">
                  Subscribe to our newsletter for updates and special offers
                </span>
              </label>
            </div>

            {/* Show error message if any */}
            {error && (
              <div className="alert alert-error mb-2 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={!IsValid || IsLoading}
              >
                {IsLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">OR</div>

          {/* Social Login */}
          <div className="space-y-3">
            <button type="button" className="btn btn-outline w-full">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="btn btn-outline w-full">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to="/signIn" className="link link-primary font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




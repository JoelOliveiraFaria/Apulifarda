'use client';

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullname
                }
            }
        });

        if(error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    }

    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Create an Account</h1>
                    <p className="text-gray-500">Join Apulifarda</p>
                </div>

                {success ? (
                    <div className="bg-green-50 text-green-800 p-6 rounded-md text-center border border-green-200">
                        <h2 className="text-xl font-bold mb-2">Registration Successful</h2>
                        <p className="mb-4">You can now sign in with your credentials.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-900 text-white px-4 py-2 rounded font-bold hover:bg-blue-800"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                            <input 
                                type="text"
                                required
                                value={fullname}
                                onChange={(e) => (setFullname(e.target.value))}
                                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => (setEmail(e.target.value))}
                                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password"
                                required
                                value={password}
                                minLength={6}
                                onChange={(e) => (setPassword(e.target.value))}
                                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="At least 6 caracters"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-800 transition disabled:opacity-70"
                        >
                            {loading ? 'Creating Account' : 'Create Account'}
                        </button>
                    </form>
                )}

                {!success && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:underline font-semibold">
                            Sign in here
                        </a>
                    </div>
                )}
                
            </div>
        </main>
    );
}
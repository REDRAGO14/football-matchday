'use client';

import { useState, useEffect, createElement } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const email = window.prompt('Enter test email to receive magic link:');
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) window.alert(`Error signing in: ${error.message}`);
    else window.alert('Check your email for the login link!');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return createElement('div', { className: 'text-sm text-gray-500' }, 'Loading session...');
  }

  return createElement(
    'div',
    { className: 'flex items-center gap-4' },
    user
      ? createElement(
          'div',
          { className: 'flex items-center gap-3' },
          createElement(
            'span',
            { className: 'text-sm font-medium text-gray-700' },
            user.email
          ),
          createElement(
            'button',
            {
              onClick: handleSignOut,
              className: 'px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition',
            },
            'Sign Out'
          )
        )
      : createElement(
          'button',
          {
            onClick: handleSignIn,
            className: 'px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition',
          },
          'Sign In / Register'
        )
  );
}
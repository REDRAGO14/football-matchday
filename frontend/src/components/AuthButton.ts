'use client';

import { useState, useEffect, createElement, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom inline form state (replaces window.prompt)
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check initial auth state
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setAuthStatus('Sending magic link...');
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setAuthStatus(`Error: ${error.message}`);
    } else {
      setAuthStatus('Magic link sent! Check your email inbox.');
      setEmail('');
      setShowEmailInput(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthStatus(null);
  };

  if (loading) {
    return createElement('div', { className: 'text-sm text-gray-500' }, 'Loading session...');
  }

  const authContent = user
    ? createElement(
        'div',
        { className: 'flex items-center gap-3' },
        createElement('span', { className: 'text-sm font-medium text-gray-700' }, user.email),
        createElement(
          'button',
          {
            onClick: handleSignOut,
            className:
              'px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition',
          },
          'Sign Out'
        )
      )
    : createElement(
        'div',
        null,
        !showEmailInput
          ? createElement(
              'button',
              {
                onClick: () => setShowEmailInput(true),
                className:
                  'px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm',
              },
              'Sign In / Register'
            )
          : createElement(
              'form',
              {
                onSubmit: handleSignIn,
                className: 'flex items-center gap-2',
              },
              createElement('input', {
                type: 'email',
                required: true,
                placeholder: 'enter email...',
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                className:
                  'px-3 py-1.5 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
              }),
              createElement(
                'button',
                {
                  type: 'submit',
                  className:
                    'px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition',
                },
                'Send Link'
              ),
              createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setShowEmailInput(false),
                  className: 'px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700',
                },
                'Cancel'
              )
            )
      );

  return createElement(
    'div',
    { className: 'flex flex-col items-end gap-2' },
    createElement('div', { className: 'flex items-center gap-4' }, authContent),
    authStatus
      ? createElement('span', { className: 'text-xs font-medium text-blue-600' }, authStatus)
      : null
  );
}
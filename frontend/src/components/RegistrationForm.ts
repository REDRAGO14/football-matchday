'use client';

import React, { useState } from 'react';

interface RegistrationFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function RegistrationForm({ userId, onSuccess }: RegistrationFormProps) {
  const [team, setTeam] = useState<'student' | 'staff'>('student');
  const [position, setPosition] = useState<'GK' | 'DEF' | 'MID' | 'FWD'>('MID');
  const [squadNumber, setSquadNumber] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${apiUrl}/api/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          team,
          position,
          squadNumber: squadNumber ? parseInt(squadNumber, 10) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit registration');
      }

      if (data.success) {
        const feedbackType = data.status === 'waitlisted' ? 'warning' : 'success';
        setFeedback({
          type: feedbackType,
          message: data.message,
        });
        if (onSuccess) onSuccess();
      } else {
        setFeedback({
          type: 'error',
          message: data.message,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const feedbackClass = feedback
    ? feedback.type === 'success'
      ? 'p-4 mb-6 rounded-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200'
      : feedback.type === 'warning'
        ? 'p-4 mb-6 rounded-lg text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200'
        : 'p-4 mb-6 rounded-lg text-sm font-medium bg-red-50 text-red-800 border border-red-200'
    : '';

  return React.createElement(
    'div',
    { className: 'w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100' },
    React.createElement('h2', { className: 'text-xl font-bold text-gray-900 mb-1' }, 'Matchday Registration'),
    React.createElement('p', { className: 'text-sm text-gray-500 mb-6' }, 'Select your squad and position to secure your place.'),
    feedback && React.createElement('div', { className: feedbackClass }, feedback.message),
    React.createElement(
      'form',
      { onSubmit: handleSubmit, className: 'space-y-5' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { className: 'block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2' },
          'Select Squad'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-3' },
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setTeam('student'),
              className: `py-2.5 px-4 rounded-lg text-sm font-semibold transition border ${
                team === 'student'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`,
            },
            'Student XI'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setTeam('staff'),
              className: `py-2.5 px-4 rounded-lg text-sm font-semibold transition border ${
                team === 'staff'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`,
            },
            'Staff XI'
          )
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { className: 'block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2' },
          'Position'
        ),
        React.createElement(
          'select',
          {
            value: position,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
              setPosition(e.target.value as 'GK' | 'DEF' | 'MID' | 'FWD'),
            className: 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none',
          },
          React.createElement('option', { value: 'GK' }, 'Goalkeeper (GK)'),
          React.createElement('option', { value: 'DEF' }, 'Defender (DEF)'),
          React.createElement('option', { value: 'MID' }, 'Midfielder (MID)'),
          React.createElement('option', { value: 'FWD' }, 'Forward (FWD)')
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'label',
          { className: 'block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2' },
          'Preferred Squad Number (Optional)'
        ),
        React.createElement('input', {
          type: 'number',
          min: 1,
          max: 99,
          placeholder: 'e.g. 10',
          value: squadNumber,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSquadNumber(e.target.value),
          className: 'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        })
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          disabled: loading,
          className: 'w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition shadow-sm',
        },
        loading ? 'Submitting...' : 'Register for Match'
      )
    )
  );
}
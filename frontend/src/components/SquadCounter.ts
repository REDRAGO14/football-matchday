'use client';

import React, { useState, useEffect } from 'react';

interface SquadStats {
  studentCount: number;
  staffCount: number;
  maxCap: number;
}

interface StatCardProps {
  title: string;
  count: number;
  maxCap: number;
  badgeClass: string;
  fillClass: string;
  percent: number;
}

function StatCard({ title, count, maxCap, badgeClass, fillClass, percent }: StatCardProps) {
  return React.createElement(
    'div',
    { className: 'p-5 bg-white border border-gray-100 rounded-xl shadow-sm' },
    React.createElement(
      'div',
      { className: 'flex justify-between items-center mb-2' },
      React.createElement('h3', { className: 'font-bold text-gray-900' }, title),
      React.createElement(
        'span',
        { className: `text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}` },
        `${count} / ${maxCap} Filled`
      )
    ),
    React.createElement(
      'div',
      { className: 'w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-3' },
      React.createElement('div', {
        className: `h-full transition-all duration-500 ${percent >= 100 ? 'bg-amber-500' : fillClass}`,
        style: { width: `${percent}%` },
      })
    ),
    React.createElement(
      'p',
      { className: 'text-xs text-gray-500 mt-2' },
      count >= maxCap
        ? '⚠️ Squad full — New registrations will go to waitlist.'
        : `${maxCap - count} starting spots available.`
    )
  );
}

export default function SquadCounter() {
  const [stats, setStats] = useState<SquadStats>({
    studentCount: 0,
    staffCount: 0,
    maxCap: 18,
  });
  const [loading, setLoading] = useState(true);

  const fetchSquadStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/v1/squad-stats`, { cache: 'no-store' });

      if (!res.ok) throw new Error('Failed to fetch squad stats');

      const data: SquadStats = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch squad stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSquadStats();
  }, []);

  const getPercentage = (count: number) => Math.min(100, Math.round((count / stats.maxCap) * 100));

  if (loading) {
    return React.createElement(
      'div',
      { className: 'w-full grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse' },
      React.createElement('div', { className: 'h-28 bg-gray-200 rounded-xl' }),
      React.createElement('div', { className: 'h-28 bg-gray-200 rounded-xl' })
    );
  }

  const studentPct = getPercentage(stats.studentCount);
  const staffPct = getPercentage(stats.staffCount);

  return React.createElement(
    'div',
    { className: 'w-full grid grid-cols-1 md:grid-cols-2 gap-4' },
    React.createElement(StatCard, {
      title: 'Student XI Squad',
      count: stats.studentCount,
      maxCap: stats.maxCap,
      badgeClass: 'bg-blue-50 text-blue-700',
      fillClass: 'bg-blue-600',
      percent: studentPct,
    }),
    React.createElement(StatCard, {
      title: 'Staff XI Squad',
      count: stats.staffCount,
      maxCap: stats.maxCap,
      badgeClass: 'bg-purple-50 text-purple-700',
      fillClass: 'bg-purple-600',
      percent: staffPct,
    })
  );
}
'use client';

import { useState } from 'react';
import AuthButton from '@/components/AuthButton';
import RegistrationForm from '@/components/RegistrationForm';
import SquadCounter from '@/components/SquadCounter';

export default function Home() {
  const [tab, setTab] = useState<'player' | 'spectator'>('player');
  const [spectatorMessage, setSpectatorMessage] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  // Default test user
  const testUserId = '11111111-1111-1111-1111-111111111111';

  const handleClaimSpectatorPass = async () => {
    setClaiming(true);
    setSpectatorMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/api/v1/spectator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId }),
      });
      const data = await res.json();
      setSpectatorMessage(data.message);
    } catch (err: any) {
      setSpectatorMessage('Failed to claim pass.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Auth */}
        <header className="flex justify-between items-center bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Annual College Derby</span>
            <h1 className="text-2xl font-black text-white">Staff XI vs Student XI</h1>
          </div>
          <AuthButton />
        </header>

        {/* Hero Match Details Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="text-xs text-indigo-300 font-semibold uppercase">Date & Time</p>
              <p className="text-lg font-bold text-white mt-1">Saturday, Oct 24 • 15:00 UTC</p>
            </div>
            <div>
              <p className="text-xs text-indigo-300 font-semibold uppercase">Venue</p>
              <p className="text-lg font-bold text-white mt-1">Main Campus Stadium</p>
            </div>
            <div>
              <p className="text-xs text-indigo-300 font-semibold uppercase">Capacity Limit</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">18 Players per Squad</p>
            </div>
          </div>
        </div>

        {/* Live Counter */}
        <section>
          <SquadCounter />
        </section>

        {/* Portal Switcher (Player vs Spectator) */}
        <section className="bg-slate-800 p-8 rounded-2xl border border-slate-700 space-y-6">
          <div className="flex border-b border-slate-700 pb-4">
            <button
              onClick={() => setTab('player')}
              className={`pb-2 px-4 font-bold text-sm transition-colors border-b-2 ${
                tab === 'player'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              ⚽ Register as Player
            </button>
            <button
              onClick={() => setTab('spectator')}
              className={`pb-2 px-4 font-bold text-sm transition-colors border-b-2 ${
                tab === 'spectator'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              🎟️ Claim Spectator Pass
            </button>
          </div>

          {tab === 'player' ? (
            <RegistrationForm userId={testUserId} />
          ) : (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <h3 className="text-xl font-bold">Claim Your Digital Match Pass</h3>
              <p className="text-sm text-slate-400">
                Want to watch the derby from the stands? Claim your digital pass for stadium entry and fan giveaways!
              </p>
              {spectatorMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-sm">
                  {spectatorMessage}
                </div>
              )}
              <button
                onClick={handleClaimSpectatorPass}
                disabled={claiming}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-slate-950 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                {claiming ? 'Generating Ticket...' : 'Get Fan Pass'}
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
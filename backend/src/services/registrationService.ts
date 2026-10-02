import { supabaseAdmin } from '../lib/supabase.js';
import type { RegisterPlayerDTO, RegistrationResult } from '../types/index.js';

const SQUAD_LIMIT = 18;

export class RegistrationService {
  /**
   * Registers a player for either Staff or Student team,
   * enforcing the 18-player squad cap limit.
   */
  static async registerPlayer(payload: RegisterPlayerDTO): Promise<RegistrationResult> {
    const { userId, team, position, squadNumber } = payload;

    // 1. Check current approved count for the chosen team
    const { count, error: countError } = await supabaseAdmin
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('team', team)
      .eq('status', 'approved');

    if (countError) {
      throw new Error(`Database error checking squad size: ${countError.message}`);
    }

    const currentApprovedCount = count ?? 0;

    // 2. Determine status based on squad cap rule
    const assignedStatus = currentApprovedCount >= SQUAD_LIMIT ? 'waitlisted' : 'approved';

    // 3. Insert player record into database
    const { data: newPlayer, error: insertError } = await supabaseAdmin
      .from('players')
      .insert({
        user_id: userId,
        team: team,
        position: position,
        squad_number: squadNumber ?? null,
        status: assignedStatus,
      })
      .select()
      .single();

    if (insertError) {
      // Handle unique constraint error (User already registered)
      if (insertError.code === '23505') {
        return {
          success: false,
          status: 'rejected',
          message: 'You have already submitted a registration for this match.',
        };
      }
      throw new Error(`Failed to insert player: ${insertError.message}`);
    }

    // 4. Return success response with context
    const message = assignedStatus === 'approved'
      ? `Registration successful! You are in the starting squad for ${team.toUpperCase()} XI.`
      : `The ${team.toUpperCase()} XI squad is full (18/18). You have been placed on the waitlist.`;

    return {
      success: true,
      status: assignedStatus,
      message,
      player: newPlayer,
    };
  }
}
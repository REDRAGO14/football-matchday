import { supabaseAdmin } from '../lib/supabase.js';
import type { RegisterPlayerDTO, RegistrationResult } from '../types/index.js';

const SQUAD_LIMIT = 18;
export interface SquadStatsDTO {
  studentCount: number;
  staffCount: number;
  maxCap: number;
} 
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
  static async getSquadStats(): Promise<SquadStatsDTO> {
  const SQUAD_LIMIT = 18;

  // Run database queries concurrently for maximum efficiency
  const [studentRes, staffRes] = await Promise.all([
    supabaseAdmin
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('team', 'student')
      .eq('status', 'approved'),
    supabaseAdmin
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('team', 'staff')
      .eq('status', 'approved'),
  ]);

  if (studentRes.error) {
    throw new Error(`Failed to fetch student count: ${studentRes.error.message}`);
  }
  if (staffRes.error) {
    throw new Error(`Failed to fetch staff count: ${staffRes.error.message}`);
  }

  return {
    studentCount: studentRes.count ?? 0,
    staffCount: staffRes.count ?? 0,
    maxCap: SQUAD_LIMIT,
  };
}
static async claimSpectatorPass(userId: string) {
  const ticketCode = `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const { data, error } = await supabaseAdmin
    .from('spectators')
    .insert({ user_id: userId, ticket_code: ticketCode })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: 'You have already claimed your spectator match pass!' };
    }
    throw new Error(error.message);
  }

  return { success: true, message: 'Digital Match Pass claimed successfully!', pass: data };
}
}
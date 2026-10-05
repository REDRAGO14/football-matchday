import type { FastifyRequest, FastifyReply } from 'fastify';
import { supabaseAdmin } from '../lib/supabase.js';

export async function adminGuard(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.headers['x-user-id'] as string;

  if (!userId) {
    return reply.status(401).send({ error: 'Unauthorized', message: 'User context missing' });
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !profile || (profile.role !== 'organizer' && profile.role !== 'admin')) {
    return reply.status(403).send({ error: 'Forbidden', message: 'Organizer access required' });
  }
}
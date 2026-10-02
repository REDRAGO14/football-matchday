import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import { supabaseAdmin } from './lib/supabase.js';

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });

// Health check endpoint with Database connectivity test
fastify.get('/health', async (request, reply) => {
  try {
    // Quick test query to verify Supabase connectivity
    const { count, error } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return { 
      status: 'ok', 
      database: 'connected', 
      totalProfiles: count ?? 0,
      timestamp: new Date().toISOString() 
    };
  } catch (err: any) {
    fastify.log.error(err);
    return reply.status(500).send({ status: 'error', message: err.message });
  }
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    console.log(`🚀 Fastify Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
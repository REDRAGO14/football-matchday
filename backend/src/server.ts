import Fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import { supabaseAdmin } from './lib/supabase.js';
import { registrationRoutes } from './routes/registrationRoutes.js';

dotenv.config();

const fastify = Fastify({ logger: true });

// Enable CORS for frontend integration
fastify.register(cors, { origin: true });

// Register API Routes
fastify.register(registrationRoutes, { prefix: '/api/v1' });

// Health Check Endpoint
fastify.get('/health', async (request, reply) => {
  try {
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
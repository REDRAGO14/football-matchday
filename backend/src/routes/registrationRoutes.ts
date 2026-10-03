import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { RegistrationService } from '../services/registrationService.js';
import type { RegisterPlayerDTO } from '../types/index.js';
import { registerPlayerSchema, getSquadStatsSchema } from '../schemas/registrationSchema.js';

export async function registrationRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // POST /api/v1/register
  fastify.post<{ Body: RegisterPlayerDTO }>(
    '/register',
    { schema: registerPlayerSchema },
    async (request, reply) => {
      try {
        const payload = request.body;

        // Execute core business logic via service layer
        const result = await RegistrationService.registerPlayer(payload);

        return reply.status(200).send(result);
      } catch (error: any) {
        fastify.log.error(error);
        
        return reply.status(500).send({
          statusCode: 500,
          error: 'Internal Server Error',
          message: error.message || 'An unexpected database error occurred.'
        });
      }
    }
  );
  fastify.get(
  '/squad-stats',
  { schema: getSquadStatsSchema },
  async (request, reply) => {
    try {
      const stats = await RegistrationService.getSquadStats();
      return reply.status(200).send(stats);
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message || 'Failed to retrieve squad statistics.'
      });
    }
  }
);
// POST /api/v1/spectator
fastify.post<{ Body: { userId: string } }>('/spectator', async (request, reply) => {
  try {
    const { userId } = request.body;
    if (!userId) return reply.status(400).send({ message: 'User ID required' });
    
    const result = await RegistrationService.claimSpectatorPass(userId);
    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(500).send({ message: err.message });
  }
});
}
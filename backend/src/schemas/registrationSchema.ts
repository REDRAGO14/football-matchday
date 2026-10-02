import type { FastifySchema } from 'fastify';

/**
 * JSON Schema for POST /api/v1/register
 * Enforces payload structure before execution
 */
export const registerPlayerSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['userId', 'team', 'position'],
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
        description: 'Valid Supabase Auth User UUID'
      },
      team: {
        type: 'string',
        enum: ['student', 'staff'],
        description: 'Target squad selection'
      },
      position: {
        type: 'string',
        enum: ['GK', 'DEF', 'MID', 'FWD'],
        description: 'Primary pitch position'
      },
      squadNumber: {
        type: 'integer',
        minimum: 1,
        maximum: 99,
        description: 'Optional preferred jersey number'
      }
    },
    additionalProperties: false // Reject unexpected fields
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        status: { type: 'string', enum: ['approved', 'waitlisted', 'rejected'] },
        message: { type: 'string' },
        player: { type: 'object', nullable: true }
      }
    },
    400: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};
// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { redeemApiKey, createApiKey } from './constants';

/**
 * For more info on types and bindings
 * @see https://hono.dev/getting-started/cloudflare-workers#types
 */
type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', prettyJSON());
app.use('*', cors());
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

/**
 * Evaluate the status of the server
 */
app.get('/', async (c) => c.json({ success: true }));

/**
 * Get data for an invite code in the db
 *
 * Returns the whole invite code back to the client
 */
app.get('/api/invite-code/:code', async (c) => {
  const { code } = c.req.param();
  if (!code) {
    return c.json({ error: 'Missing code in params' }, 400);
  }
  const { results, success } = await c.env.DB.prepare(
    `SELECT * FROM InviteCode WHERE code = '${code}'`,
  ).all();

  if (success && results && results.length > 0) {
    return c.json({ results, success: true }, 200);
  }

  return c.json({ error: 'Not found' }, 400);
});

/**
 * Increment the `used` attribute for an invite code by 1
 *
 * Request body:
 * 1. API Key
 */
app.post('/api/invite-code/:code/redeem', async (c) => {
  const { code } = c.req.param();
  const { apiKey } = await c.req.json<{ apiKey: string }>();
  if (!apiKey) {
    return c.json({ error: 'Missing api key in req body' }, 400);
  }
  if (apiKey !== redeemApiKey) {
    return c.json({ error: 'API Key in req body is incorrect' }, 400);
  }

  /**
   * Redeem a code, used must be less than max
   */
  const { results, success } = await c.env.DB.prepare(
    `UPDATE InviteCode SET used = used + 1 WHERE code = '${code}' AND used < max`,
  ).all();

  if (!success || (results && (results as any).changes === 0)) {
    return c.json(
      {
        error:
          'Failed to redeem code, either the max has been reached or code is incorrect',
      },
      400,
    );
  }

  if (success) {
    return c.json(
      {
        message: 'Code redeemed successfully',
        success: true,
      },
      200,
    );
  }

  return c.json({ error: 'Error redeeming code' }, 400);
});

/**
 * Create an invite code
 *
 * Request body:
 * 1. API Key
 */
app.post('/api/invite-code/:code/create', async (c) => {
  const { code } = c.req.param();
  const { apiKey, max } = await c.req.json<{ apiKey: string; max: number }>();
  if (!apiKey) {
    return c.json({ error: 'Missing api key in req body' }, 400);
  }
  if (!max) {
    return c.json({ error: 'Missing max in req body' }, 400);
  }
  if (apiKey !== createApiKey) {
    return c.json({ error: 'API Key in req body is incorrect' }, 400);
  }

  /**
   * Inserts a new invite code
   */
  try {
    const { success } = await c.env.DB.prepare(
      `INSERT INTO InviteCode (code, used, max) VALUES ('${code}', 0, ${max})`,
    ).all();

    if (!success) {
      return c.json({ error: 'Failed to create code' }, 400);
    }

    if (success) {
      return c.json(
        {
          message: `Invite code ${code} created successfully`,
          success: true,
        },
        200,
      );
    }

    return c.json({ error: 'Error creating code' }, 400);
  } catch (err) {
    return c.json(
      { error: 'Error creating code, may have already been used' },
      400,
    );
  }
});

export default app;

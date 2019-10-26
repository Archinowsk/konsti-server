// @flow
import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { validateAuthHeader } from 'utils/authHeader';
import type { $Request, $Response, Middleware } from 'express';

export const toggleAppOpen: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/toggle-app-open');
  const appOpen = req.body.appOpen;

  const authHeader = req.headers.authorization;
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    return res.sendStatus(401);
  }

  try {
    const response = await db.settings.saveToggleAppOpen(appOpen);
    return res.json({
      message: 'Update app open success',
      status: 'success',
      appOpen: response.appOpen,
    });
  } catch (error) {
    return res.json({
      message: 'Update app open failure',
      status: 'error',
      error,
    });
  }
};

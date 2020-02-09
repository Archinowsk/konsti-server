import { logger } from 'utils/logger';
import { db } from 'db/mongodb';
import { validateAuthHeader } from 'utils/authHeader';
import { $Request, $Response, Middleware } from 'express';

// Add open signup time to server settings
const postSignupTime: Middleware = async (
  req: $Request,
  res: $Response
): Promise<void> => {
  logger.info('API call: POST /api/signuptime');
  const signupTime = req.body.signupTime;

  const authHeader = req.headers.authorization;
  // @ts-ignore
  const validToken = validateAuthHeader(authHeader, 'admin');

  if (!validToken) {
    return res.sendStatus(401);
  }

  try {
    const response = await db.settings.saveSignupTime(signupTime);
    return res.json({
      message: 'Signup time set success',
      status: 'success',
      signupTime: response.signupTime,
    });
  } catch (error) {
    return res.json({
      message: 'Signup time set failure',
      status: 'error',
      error,
    });
  }
};

export { postSignupTime };
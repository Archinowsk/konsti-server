import bcrypt from 'bcryptjs';
import { logger } from 'utils/logger';

const saltLength = 10;

const hashPassword = async (password: string): Promise<any> => {
  try {
    return await bcrypt.hash(password, saltLength);
  } catch (error) {
    logger.error(`bcrypt.hash error: ${error}`);
  }
};

const comparePasswordHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`bcrypt.compare error: ${error}`);
  }
  return false;
};

const validateLogin = async (password: string, hash: string): Promise<any> => {
  let hashResponse;
  try {
    hashResponse = await comparePasswordHash(password, hash);
  } catch (error) {
    logger.error(`comparePasswordHash error: ${error}`);
    return error;
  }

  if (hashResponse) {
    return true;
  }

  return false;
};

export { hashPassword, validateLogin };

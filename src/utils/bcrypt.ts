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
): Promise<void> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error(`bcrypt.compare error: ${error}`);
  }
};

const validateLogin = async (password: string, hash: string): Promise<any> => {
  let hashResponse = null;
  try {
    // @ts-ignore
    hashResponse = await comparePasswordHash(password, hash);
  } catch (error) {
    logger.error(`comparePasswordHash error: ${error}`);
    return error;
  }

  if (hashResponse === true) {
    return true;
  }

  return false;
};

export { hashPassword, validateLogin };

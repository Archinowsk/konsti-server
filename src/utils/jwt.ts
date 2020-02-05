import jsonwebtoken from 'jsonwebtoken';
import { config } from 'config';
import { JWTResult, JWTError } from 'typings/jwt.typings';
import { UserGroup } from 'typings/user.typings';

const getSecret = (userGroup: UserGroup) => {
  if (userGroup === 'admin') {
    return config.jwtSecretKeyAdmin;
  } else if (userGroup === 'user') {
    return config.jwtSecretKey;
  } else if (userGroup === 'help') {
    return config.jwtSecretKey;
  }
  return '';
};

export const getJWT = (userGroup: UserGroup, username: string): string => {
  const options = {
    expiresIn: '2 days',
  };

  return jsonwebtoken.sign(
    { username, userGroup },
    getSecret(userGroup),
    options
  );
};

export const verifyJWT = (
  jwt: string,
  userGroup: UserGroup
): JWTResult | JWTError => {
  try {
    return jsonwebtoken.verify(jwt, getSecret(userGroup));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { status: 'error', message: 'expired jwt' };
    }
  }

  return { status: 'error', message: 'unknown jwt error' };
};

export const decodeJWT = (jwt: string) => {
  return jsonwebtoken.decode(jwt);
};

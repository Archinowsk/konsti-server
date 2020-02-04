import 'array-flat-polyfill';
import { logger } from 'utils/logger';

// Don't show info or debug logging in tests
// @ts-ignore
logger.info = jest.fn();
// @ts-ignore
logger.debug = jest.fn();

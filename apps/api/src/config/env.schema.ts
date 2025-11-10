/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import joi from 'joi';

/**
 * Joi schema for validating environment variables.
 * @type {import("joi").ObjectSchema}
 */
export const envSchema: joi.ObjectSchema = joi.object({
  /**
   * The environment in which the application runs.
   * It can be either 'development' or 'production'.
   * @type {string}
   */
  NODE_ENV: joi.string().valid('development', 'production').required(),

  /**
   * The port number on which the server listens.
   * @type {number}
   */
  PORT: joi.number().required(),

  /**
   * The secret key used for cookies.
   * @type {string}
   */
  COOKIE_SECRET: joi.string().required(),

  /**
   * The secret key used for encryption.
   * @type {string}
   */
  ENCRYPT_SECRET: joi.string().required(),

  /**
   * The secret key used for create / decrypt websocket tokens.
   * @type {string}
   */
  JWT_SECRET: joi.string().required(),

  /**
   * The host address for Redis.
   * @type {string}
   */
  REDIS_HOST: joi.string().required(),

  /**
   * The port number for Redis.
   * @type {number}
   */
  REDIS_PORT: joi.number().required(),

  /**
   * The username for accessing Redis (if applicable).
   * @type {string}
   */
  REDIS_USERNAME: joi.string().required(),

  /**
   * The password for accessing Redis (if applicable).
   * @type {string}
   */
  REDIS_PASSWORD: joi.string().required(),
});

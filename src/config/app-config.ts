import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
const loadEnvVariables = () => {
  dotenv.config();
  return process.env;
};

// Define configuration schema for environment variables validation
const createConfigSchema = (nodeEnv: string) => {
  return z.object({
    // Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    DATABASE_URL: nodeEnv === 'development' 
      ? z.string().optional().default('postgresql://postgres:postgres@localhost:5432/ez_be_instance_dev?schema=public')
      : z.string(),

    // Server
    PORT: z.coerce.number().default(3000),
    HOST: z.string().default('localhost'),

    // JWT
    JWT_SECRET: nodeEnv === 'development'
      ? z.string().optional().default('dev_secret_key_for_development_only')
      : z.string(),
    JWT_REFRESH_SECRET: nodeEnv === 'development'
      ? z.string().optional().default('dev_refresh_secret_key_for_development_only')
      : z.string(),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'), // 15 minutes
    JWT_REFRESH_EXPIRATION: z.string().default('7d'), // 7 days
    
    // Cookie settings
    COOKIE_SECRET: nodeEnv === 'development'
      ? z.string().optional().default('dev_cookie_secret_key_for_development_only')
      : z.string(),
    COOKIE_DOMAIN: z.string().optional(),
    COOKIE_SECURE: z.boolean().default(nodeEnv === 'production'),
    COOKIE_SAME_SITE: z.enum(['strict', 'lax', 'none']).default('lax'),

    // CSRF
    CSRF_SECRET: nodeEnv === 'development'
      ? z.string().optional().default('dev_csrf_secret_key_for_development_only')
      : z.string(),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  });
};

// Define configuration type
export type AppConfig = z.infer<ReturnType<typeof createConfigSchema>>;

// Validate environment variables and create config
const validateConfig = (env: NodeJS.ProcessEnv): AppConfig => {
  const nodeEnv = env.NODE_ENV || 'development';
  const schema = createConfigSchema(nodeEnv);

  try {
    return schema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingEnvVars = error.errors.map(err => err.path.join('.'));
      console.error(`❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
      process.exit(1);
    }
    
    throw error;
  }
};

// Create and export config
const env = loadEnvVariables();
export const config = validateConfig(env); 
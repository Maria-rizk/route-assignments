import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { config } from 'dotenv';

const envFile = resolve(process.cwd(), '.env');

if (existsSync(envFile)) {
    config({ path: envFile });
} else {

    config();
    console.warn('[config] No .env file found - copy .env.example to .env and fill in your local values.');
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT || '3000');

export const APPLICATION_NAME = process.env.APPLICATION_NAME || 'social-media-app';

export const CLIENT_IDS = process.env.CLIENT_IDS?.split(',') || [];
export const DB_URL = (process.env.DB_URL || 'mongodb://127.0.0.1:27017/social-media-app') as string;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

export const IV_LENGTH = process.env.IV_LENGTH;
export const ENCRYPTION_byte = process.env.ENCRYPTION_byte;

export const user_access_token_secret = process.env.user_access_token_secret;
export const refresh_user_token_secret = process.env.refresh_user_token_secret;
export const system_access_token_secret = process.env.system_access_token_secret;
export const refresh_system_token_secret = process.env.refresh_system_token_secret;

export const access_token_expires_in = parseInt(process.env.access_token_expires_in ?? '1800');
export const refresh_token_expires_in = parseInt(process.env.refresh_token_expires_in ?? '31536000') as number;

export const REDIS_URI = process.env.REDIS_URI || 'redis://127.0.0.1:6379';

export const UPLOADS_DIR = process.env.UPLOADS_DIR || resolve(process.cwd(), 'uploads');


export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';
export const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

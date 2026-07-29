import crypto from 'node:crypto';
import { ENCRYPTION_byte, IV_LENGTH } from '../../../config/config.service.js';

// Falls back to development-only defaults so the app still boots without a
// .env file, but logs a loud warning - production-grade secrets must always
// come from the environment.
const ivLength = IV_LENGTH ? parseInt(IV_LENGTH) : 16;

function resolveKey(): Buffer {
  if (!ENCRYPTION_byte) {
    console.warn(
      '[security] ENCRYPTION_byte is not set in .env - using an insecure development-only key. ' +
        'Set ENCRYPTION_byte to a random 32-byte value for anything beyond local testing.'
    );
    return Buffer.from('00000000000000000000000000000000');
  }

  // Accept either a 32-char plain string or a hex-encoded 32-byte key.
  const asHex = Buffer.from(ENCRYPTION_byte, 'hex');
  if (asHex.length === 32) return asHex;

  return Buffer.from(ENCRYPTION_byte.padEnd(32, '0').slice(0, 32));
}

const ENCRYPTION_SECRET_KEY = resolveKey();

export const encrypt = async (text: string): Promise<string> => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);
  let encryptedData = cipher.update(text, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return `${iv.toString('hex')}:${encryptedData}`;
};

export const decrypt = async (encryptedData: string): Promise<string> => {
  const [iv, encryptedText] = encryptedData.split(':') || ([] as string[]);
  if (!iv || !encryptedText) {
    throw new Error('Invalid encrypted data format');
  }
  const binaryLikeIv = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, binaryLikeIv);
  let decryptedData = decipher.update(encryptedText, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
};

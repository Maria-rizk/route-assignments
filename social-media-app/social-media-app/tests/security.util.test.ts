import { describe, expect, it } from '@jest/globals';
import { generateHash, compareHash } from '../src/common/utils/security/hash.security.js';
import { encrypt, decrypt } from '../src/common/utils/security/encription.security.js';

describe('hash.security', () => {
  it('hashes a value and can verify it against the original plaintext', async () => {
    const plaintext = 'super-secret-password';
    const hashed = await generateHash({ plaintext });

    expect(hashed).not.toBe(plaintext);
    await expect(compareHash({ plaintext, cypherText: hashed })).resolves.toBe(true);
    await expect(compareHash({ plaintext: 'wrong-password', cypherText: hashed })).resolves.toBe(false);
  });
});

describe('encription.security', () => {
  it('encrypts and decrypts back to the original value', async () => {
    const original = '+201234567890';
    const encrypted = await encrypt(original);

    expect(encrypted).not.toBe(original);
    expect(encrypted).toContain(':');

    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('produces a different ciphertext each time (random IV)', async () => {
    const first = await encrypt('same-input');
    const second = await encrypt('same-input');
    expect(first).not.toBe(second);
  });
});

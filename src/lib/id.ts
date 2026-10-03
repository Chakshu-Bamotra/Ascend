const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

/** Short local id for sets / exercise instances inside a workout doc. Not for Firestore doc ids. */
export function createId(length = 12): string {
  let id = '';
  for (let i = 0; i < length; i++) id += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return id;
}

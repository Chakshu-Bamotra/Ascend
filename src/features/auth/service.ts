import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from '@react-native-firebase/auth';

import { createUserDoc } from '@/features/profile/service';
import { auth } from '@/lib/firebase';

export async function signUp(email: string, password: string): Promise<void> {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await createUserDoc(user.uid);
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email.trim(), password);
}

/** Resolves even for unknown emails so the UI never reveals whether an account exists. */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === 'auth/user-not-found') return;
    throw e;
  }
}

export function signOut(): Promise<void> {
  return fbSignOut(auth);
}

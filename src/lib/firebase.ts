/**
 * The only module that imports React Native Firebase directly.
 * Features import `auth` and `db` from here, never from the packages.
 * Native config comes from google-services.json (see README).
 */
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

const app = getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

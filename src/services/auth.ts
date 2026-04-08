import { 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  User
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const authService = {
  subscribeToAuthChanges: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  signInWithGoogle: () => {
    return signInWithPopup(auth, googleProvider);
  },

  signOut: () => {
    return firebaseSignOut(auth);
  }
};

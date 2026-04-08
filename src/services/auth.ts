import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
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

  signIn: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: () => {
    return signInWithPopup(auth, googleProvider);
  },

  register: (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  signOut: () => {
    return firebaseSignOut(auth);
  }
};

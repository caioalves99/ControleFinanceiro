import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "../firebase";

export const authService = {
  subscribeToAuthChanges: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  signIn: (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  register: (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  signOut: () => {
    return firebaseSignOut(auth);
  }
};

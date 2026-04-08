import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase";
import { FinanceTransaction } from "../models/transaction";

export const firestoreService = {
  getTransactions: (uid: string, month: string, callback: (transactions: FinanceTransaction[]) => void) => {
    const q = query(
      collection(db, "users", uid, "transactions"),
      where("month", "==", month),
      orderBy("date", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: (doc.data().date as Timestamp).toDate(),
      } as FinanceTransaction));
      callback(transactions);
    });
  },

  addTransaction: (uid: string, transaction: Omit<FinanceTransaction, 'id'>) => {
    return addDoc(collection(db, "users", uid, "transactions"), {
      ...transaction,
      date: Timestamp.fromDate(transaction.date)
    });
  },

  deleteTransaction: (uid: string, transactionId: string) => {
    return deleteDoc(doc(db, "users", uid, "transactions", transactionId));
  },

  getAllTransactions: async (uid: string) => {
    const q = query(
      collection(db, "users", uid, "transactions"),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    } as FinanceTransaction));
  }
};

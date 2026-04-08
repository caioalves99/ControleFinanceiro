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
    try {
      // Simplificando a query para evitar a necessidade de índice composto inicialmente
      const q = query(
        collection(db, "users", uid, "transactions"),
        where("month", "==", month)
      );

      return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => {
          const data = doc.data();
          let date = new Date();
          
          if (data.date instanceof Timestamp) {
            date = data.date.toDate();
          } else if (data.date?.toDate) {
            date = data.date.toDate();
          } else if (data.date) {
            date = new Date(data.date);
          }

          return {
            id: doc.id,
            ...data,
            date: date,
          } as FinanceTransaction;
        });
        
        // Ordenar manualmente no cliente para evitar erros de índice composto no Firebase
        transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        callback(transactions);
      }, (error) => {
        console.error("Erro no onSnapshot do Firestore:", error);
        alert("Erro ao buscar transações: " + error.message);
      });
    } catch (error: any) {
      console.error("Erro ao configurar listener do Firestore:", error);
      return () => {};
    }
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

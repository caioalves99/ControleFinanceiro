import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/transaction.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream of transactions for a specific user and month
  Stream<List<FinanceTransaction>> getTransactions(String uid, String month) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .where('month', isEqualTo: month)
        .orderBy('date', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => FinanceTransaction.fromFirestore(doc))
            .toList());
  }

  // Add a new transaction
  Future<void> addTransaction(String uid, FinanceTransaction transaction) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .add(transaction.toMap());
  }

  // Delete a transaction
  Future<void> deleteTransaction(String uid, String transactionId) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .doc(transactionId)
        .delete();
  }

  // Stream of all transactions for historical comparison
  Stream<List<FinanceTransaction>> getAllTransactions(String uid) {
    return _db
        .collection('users')
        .doc(uid)
        .collection('transactions')
        .orderBy('date', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => FinanceTransaction.fromFirestore(doc))
            .toList());
  }
}

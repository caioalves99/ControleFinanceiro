import 'package:cloud_firestore/cloud_firestore.dart';

enum TransactionType { entrada, saida }

class FinanceTransaction {
  final String id;
  final String description;
  final TransactionType type;
  final double value;
  final DateTime date;
  final String month; // format "yyyy-MM" for filtering
  final String icon;

  FinanceTransaction({
    required this.id,
    required this.description,
    required this.type,
    required this.value,
    required this.date,
    required this.month,
    this.icon = '💰',
  });

  factory FinanceTransaction.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return FinanceTransaction(
      id: doc.id,
      description: data['description'] ?? '',
      type: data['type'] == 'entrada' ? TransactionType.entrada : TransactionType.saida,
      value: (data['value'] ?? 0.0).toDouble(),
      date: (data['date'] as Timestamp).toDate(),
      month: data['month'] ?? '',
      icon: data['icon'] ?? '💰',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'description': description,
      'type': type == TransactionType.entrada ? 'entrada' : 'saida',
      'value': value,
      'date': Timestamp.fromDate(date),
      'month': month,
      'icon': icon,
    };
  }
}

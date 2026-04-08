import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../theme.dart';

class SummaryCard extends StatelessWidget {
  final String label;
  final double value;
  final Color accentColor;
  final String delta;
  final bool deltaUp;

  const SummaryCard({
    super.key,
    required this.label,
    required this.value,
    required this.accentColor,
    required this.delta,
    required this.deltaUp,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.simpleCurrency(locale: 'pt_BR');

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border(
          top: BorderSide(color: accentColor, width: 2),
          left: const BorderSide(color: AppTheme.border),
          right: const BorderSide(color: AppTheme.border),
          bottom: const BorderSide(color: AppTheme.border),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 10,
              letterSpacing: 2,
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            currencyFormat.format(value),
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontSize: 28,
                  color: accentColor,
                ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: accentColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  delta,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                    color: accentColor,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              const Text(
                'vs. mês anterior',
                style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

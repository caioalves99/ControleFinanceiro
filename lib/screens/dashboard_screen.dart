import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';
import '../models/transaction.dart';
import '../services/firestore_service.dart';
import '../theme.dart';
import '../widgets/summary_card.dart';
import '../widgets/bar_chart_widget.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String selectedMonth = DateFormat('yyyy-MM').format(DateTime.now());
  final List<String> months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  void _addTransaction() {
    showDialog(
      context: context,
      builder: (context) => const TransactionDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<User?>();
    final firestore = context.read<FirestoreService>();

    return Scaffold(
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 220,
            color: AppTheme.surface,
            child: Column(
              children: [
                const Padding(
                  padding: EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Text('FinTrack', style: TextStyle(
                        fontFamily: 'Syne',
                        fontWeight: FontWeight.w800,
                        fontSize: 22,
                        color: AppTheme.text,
                      )),
                      Text('CONTROLE FINANCEIRO', style: TextStyle(
                        fontSize: 10,
                        letterSpacing: 2,
                        color: AppTheme.textMuted,
                      )),
                    ],
                  ),
                ),
                const Divider(),
                Expanded(
                  child: ListView(
                    children: const [
                      _SidebarItem(label: 'Dashboard', icon: Icons.dashboard, active: true),
                      _SidebarItem(label: 'Transações', icon: Icons.list),
                      _SidebarItem(label: 'Análises', icon: Icons.analytics),
                      _SidebarItem(label: 'Comparativo', icon: Icons.compare_arrows),
                    ],
                  ),
                ),
                // Month selector in sidebar
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppTheme.surface2,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          DateFormat('MMM yyyy').format(DateTime.parse('$selectedMonth-01')),
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.chevron_left, size: 18),
                              onPressed: () {
                                setState(() {
                                  final date = DateTime.parse('$selectedMonth-01');
                                  selectedMonth = DateFormat('yyyy-MM').format(DateTime(date.year, date.month - 1));
                                });
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.chevron_right, size: 18),
                              onPressed: () {
                                setState(() {
                                  final date = DateTime.parse('$selectedMonth-01');
                                  selectedMonth = DateFormat('yyyy-MM').format(DateTime(date.year, date.month + 1));
                                });
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Main Content
          Expanded(
            child: Column(
              children: [
                // Topbar
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 24),
                  decoration: const BoxDecoration(
                    color: AppTheme.surface,
                    border: Border(bottom: BorderSide(color: AppTheme.border)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Dashboard', style: TextStyle(
                        fontFamily: 'Syne',
                        fontWeight: FontWeight.w700,
                        fontSize: 20,
                      )),
                      Row(
                        children: [
                          ElevatedButton.icon(
                            onPressed: _addTransaction,
                            icon: const Icon(Icons.add),
                            label: const Text('Nova Transação'),
                          ),
                          const SizedBox(width: 12),
                          CircleAvatar(
                            backgroundColor: AppTheme.accentBlue,
                            child: Text(user?.email?.substring(0, 1).toUpperCase() ?? 'U', style: const TextStyle(color: Colors.black)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                // Page Content
                Expanded(
                  child: StreamBuilder<List<FinanceTransaction>>(
                    stream: firestore.getTransactions(user!.uid, selectedMonth),
                    builder: (context, snapshot) {
                      if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
                      
                      final transactions = snapshot.data!;
                      final totalIncome = transactions.where((t) => t.type == TransactionType.entrada).fold(0.0, (s, t) => s + t.value);
                      final totalExpense = transactions.where((t) => t.type == TransactionType.saida).fold(0.0, (s, t) => s + t.value);
                      final balance = totalIncome - totalExpense;

                      return SingleChildScrollView(
                        padding: const EdgeInsets.all(36),
                        child: Column(
                          children: [
                            // Summary Cards
                            Row(
                              children: [
                                Expanded(child: SummaryCard(label: 'Total Entradas', value: totalIncome, accentColor: AppTheme.accentGreen, delta: '+12%', deltaUp: true)),
                                const SizedBox(width: 16),
                                Expanded(child: SummaryCard(label: 'Total Saídas', value: totalExpense, accentColor: AppTheme.accentRed, delta: '+4%', deltaUp: false)),
                                const SizedBox(width: 16),
                                Expanded(child: SummaryCard(label: 'Saldo do Mês', value: balance, accentColor: AppTheme.accentBlue, delta: '+28%', deltaUp: true)),
                              ],
                            ),
                            const SizedBox(height: 28),
                            // Charts Row
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Bar Chart
                                Expanded(
                                  flex: 2,
                                  child: Container(
                                    height: 320,
                                    padding: const EdgeInsets.all(24),
                                    decoration: BoxDecoration(
                                      color: AppTheme.surface,
                                      borderRadius: BorderRadius.circular(14),
                                      border: Border.all(color: AppTheme.border),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text('Evolução Mensal', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.w600)),
                                        const Text('Entradas vs. Saídas — últimos 6 meses', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                        const SizedBox(height: 32),
                                        const Expanded(child: BarChartWidget()),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                // Donut Chart / Distribution
                                Expanded(
                                  child: Container(
                                    height: 320,
                                    padding: const EdgeInsets.all(24),
                                    decoration: BoxDecoration(
                                      color: AppTheme.surface,
                                      borderRadius: BorderRadius.circular(14),
                                      border: Border.all(color: AppTheme.border),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text('Distribuição', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.w600)),
                                        const Text('Saídas por categoria', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                        const Spacer(),
                                        const Center(child: Text('62%', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.accentRed))),
                                        const Center(child: Text('GASTO', style: TextStyle(fontSize: 9, letterSpacing: 1, color: AppTheme.textMuted))),
                                        const Spacer(),
                                        _CategoryRow(label: 'Moradia', pct: 35, color: AppTheme.accentBlue),
                                        const SizedBox(height: 8),
                                        _CategoryRow(label: 'Alimentação', pct: 25, color: AppTheme.accentGreen),
                                        const SizedBox(height: 8),
                                        _CategoryRow(label: 'Transporte', pct: 20, color: AppTheme.accentAmber),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 28),
                            Container(
                              decoration: BoxDecoration(
                                color: AppTheme.surface,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: AppTheme.border),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.all(24),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text('Transações do Mês', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.w600)),
                                        Row(
                                          children: [
                                            _FilterChip(label: 'Todos', active: true),
                                            const SizedBox(width: 4),
                                            _FilterChip(label: 'Entradas'),
                                            const SizedBox(width: 4),
                                            _FilterChip(label: 'Saídas'),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Divider(),
                                  if (transactions.isEmpty)
                                    const Padding(
                                      padding: EdgeInsets.all(48),
                                      child: Center(child: Text('Nenhuma transação encontrada para este mês.', style: TextStyle(color: AppTheme.textMuted))),
                                    )
                                  else
                                    ListView.separated(
                                      shrinkWrap: true,
                                      physics: const NeverScrollableScrollPhysics(),
                                      itemCount: transactions.length,
                                      separatorBuilder: (_, __) => const Divider(),
                                      itemBuilder: (context, index) {
                                        final t = transactions[index];
                                        return ListTile(
                                          leading: Container(
                                            width: 36, height: 36,
                                            decoration: BoxDecoration(
                                              color: (t.type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.accentRed).withOpacity(0.1),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: Center(child: Text(t.icon)),
                                          ),
                                          title: Text(t.description, style: const TextStyle(fontSize: 13)),
                                          subtitle: Text(DateFormat('dd/MM/yyyy').format(t.date), style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                          trailing: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                decoration: BoxDecoration(
                                                  color: (t.type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.accentRed).withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(5),
                                                ),
                                                child: Text(
                                                  t.type == TransactionType.entrada ? 'entrada' : 'saida',
                                                  style: TextStyle(fontSize: 9, color: t.type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.accentRed),
                                                ),
                                              ),
                                              const SizedBox(width: 14),
                                              Text(
                                                '${t.type == TransactionType.entrada ? '+' : '-'} ${NumberFormat.simpleCurrency(locale: 'pt_BR').format(t.value)}',
                                                style: TextStyle(
                                                  fontFamily: 'Syne',
                                                  fontWeight: FontWeight.w600,
                                                  color: t.type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.accentRed,
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool active;

  const _SidebarItem({required this.label, required this.icon, this.active = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: active ? const Border(left: BorderSide(color: AppTheme.accentGreen, width: 2)) : null,
        color: active ? AppTheme.accentGreen.withOpacity(0.05) : null,
      ),
      child: ListTile(
        leading: Icon(icon, color: active ? AppTheme.accentGreen : AppTheme.textDim, size: 16),
        title: Text(label, style: TextStyle(
          color: active ? AppTheme.accentGreen : AppTheme.textDim,
          fontSize: 13,
          letterSpacing: 0.3,
        )),
        dense: true,
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool active;

  const _FilterChip({required this.label, this.active = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
      decoration: BoxDecoration(
        color: active ? AppTheme.border : AppTheme.surface2,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(label, style: TextStyle(
        fontSize: 11,
        color: active ? AppTheme.text : AppTheme.textMuted,
      )),
    );
  }
}

class TransactionDialog extends StatefulWidget {
  const TransactionDialog({super.key});

  @override
  State<TransactionDialog> createState() => _TransactionDialogState();
}

class _TransactionDialogState extends State<TransactionDialog> {
  final _descriptionController = TextEditingController();
  final _valueController = TextEditingController();
  TransactionType _type = TransactionType.entrada;
  DateTime _date = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final firestore = context.read<FirestoreService>();
    final user = context.read<User?>();

    return AlertDialog(
      backgroundColor: AppTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      title: const Text('Nova Transação', style: TextStyle(fontFamily: 'Syne', fontWeight: FontWeight.w700)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('TIPO', style: TextStyle(fontSize: 10, letterSpacing: 2, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _type = TransactionType.entrada),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: _type == TransactionType.entrada ? AppTheme.accentGreen.withOpacity(0.1) : null,
                      side: BorderSide(color: _type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.border),
                    ),
                    child: Text('↑ Entrada', style: TextStyle(color: _type == TransactionType.entrada ? AppTheme.accentGreen : AppTheme.textDim)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _type = TransactionType.saida),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: _type == TransactionType.saida ? AppTheme.accentRed.withOpacity(0.1) : null,
                      side: BorderSide(color: _type == TransactionType.saida ? AppTheme.accentRed : AppTheme.border),
                    ),
                    child: Text('↓ Saída', style: TextStyle(color: _type == TransactionType.saida ? AppTheme.accentRed : AppTheme.textDim)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text('DESCRIÇÃO', style: TextStyle(fontSize: 10, letterSpacing: 2, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            TextField(controller: _descriptionController, decoration: const InputDecoration(hintText: 'Ex: Salário, Aluguel...')),
            const SizedBox(height: 16),
            const Text('VALOR (R\$)', style: TextStyle(fontSize: 10, letterSpacing: 2, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            TextField(controller: _valueController, decoration: const InputDecoration(hintText: '0,00'), keyboardType: TextInputType.number),
            const SizedBox(height: 16),
            const Text('DATA', style: TextStyle(fontSize: 10, letterSpacing: 2, color: AppTheme.textMuted)),
            const SizedBox(height: 8),
            InkWell(
              onTap: () async {
                final picked = await showDatePicker(context: context, initialDate: _date, firstDate: DateTime(2000), lastDate: DateTime(2100));
                if (picked != null) setState(() => _date = picked);
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppTheme.surface2, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppTheme.border)),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(DateFormat('dd/MM/yyyy').format(_date)),
                    const Icon(Icons.calendar_today, size: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar', style: TextStyle(color: AppTheme.textDim))),
        ElevatedButton(
          onPressed: () async {
            final value = double.tryParse(_valueController.text) ?? 0;
            if (_descriptionController.text.isNotEmpty && value > 0) {
              await firestore.addTransaction(user!.uid, FinanceTransaction(
                id: '',
                description: _descriptionController.text,
                type: _type,
                value: value,
                date: _date,
                month: DateFormat('yyyy-MM').format(_date),
                icon: _type == TransactionType.entrada ? '💰' : '💸',
              ));
              if (mounted) Navigator.pop(context);
            }
          },
          child: const Text('Salvar Transação'),
        ),
      ],
    );
  }
}

class _CategoryRow extends StatelessWidget {
  final String label;
  final int pct;
  final Color color;

  const _CategoryRow({required this.label, required this.pct, required this.color, super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                ),
                const SizedBox(width: 10),
                Text(label, style: const TextStyle(fontSize: 11, color: AppTheme.textDim)),
              ],
            ),
            Text('$pct%', style: const TextStyle(fontSize: 11, color: AppTheme.textDim)),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(2),
          child: LinearProgressIndicator(
            value: pct / 100,
            backgroundColor: AppTheme.border,
            color: color,
            minHeight: 4,
          ),
        ),
      ],
    );
  }
}

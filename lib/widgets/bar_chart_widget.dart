import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../theme.dart';

class BarChartWidget extends StatelessWidget {
  const BarChartWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 10000,
        barTouchData: BarTouchData(enabled: true),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                const style = TextStyle(color: AppTheme.textMuted, fontSize: 10);
                String text;
                switch (value.toInt()) {
                  case 0: text = 'NOV'; break;
                  case 1: text = 'DEZ'; break;
                  case 2: text = 'JAN'; break;
                  case 3: text = 'FEV'; break;
                  case 4: text = 'MAR'; break;
                  case 5: text = 'ABR'; break;
                  default: text = ''; break;
                }
                return SideTitleWidget(axisSide: meta.axisSide, child: Text(text, style: style));
              },
            ),
          ),
          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: const FlGridData(show: false),
        borderData: FlBorderData(show: false),
        barGroups: [
          _makeGroupData(0, 6200, 4800),
          _makeGroupData(1, 7100, 5900),
          _makeGroupData(2, 6800, 4200),
          _makeGroupData(3, 7400, 4900),
          _makeGroupData(4, 7550, 5020),
          _makeGroupData(5, 8450, 5230),
        ],
      ),
    );
  }

  BarChartGroupData _makeGroupData(int x, double income, double expense) {
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(toY: income, color: AppTheme.accentGreen, width: 14, borderRadius: const BorderRadius.vertical(top: Radius.circular(4))),
        BarChartRodData(toY: expense, color: AppTheme.accentRed, width: 14, borderRadius: const BorderRadius.vertical(top: Radius.circular(4))),
      ],
    );
  }
}

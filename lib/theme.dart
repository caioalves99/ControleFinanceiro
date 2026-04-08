import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color background = Color(0xFF0A0A0F);
  static const Color surface = Color(0xFF111118);
  static const Color surface2 = Color(0xFF16161F);
  static const Color border = Color(0xFF1E1E2E);
  static const Color accentGreen = Color(0xFF00E5A0);
  static const Color accentRed = Color(0xFFFF4D6D);
  static const Color accentBlue = Color(0xFF4D9FFF);
  static const Color accentAmber = Color(0xFFFFB830);
  static const Color text = Color(0xFFE8E8F0);
  static const Color textMuted = Color(0xFF5A5A72);
  static const Color textDim = Color(0xFF8888A8);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: accentGreen,
      cardColor: surface,
      dividerColor: border,
      textTheme: GoogleFonts.dmMonoTextTheme().copyWith(
        displayLarge: GoogleFonts.syne(
          fontWeight: FontWeight.w800,
          fontSize: 22,
          color: text,
        ),
        headlineMedium: GoogleFonts.syne(
          fontWeight: FontWeight.w700,
          fontSize: 20,
          color: text,
        ),
        titleLarge: GoogleFonts.syne(
          fontWeight: FontWeight.w600,
          fontSize: 18,
          color: text,
        ),
        bodyLarge: GoogleFonts.dmMono(
          color: text,
          fontSize: 14,
        ),
        bodyMedium: GoogleFonts.dmMono(
          color: textDim,
          fontSize: 13,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface2,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: accentGreen),
        ),
        hintStyle: GoogleFonts.dmMono(color: textMuted),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accentGreen,
          foregroundColor: Colors.black,
          textStyle: GoogleFonts.dmMono(
            fontWeight: FontWeight.w500,
            letterSpacing: 0.5,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
    );
  }
}

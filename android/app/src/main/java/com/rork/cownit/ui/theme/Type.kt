package com.rork.cownit.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
<<<<<<< HEAD
import androidx.compose.ui.text.font.FontFamily
=======
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
<<<<<<< HEAD
 * A tightly tuned typographic scale for a professional dashboard.
 * System font family, deliberate weights, and controlled letter spacing.
 */
private val Sans = FontFamily.Default

val CownTypography = Typography(
    displaySmall = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.SemiBold,
        fontSize = 30.sp,
        lineHeight = 36.sp,
        letterSpacing = (-0.6).sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
        letterSpacing = (-0.4).sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        letterSpacing = (-0.3).sp,
    ),
    titleLarge = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.SemiBold,
        fontSize = 17.sp,
        lineHeight = 22.sp,
        letterSpacing = (-0.2).sp,
    ),
    titleMedium = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
        lineHeight = 20.sp,
        letterSpacing = (-0.1).sp,
    ),
    titleSmall = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 18.sp,
        letterSpacing = 0.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Normal,
        fontSize = 15.sp,
        lineHeight = 22.sp,
        letterSpacing = 0.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 19.sp,
        letterSpacing = 0.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.sp,
    ),
    labelMedium = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 14.sp,
        letterSpacing = 0.4.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = Sans,
        fontWeight = FontWeight.SemiBold,
        fontSize = 10.sp,
        lineHeight = 13.sp,
        letterSpacing = 0.8.sp,
=======
 * Typography for CownIt. Font weights are limited to 400 (body) and 500
 * (headings and labels) — never heavier. System font, sentence case used in copy.
 */
val CownTypography = Typography(
    headlineSmall = TextStyle(
        fontSize = 18.sp,
        lineHeight = 24.sp,
        fontWeight = FontWeight.Medium,
    ),
    titleMedium = TextStyle(
        fontSize = 14.sp,
        lineHeight = 20.sp,
        fontWeight = FontWeight.Medium,
    ),
    titleSmall = TextStyle(
        fontSize = 13.sp,
        lineHeight = 18.sp,
        fontWeight = FontWeight.Medium,
    ),
    bodyLarge = TextStyle(
        fontSize = 14.sp,
        lineHeight = 20.sp,
        fontWeight = FontWeight.Normal,
    ),
    bodyMedium = TextStyle(
        fontSize = 13.sp,
        lineHeight = 18.sp,
        fontWeight = FontWeight.Normal,
    ),
    bodySmall = TextStyle(
        fontSize = 12.sp,
        lineHeight = 17.sp,
        fontWeight = FontWeight.Normal,
    ),
    labelSmall = TextStyle(
        fontSize = 11.sp,
        lineHeight = 15.sp,
        fontWeight = FontWeight.Medium,
>>>>>>> 4bf9e85d0aad0573bdb35b4b2b04a136edc4b6bf
    ),
)
